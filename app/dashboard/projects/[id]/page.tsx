"use client";

import { useEffect, useState, useRef, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Send,
  Loader2,
  FileText,
  Globe,
  Trash2,
  MessageSquare,
  Sparkles,
  ChevronRight,
  File,
  X,
  PlusCircle,
  Clock,
  Presentation,
  FileSpreadsheet,
  Image as ImageIcon,
  Settings,
  Brain,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import ReactMarkdown from "react-markdown";
import ArtifactCard from "@/components/projects/ArtifactCard";
import {
  fetchProject,
  fetchProjectChats,
  createProjectChat,
  fetchProjectChatHistory,
  deleteProjectChat,
  executeProjectTool,
  fetchChatJobs,
  streamJobStatus,
  regenerateJob,
  editJob,
  Project,
  ProjectChat,
  ProjectMessage,
  ToolJob,
} from "@/lib/api/projects";

type IngestionSource = {
  source: string;
  type: 'pdf' | 'website';
  chunk_count: number;
  indexed_at: string;
  is_ready: boolean;
};

export default function ProjectWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  // Failed sends stay visible (marked `_failed`) with a `_retry` action
  // instead of silently disappearing.
  type PendingMessage = ProjectMessage & { _failed?: boolean; _retry?: () => void };

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<PendingMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Ingestion form state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'pdf' | 'url'>('pdf');
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [uploadingState, setUploadingState] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageFeedRef = useRef<HTMLDivElement>(null);

  type ToolTypeOption = 'create_presentation' | 'write_report' | 'analyze_data' | 'generate_image';

  const TOOL_LABELS: Record<ToolTypeOption, string> = {
    create_presentation: "presentation",
    write_report: "report",
    analyze_data: "spreadsheet",
    generate_image: "image",
  };

  const [jobsById, setJobsById] = useState<Record<string, ToolJob>>({});
  const [regeneratingJobId, setRegeneratingJobId] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Opens the SSE job-status stream and keeps jobsById in sync as it updates,
  // replacing the old 2s client polling loop.
  const startJobStream = (jobId: string) => {
    streamJobStatus(projectId, jobId, (job) => {
      setJobsById((prev) => ({ ...prev, [job.id]: job }));
    })
      .then((finalJob) => {
        if (finalJob?.status === "completed") {
          toast.success("Generation completed!");
          queryClient.invalidateQueries({ queryKey: ["usage"] });
        } else if (finalJob?.status === "failed") {
          toast.error(`Generation failed: ${finalJob.error || "unknown error"}`);
        }
      })
      .catch((err) => {
        console.error("Error streaming job status", err);
      });
  };

  const [promptForTool, setPromptForTool] = useState<{ type: ToolTypeOption } | null>(null);
  const [customToolPrompt, setCustomToolPrompt] = useState("");

  const handleExecuteTool = (toolType: ToolTypeOption) => {
    if (!activeChatId) {
      toast.error("Please select or start a chat thread first.");
      return;
    }
    setPromptForTool({ type: toolType });
  };

  const genTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const runTool = async (toolType: ToolTypeOption, userPrompt: string) => {
    if (!activeChatId) return;
    const chatId = activeChatId;

    // Show the user's request and a placeholder immediately instead of waiting
    // on the network round-trip — reconciled with the real records below.
    const tempUserId = genTempId();
    const tempAssistantId = genTempId();
    setMessages((prev) => [
      ...prev,
      { id: tempUserId, chat_id: chatId, role: "user", content: userPrompt, created_at: new Date().toISOString() },
      {
        id: tempAssistantId,
        chat_id: chatId,
        role: "assistant",
        content: `Generating your ${TOOL_LABELS[toolType]}…`,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const { job, user_message, assistant_message } = await executeProjectTool(
        projectId,
        chatId,
        toolType,
        userPrompt
      );
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === tempUserId) return user_message;
          if (m.id === tempAssistantId) return assistant_message;
          return m;
        })
      );
      setJobsById((prev) => ({ ...prev, [job.id]: job }));
      startJobStream(job.id);
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    } catch (err) {
      // Drop the placeholder assistant bubble, but keep the user's request
      // visible with a retry action instead of losing it.
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== tempAssistantId)
          .map((m) =>
            m.id === tempUserId
              ? {
                  ...m,
                  _failed: true,
                  _retry: () => {
                    setMessages((p) => p.filter((x) => x.id !== tempUserId));
                    void runTool(toolType, userPrompt);
                  },
                }
              : m
          )
      );
      throw err;
    }
  };

  const handleGenerateWithPrompt = async () => {
    if (!promptForTool || !customToolPrompt.trim() || !activeChatId || isSending) return;

    const toolType = promptForTool.type;
    const userPrompt = customToolPrompt.trim();

    setPromptForTool(null);
    setCustomToolPrompt("");
    setIsSending(true);

    try {
      await runTool(toolType, userPrompt);
      toast.success("Generation started!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to trigger tool");
    } finally {
      setIsSending(false);
    }
  };

  // Shared by regenerate and edit — repoints the existing chat message to
  // the new job instead of appending a new turn, since neither is a new
  // question, then starts streaming its progress.
  const applyNewJob = (oldJobId: string, newJob: ToolJob) => {
    setMessages((prev) =>
      prev.map((m) => (m.generation_job_id === oldJobId ? { ...m, generation_job_id: newJob.id } : m))
    );
    setJobsById((prev) => ({ ...prev, [newJob.id]: newJob }));
    startJobStream(newJob.id);
  };

  const handleRegenerate = async (job: ToolJob) => {
    if (regeneratingJobId) return;
    setRegeneratingJobId(job.id);
    try {
      const newJob = await regenerateJob(projectId, job.id);
      applyNewJob(job.id, newJob);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to regenerate");
    } finally {
      setRegeneratingJobId(null);
    }
  };

  const handleEdit = async (job: ToolJob, instruction: string) => {
    if (editingJobId) return;
    setEditingJobId(job.id);
    try {
      const newJob = await editJob(projectId, job.id, instruction);
      applyNewJob(job.id, newJob);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to apply edit");
    } finally {
      setEditingJobId(null);
    }
  };

  // Queries
  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
  });

  const { data: chatsData = [], isLoading: isChatsLoading } = useQuery({
    queryKey: ["project-chats", projectId],
    queryFn: async () => {
      const data = await fetchProjectChats(projectId);
      return data || [];
    },
  });
  const chats = chatsData || [];

  const { data: sourcesData = [], refetch: refetchSources } = useQuery<IngestionSource[]>({
    queryKey: ["project-sources", projectId],
    queryFn: async () => {
      const response = await api.get(`/projects/${projectId}/sources`);
      return response.data || [];
    },
  });
  const sources = sourcesData || [];

  // Load chat history + any in-flight/completed generation jobs when the
  // active chat changes, so artifacts survive a page refresh.
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      setJobsById({});
      return;
    }
    const loadHistory = async () => {
      try {
        const [history, jobs] = await Promise.all([
          fetchProjectChatHistory(projectId, activeChatId),
          fetchChatJobs(projectId, activeChatId).catch(() => []),
        ]);
        setMessages(history || []);

        const jobsMap: Record<string, ToolJob> = {};
        for (const job of jobs) {
          jobsMap[job.id] = job;
          if (job.status === "pending" || job.status === "processing") {
            startJobStream(job.id);
          }
        }
        setJobsById(jobsMap);
      } catch (err) {
        toast.error("Failed to load chat history");
      }
    };
    void loadHistory();
  }, [projectId, activeChatId]);

  const hasTriggeredDefaultChat = useRef(false);

  // Scroll to bottom without scrolling parent page
  useEffect(() => {
    if (messageFeedRef.current) {
      messageFeedRef.current.scrollTop = messageFeedRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  // Reset parent scroll positions on mount to prevent browser viewport alignment scrolls
  useEffect(() => {
    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
    const relativeParent = document.querySelector(".relative.h-full.overflow-y-auto");
    if (relativeParent) {
      relativeParent.scrollTop = 0;
    }
  }, []);

  // Auto-select first thread or create a default one on load
  useEffect(() => {
    if (!isChatsLoading) {
      if (chats.length > 0) {
        if (!activeChatId) {
          setActiveChatId(chats[0].id);
        }
      } else if (!activeChatId && !hasTriggeredDefaultChat.current) {
        hasTriggeredDefaultChat.current = true;
        createChatMutation.mutate("General Thread");
      }
    }
  }, [isChatsLoading, chats, activeChatId]);

  // Mutations
  const createChatMutation = useMutation({
    mutationFn: (title: string) => createProjectChat(projectId, title),
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ["project-chats", projectId] });
      setActiveChatId(newChat.id);
      toast.success("New chat thread started!");
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: (chatId: string) => deleteProjectChat(projectId, chatId),
    onSuccess: (_, deletedChatId) => {
      queryClient.invalidateQueries({ queryKey: ["project-chats", projectId] });
      if (activeChatId === deletedChatId) {
        setActiveChatId(null);
      }
      toast.success("Thread deleted");
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: (source: string) =>
      api.delete(`/projects/${projectId}/sources?source=${encodeURIComponent(source)}`),
    onSuccess: () => {
      refetchSources();
      toast.success("Source removed from workspace");
    },
    onError: () => {
      toast.error("Failed to remove source");
    },
  });

  // Handlers
  const handleCreateChat = () => {
    const title = prompt("Enter thread name:", `Chat Thread #${chats.length + 1}`);
    if (title === null) return;
    createChatMutation.mutate(title || `Chat Thread #${chats.length + 1}`);
  };

  const sendMessage = async (userPrompt: string) => {
    if (!userPrompt || !activeChatId || isSending) return;

    const chatId = activeChatId;
    setIsSending(true);

    // Append user message immediately
    const tempUserId = genTempId();
    const tempAssistantId = genTempId();
    setMessages((prev) => [
      ...prev,
      { id: tempUserId, chat_id: chatId, role: "user", content: userPrompt, created_at: new Date().toISOString() },
      { id: tempAssistantId, chat_id: chatId, role: "assistant", content: "", created_at: new Date().toISOString() },
    ]);

    try {
      const activeToken = token || (session as any)?.accessToken;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";
      const response = await fetch(`${baseUrl}/projects/${projectId}/chats/${chatId}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ message: userPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to assistant stream");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantReplyText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              const data = trimmed.substring(6);
              assistantReplyText += data;

              // Update assistant bubble content
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === tempAssistantId
                    ? { ...msg, content: assistantReplyText }
                    : msg
                )
              );
            }
          }
        }
      }

      // Re-fetch clean history once complete to replace temp ids
      const cleanHistory = await fetchProjectChatHistory(projectId, chatId);
      setMessages(cleanHistory || []);
      queryClient.invalidateQueries({ queryKey: ["usage"] });

    } catch (err: any) {
      toast.error(err.message || "Failed to get reply");
      // Keep the user's text on screen instead of losing it — drop the
      // empty assistant placeholder and mark the request as failed with
      // a one-click retry, rather than removing it outright.
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== tempAssistantId)
          .map((m) =>
            m.id === tempUserId
              ? {
                  ...m,
                  _failed: true,
                  _retry: () => {
                    setMessages((p) => p.filter((x) => x.id !== tempUserId));
                    void sendMessage(userPrompt);
                  },
                }
              : m
          )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const userPrompt = inputMessage.trim();
    if (!userPrompt) return;
    setInputMessage("");
    void sendMessage(userPrompt);
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rightsConfirmed) {
      toast.error("You must confirm rights to ingest this content");
      return;
    }

    setUploadingState(true);

    try {
      if (uploadType === 'url') {
        if (!url.trim()) return;
        await api.post(`/projects/${projectId}/ingest/url`, {
          source: url.trim(),
          content_rights_confirmed: true,
        });
        toast.success("Link indexing triggered!");
      } else {
        if (!pdfFile) return;
        const formData = new FormData();
        formData.append("file", pdfFile);
        formData.append("content_rights_confirmed", "true");
        await api.post(`/projects/${projectId}/ingest/pdf`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("PDF upload succeeded!");
      }

      refetchSources();
      setIsUploading(false);
      setUrl("");
      setPdfFile(null);
      setRightsConfirmed(false);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Ingestion failed");
    } finally {
      setUploadingState(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col xl:flex-row gap-6 overflow-hidden bg-transparent">
        {/* Left Workspace Panel */}
        <div className="w-full xl:w-[320px] flex flex-col shrink-0 gap-6 overflow-y-auto custom-scrollbar">
          {/* Project Details */}
          <div className="bg-card border border-border p-5 rounded-lg space-y-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/projects")}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary p-0 h-auto font-bold flex items-center text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Projects
            </Button>
            <div>
              <h2 className="text-foreground text-xl font-black font-outfit truncate">{project?.name || "Loading..."}</h2>
              <p className="text-muted-foreground/60 text-xs mt-1 leading-relaxed line-clamp-2">
                {project?.description || "Collaborative AI research workspace folder."}
              </p>
            </div>
          </div>

          {/* Chat Threads */}
          <div className="bg-card border border-border p-5 rounded-lg flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground font-outfit">Chats ({chats.length})</span>
              <Button
                variant="ghost"
                onClick={handleCreateChat}
                className="text-primary hover:text-foreground p-1 hover:bg-secondary rounded-lg h-7 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                New Chat
              </Button>
            </div>
            <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
              {chats.length > 0 ? (
                chats.map((c) => {
                  const isActive = activeChatId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveChatId(c.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                        isActive
                          ? "bg-primary/10 border-primary/20 text-foreground font-bold"
                          : "bg-secondary/10 border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <MessageSquare className="w-4 h-4 shrink-0 text-primary" />
                        <span className="text-xs truncate">{c.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this thread?")) {
                            deleteChatMutation.mutate(c.id);
                          }
                        }}
                        className="text-muted-foreground/50 hover:text-red-400 p-1 rounded w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-muted-foreground/50 text-xs font-medium">No active chats yet</div>
              )}
            </div>
          </div>

          {/* Agent Knowledge Base (Learnings) */}
          <div className="bg-card border border-border p-5 rounded-lg flex flex-col min-h-55 max-h-75">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground font-outfit">Learnings ({sources.length})</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsUploading(true)}
                className="text-primary hover:text-foreground p-1 hover:bg-secondary rounded-lg h-7 text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Teach Agent
              </Button>
            </div>
            <div className="space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
              {sources.length > 0 ? (
                sources.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/80 transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {s.type === 'pdf' ? (
                        <File className="w-3.5 h-3.5 text-primary shrink-0" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                      <span className="text-[11px] text-muted-foreground truncate font-medium" title={s.source}>{s.source}</span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Remove this learning: "${s.source}"?`)) {
                          deleteSourceMutation.mutate(s.source);
                        }
                      }}
                      className="text-muted-foreground/40 hover:text-red-400 p-1 rounded hover:bg-red-400/10 w-6 h-6 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground/50 text-xs">No learnings yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Main Work / Chat Panel */}
        <div className="flex-1 bg-card border border-border rounded-lg flex flex-col overflow-hidden min-h- xl:min-h-0 relative">
          {activeChatId ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">
                    {chats.find((c) => c.id === activeChatId)?.title || "Active Chat"}
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div ref={messageFeedRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
                {messages.map((m) => {
                  const isAssistant = m.role === "assistant";
                  const job = m.generation_job_id ? jobsById[m.generation_job_id] : undefined;
                  const isFailed = !!m._failed;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      {job ? (
                        <ArtifactCard
                          job={job}
                          onRegenerate={() => handleRegenerate(job)}
                          isRegenerating={regeneratingJobId === job.id}
                          onEdit={(instruction) => handleEdit(job, instruction)}
                          isEditing={editingJobId === job.id}
                        />
                      ) : isFailed ? (
                        <button
                          onClick={() => m._retry?.()}
                          title="Failed to send — click to retry"
                          className="max-w-[80%] p-4 rounded-lg text-sm leading-relaxed border text-left bg-destructive/10 border-destructive/30 text-destructive font-medium rounded-tr-sm hover:bg-destructive/15 transition-colors flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4 shrink-0" />
                          <span>{m.content}</span>
                        </button>
                      ) : (
                        <div
                          className={`max-w-[80%] p-4 rounded-lg text-sm leading-relaxed border ${
                            isAssistant
                              ? "bg-secondary border-border text-foreground rounded-tl-sm prose prose-sm"
                              : "bg-primary text-primary-foreground border-primary/20 rounded-tr-sm font-medium"
                          }`}
                        >
                          {isAssistant ? (
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          ) : (
                            m.content
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {messages.length === 0 && !isSending && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground/50 py-20">
                    <Sparkles className="w-10 h-10 mb-3 opacity-30 animate-pulse text-primary" />
                    <p className="text-sm">Thread is empty. Send a prompt to query project sources.</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Tool Prompt Configuration Panel */}
              {promptForTool && (
                <div className="px-6 py-4 border-t border-border bg-secondary/40 space-y-3 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest text-foreground font-outfit">
                        {promptForTool.type === 'create_presentation' && "Configure Slides Deck"}
                        {promptForTool.type === 'write_report' && "Configure Report Document"}
                        {promptForTool.type === 'analyze_data' && "Configure Data Spreadsheet"}
                        {promptForTool.type === 'generate_image' && "Configure Image"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPromptForTool(null);
                        setCustomToolPrompt("");
                      }}
                      className="text-muted-foreground/60 hover:text-foreground p-1 rounded-lg w-6 h-6 flex items-center justify-center hover:bg-secondary"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    What specific topic, sections, or data details should this file focus on? The instructions will be shared in the chat and used by the builder.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      autoFocus
                      placeholder={
                        promptForTool.type === 'create_presentation'
                          ? "e.g. 5 slides outlining project goals, backend architecture, and UI mockup ideas"
                          : promptForTool.type === 'write_report'
                          ? "e.g. A comprehensive summary of our security audits and mitigation steps"
                          : promptForTool.type === 'analyze_data'
                          ? "e.g. Extract a spreadsheet of financial projections, costs, and revenues per quarter"
                          : "e.g. A clean architecture diagram illustrating our workspace's chat pipeline"
                      }
                      value={customToolPrompt}
                      onChange={(e) => setCustomToolPrompt(e.target.value)}
                      className="flex-1 bg-secondary border-border text-foreground rounded-xl text-xs h-10 placeholder:text-muted-foreground/50 focus:border-primary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customToolPrompt.trim() && !isSending) {
                          e.preventDefault();
                          void handleGenerateWithPrompt();
                        }
                      }}
                    />
                    <Button
                      onClick={handleGenerateWithPrompt}
                      disabled={!customToolPrompt.trim() || isSending}
                      className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold rounded-xl h-10 px-5 text-xs shadow-lg shadow-primary/20"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              )}

              {/* Tools Quick Action Bar */}
              <div className="flex gap-2 px-4 py-2.5 border-t border-border bg-muted/30 overflow-x-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExecuteTool('create_presentation')}
                  className="text-muted-foreground hover:text-foreground border border-border hover:bg-secondary rounded-xl text-xs font-bold py-1 px-3 flex items-center gap-1.5 h-9 shrink-0"
                >
                  <Presentation className="w-4 h-4 text-primary" />
                  Create Slides
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExecuteTool('write_report')}
                  className="text-muted-foreground hover:text-foreground border border-border hover:bg-secondary rounded-xl text-xs font-bold py-1 px-3 flex items-center gap-1.5 h-9 shrink-0"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  Write Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExecuteTool('analyze_data')}
                  className="text-muted-foreground hover:text-foreground border border-border hover:bg-secondary rounded-xl text-xs font-bold py-1 px-3 flex items-center gap-1.5 h-9 shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4 text-primary" />
                  Analyze Data
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExecuteTool('generate_image')}
                  className="text-muted-foreground hover:text-foreground border border-border hover:bg-secondary rounded-xl text-xs font-bold py-1 px-3 flex items-center gap-1.5 h-9 shrink-0"
                >
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Generate Image
                </Button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-border bg-secondary/20 flex gap-3">
                <Input
                  required
                  placeholder="Ask a question about the project files..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isSending}
                  className="flex-1 bg-secondary border-border text-foreground rounded-xl focus:border-border/80 placeholder:text-muted-foreground/50 h-12"
                />
                <Button
                  type="submit"
                  disabled={isSending || !inputMessage.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-12 h-12 flex items-center justify-center shrink-0 font-bold"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Project Workspace Empty State / Suggestions Panel */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-8 overflow-y-auto">
              <div className="max-w-md space-y-3">
                <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4 ">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-foreground text-2xl font-black font-outfit">Project Workspace</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Start a new chat thread to search uploaded files, or execute custom analytical tools below to generate presentation decks and documents.
                </p>
              </div>

              {/* Action Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-4xl">
                <SuggestionCard
                  icon={<Presentation className="w-5 h-5 text-primary" />}
                  title="Create presentation"
                  description="Generate downloadable PPTX slides based on your PDF contents."
                  onClick={() => handleExecuteTool('create_presentation')}
                />
                <SuggestionCard
                  icon={<FileText className="w-5 h-5 text-primary" />}
                  title="Write report"
                  description="Draft structured Word reports containing key metrics from project files."
                  onClick={() => handleExecuteTool('write_report')}
                />
                <SuggestionCard
                  icon={<FileSpreadsheet className="w-5 h-5 text-primary" />}
                  title="Analyze data"
                  description="Inspect financial or audit spreadsheets to extract insights."
                  onClick={() => handleExecuteTool('analyze_data')}
                />
                <SuggestionCard
                  icon={<ImageIcon className="w-5 h-5 text-primary" />}
                  title="Generate image"
                  description="Create illustrations, diagrams, or visuals from a text prompt."
                  onClick={() => handleExecuteTool('generate_image')}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsUploading(true)}
                  variant="outline"
                  className="border-border text-foreground hover:bg-secondary font-bold h-12 px-6 rounded-md text-sm"
                >
                  <Brain className="w-4 h-4 mr-2 text-primary" />
                  Agent Learnings ({sources.length})
                </Button>
                <Button
                  onClick={handleCreateChat}
                  className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold h-12 px-8 rounded-md text-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Start Chatting
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ingest Source Modal / Knowledge Base */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border p-6 rounded-lg w-full max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-outfit text-foreground">Agent Knowledge Base</h3>
                <p className="text-muted-foreground text-xs mt-1">
                  Manage documents and web links the agent learns from.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsUploading(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg w-8 h-8 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Left/Right Grid: Manage & List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Add New Source */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 font-outfit">Add Learnings</span>
                <div className="flex gap-2 p-1 bg-secondary rounded-xl border border-border">
                  <Button
                    type="button"
                    variant={uploadType === 'pdf' ? 'default' : 'ghost'}
                    onClick={() => setUploadType('pdf')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all h-8 ${
                      uploadType === 'pdf' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    PDF Document
                  </Button>
                  <Button
                    type="button"
                    variant={uploadType === 'url' ? 'default' : 'ghost'}
                    onClick={() => setUploadType('url')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all h-8 ${
                      uploadType === 'url' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Website URL
                  </Button>
                </div>

                <form onSubmit={handleIngestSubmit} className="space-y-3">
                  {uploadType === 'pdf' ? (
                    <div className="space-y-2">
                      <div className="border border-dashed border-border hover:border-border/80 transition-all rounded-xl p-4 flex flex-col items-center justify-center bg-transparent relative min-h-27.5">
                        <FileText className="w-8 h-8 text-muted-foreground/50 mb-1" />
                        {pdfFile ? (
                          <span className="text-[10px] text-foreground truncate max-w-full font-medium">{pdfFile.name}</span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60">Drag PDF here or browse</span>
                        )}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full hidden"
                          id="pdf-upload-input"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("pdf-upload-input")?.click()}
                          className="mt-2 border-border text-foreground rounded-lg h-7 text-[10px]"
                        >
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Input
                        required
                        type="url"
                        placeholder="https://example.com/docs"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-secondary border-border text-foreground rounded-xl h-9 text-xs"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-1.5 pt-1">
                    <input
                      type="checkbox"
                      checked={rightsConfirmed}
                      onChange={(e) => setRightsConfirmed(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border bg-secondary mt-0.5"
                      id="rights"
                    />
                    <label htmlFor="rights" className="text-[9px] leading-tight text-muted-foreground select-none">
                      I confirm content rights.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={uploadingState}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-9 text-xs"
                  >
                    {uploadingState ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    ) : null}
                    Add Source
                  </Button>
                </form>
              </div>

              {/* Right Column: Current sources */}
              <div className="space-y-4 flex flex-col min-h-50 max-h-70">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 font-outfit">Current Sources ({sources.length})</span>
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                  {sources.length > 0 ? (
                    sources.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 transition-all group"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {s.type === 'pdf' ? (
                            <File className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                          <span className="text-[11px] text-foreground/80 truncate font-medium">{s.source}</span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => deleteSourceMutation.mutate(s.source)}
                          className="text-muted-foreground/50 hover:text-red-400 p-1 rounded hover:bg-red-400/10 w-6 h-6 shrink-0 flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground/50 text-[10px] py-10">
                      <FileText className="w-6 h-6 mb-1 opacity-30" />
                      Agent has not learned from any files yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SuggestionCard({
  icon,
  title,
  description,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className="bg-card border border-border cursor-pointer rounded-lg hover:bg-secondary transition-all text-left group"
    >
      <CardContent className="p-5 space-y-3">
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="text-foreground font-bold text-outfit uppercase tracking-wider">{title}</h4>
          <p className="text-muted-foreground/60 text-xs mt-1.5 leading-normal">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
