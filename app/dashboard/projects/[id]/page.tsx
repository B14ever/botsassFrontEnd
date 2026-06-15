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
  Settings,
  Brain
} from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import ReactMarkdown from "react-markdown";
import {
  fetchProject,
  fetchProjectChats,
  createProjectChat,
  fetchProjectChatHistory,
  deleteProjectChat,
  Project,
  ProjectChat,
  ProjectMessage
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

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
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

  type JobState = {
    id: string;
    tool_type: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    output_file_url?: string;
    error?: string;
    chat_id?: string;
    created_at: string;
  };

  const [runningJobs, setRunningJobs] = useState<Record<string, JobState>>({});

  const pollJob = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/projects/${projectId}/tools/jobs/${jobId}`);
        const job = response.data;
        
        setRunningJobs((prev) => ({
          ...prev,
          [jobId]: job
        }));

        if (job.status === "completed" || job.status === "failed") {
          clearInterval(interval);
          if (job.status === "completed") {
            toast.success(`Analysis tool completed successfully!`);
            queryClient.invalidateQueries({ queryKey: ["usage"] });
          } else {
            toast.error(`Tool execution failed: ${job.error}`);
          }
        }
      } catch (err) {
        clearInterval(interval);
        console.error("Error polling job status", err);
      }
    }, 2000);
  };

  const [promptForTool, setPromptForTool] = useState<{ type: 'create_presentation' | 'write_report' | 'analyze_data' } | null>(null);
  const [customToolPrompt, setCustomToolPrompt] = useState("");

  const handleExecuteTool = (toolType: 'create_presentation' | 'write_report' | 'analyze_data') => {
    if (!activeChatId) {
      toast.error("Please select or start a chat thread first.");
      return;
    }
    setPromptForTool({ type: toolType });
  };

  const handleGenerateWithPrompt = async () => {
    if (!promptForTool || !customToolPrompt.trim() || !activeChatId || isSending) return;

    const toolType = promptForTool.type;
    const userPrompt = customToolPrompt.trim();

    // Reset prompt state immediately to hide UI
    setPromptForTool(null);
    setCustomToolPrompt("");

    let actionLabel = "";
    if (toolType === "create_presentation") {
      actionLabel = "presentation slides deck";
    } else if (toolType === "write_report") {
      actionLabel = "detailed report document";
    } else {
      actionLabel = "data analysis spreadsheet";
    }

    const fullMessage = `I want to generate a ${actionLabel}. Please focus on: ${userPrompt}`;

    setInputMessage("");
    setIsSending(true);

    const tempUserMsg: ProjectMessage = {
      id: "temp-user",
      chat_id: activeChatId,
      role: "user",
      content: fullMessage,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    const tempAssistantMsg: ProjectMessage = {
      id: "temp-assistant",
      chat_id: activeChatId,
      role: "assistant",
      content: "",
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempAssistantMsg]);

    try {
      const activeToken = token || (session as any)?.accessToken;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

      // 1. Trigger the background tool execution concurrently
      void (async () => {
        try {
          const response = await api.post(`/projects/${projectId}/tools/execute`, {
            chat_id: activeChatId,
            tool_type: toolType,
            input_file_ids: []
          });
          const job = response.data;
          setRunningJobs((prev) => ({
            ...prev,
            [job.id]: {
              id: job.id,
              tool_type: job.tool_type,
              status: job.status,
              chat_id: activeChatId,
              created_at: new Date().toISOString()
            }
          }));
          pollJob(job.id);
          toast.success("AI analysis job queued!");
        } catch (err: any) {
          toast.error(err.response?.data?.error || err.message || "Failed to trigger tool");
        }
      })();

      // 2. Stream the agent's explanation / discussion into the chat
      const response = await fetch(`${baseUrl}/projects/${projectId}/chats/${activeChatId}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ message: fullMessage }),
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

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === "temp-assistant"
                    ? { ...msg, content: assistantReplyText }
                    : msg
                )
              );
            }
          }
        }
      }

      const cleanHistory = await fetchProjectChatHistory(projectId, activeChatId);
      setMessages(cleanHistory || []);
      queryClient.invalidateQueries({ queryKey: ["usage"] });

    } catch (err: any) {
      toast.error(err.message || "Failed to get reply");
      setMessages((prev) => prev.filter((m) => m.id !== "temp-user" && m.id !== "temp-assistant"));
    } finally {
      setIsSending(false);
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

  // Load chat history when active chat changes
  useEffect(() => {
    if (!activeChatId) {
      setMessages([]);
      return;
    }
    const loadHistory = async () => {
      try {
        const history = await fetchProjectChatHistory(projectId, activeChatId);
        setMessages(history || []);
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatId || isSending) return;

    const userPrompt = inputMessage.trim();
    setInputMessage("");
    setIsSending(true);

    // Append user message immediately
    const tempUserMsg: ProjectMessage = {
      id: "temp-user",
      chat_id: activeChatId,
      role: "user",
      content: userPrompt,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    // Append an empty assistant message to stream into
    const tempAssistantMsg: ProjectMessage = {
      id: "temp-assistant",
      chat_id: activeChatId,
      role: "assistant",
      content: "",
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempAssistantMsg]);

    try {
      const activeToken = token || (session as any)?.accessToken;
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";
      const response = await fetch(`${baseUrl}/projects/${projectId}/chats/${activeChatId}/ask`, {
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
                  msg.id === "temp-assistant"
                    ? { ...msg, content: assistantReplyText }
                    : msg
                )
              );
            }
          }
        }
      }

      // Re-fetch clean history once complete to replace temp ids
      const cleanHistory = await fetchProjectChatHistory(projectId, activeChatId);
      setMessages(cleanHistory || []);
      queryClient.invalidateQueries({ queryKey: ["usage"] });

    } catch (err: any) {
      toast.error(err.message || "Failed to get reply");
      // Remove temp messages on error to keep history clean
      setMessages((prev) => prev.filter((m) => m.id !== "temp-user" && m.id !== "temp-assistant"));
    } finally {
      setIsSending(false);
    }
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
    <Sidebar>
      <div className="w-full h-full flex flex-col xl:flex-row gap-6 overflow-hidden bg-transparent">
        {/* Left Workspace Panel */}
        <div className="w-full xl:w-[320px] flex flex-col shrink-0 gap-6 overflow-y-auto custom-scrollbar">
          {/* Project Details */}
          <div className="glass-dark border border-white/10 p-5 rounded-[2rem] space-y-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/projects")}
              className="text-white/40 hover:text-white hover:bg-white/5 p-0 h-auto font-bold flex items-center text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Projects
            </Button>
            <div>
              <h2 className="text-white text-xl font-black font-outfit truncate">{project?.name || "Loading..."}</h2>
              <p className="text-white/30 text-xs mt-1 leading-relaxed line-clamp-2">
                {project?.description || "Collaborative AI research workspace folder."}
              </p>
            </div>
          </div>

          {/* Chat Threads */}
          <div className="glass-dark border border-white/10 p-5 rounded-[2rem] flex-1 flex flex-col min-h-[200px]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-white/50 font-outfit">Chats ({chats.length})</span>
              <Button
                variant="ghost"
                onClick={handleCreateChat}
                className="text-primary hover:text-white p-1 hover:bg-white/5 rounded-lg h-7 text-xs font-bold"
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
                          ? "bg-primary/10 border-primary/20 text-white font-bold"
                          : "bg-white/[0.01] border-white/5 text-white/50 hover:text-white hover:bg-white/[0.03]"
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
                        className="text-white/20 hover:text-red-400 p-1 rounded w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-white/20 text-xs font-medium">No active chats yet</div>
              )}
            </div>
          </div>

          {/* Agent Knowledge Base (Learnings) */}
          <div className="glass-dark border border-white/10 p-5 rounded-[2rem] flex flex-col min-h-[220px] max-h-[300px]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50 font-outfit">Learnings ({sources.length})</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsUploading(true)}
                className="text-primary hover:text-white p-1 hover:bg-white/5 rounded-lg h-7 text-xs font-bold"
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
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {s.type === 'pdf' ? (
                        <File className="w-3.5 h-3.5 text-primary shrink-0" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                      <span className="text-[11px] text-white/60 truncate font-medium" title={s.source}>{s.source}</span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Remove this learning: "${s.source}"?`)) {
                          deleteSourceMutation.mutate(s.source);
                        }
                      }}
                      className="text-white/25 hover:text-red-400 p-1 rounded hover:bg-red-400/10 w-6 h-6 shrink-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/20 text-xs">No learnings yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Main Work / Chat Panel */}
        <div className="flex-1 glass-dark border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden min-h-[450px] xl:min-h-0 relative">
          {activeChatId ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-black/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-white">
                    {chats.find((c) => c.id === activeChatId)?.title || "Active Chat"}
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div ref={messageFeedRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
                {messages.map((m) => {
                  const isAssistant = m.role === "assistant";
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm leading-relaxed border ${
                          isAssistant
                            ? "bg-white/5 border-white/10 text-white rounded-tl-sm prose prose-invert prose-sm"
                            : "bg-primary text-black border-primary/20 rounded-tr-sm font-medium"
                        }`}
                      >
                        {isAssistant ? (
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        ) : (
                          m.content
                        )}
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && !isSending && Object.keys(runningJobs).length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-white/20 py-20">
                    <Sparkles className="w-10 h-10 mb-3 opacity-30 animate-pulse text-primary" />
                    <p className="text-sm">Thread is empty. Send a prompt to query project sources.</p>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Active & Completed Document Generations */}
              {Object.keys(runningJobs).length > 0 && (
                <div className="px-6 py-3 border-t border-white/5 bg-black/30 flex flex-col gap-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 font-outfit">Document Generations</span>
                    <Button
                      variant="ghost"
                      onClick={() => setRunningJobs({})}
                      className="text-white/30 hover:text-white p-0 h-auto text-[9px] font-bold"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {Object.values(runningJobs).map((job) => {
                      const isPending = job.status === "pending" || job.status === "processing";
                      const isCompleted = job.status === "completed";
                      const isFailed = job.status === "failed";
                      return (
                        <div key={job.id} className="glass-dark border border-white/5 p-2.5 rounded-xl flex items-center justify-between gap-3 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              {job.tool_type === "create_presentation" && <Presentation className="w-3.5 h-3.5 text-primary" />}
                              {job.tool_type === "write_report" && <FileText className="w-3.5 h-3.5 text-primary" />}
                              {job.tool_type === "analyze_data" && <FileSpreadsheet className="w-3.5 h-3.5 text-primary" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-[11px] font-bold truncate">
                                {job.tool_type === "create_presentation" && "Slides Deck"}
                                {job.tool_type === "write_report" && "Report PDF"}
                                {job.tool_type === "analyze_data" && "Spreadsheet XLSX"}
                              </p>
                              <p className="text-white/40 text-[9px] mt-0.5 capitalize flex items-center gap-1">
                                {isPending ? (
                                  <>
                                    <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />
                                    Compiling...
                                  </>
                                ) : (
                                  job.status
                                )}
                              </p>
                            </div>
                          </div>
                          {isCompleted && (
                            <a
                              href={job.output_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-primary hover:bg-primary/90 text-black font-bold text-[10px] py-1.5 px-3 rounded-lg shrink-0 transition-all shadow-lg shadow-primary/10"
                            >
                              Download
                            </a>
                          )}
                          {isFailed && (
                            <span className="text-red-400 text-[10px] font-bold cursor-help" title={job.error}>Failed</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tool Prompt Configuration Panel */}
              {promptForTool && (
                <div className="px-6 py-4 border-t border-white/5 bg-black/40 space-y-3 animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest text-white font-outfit">
                        {promptForTool.type === 'create_presentation' && "Configure Slides Deck"}
                        {promptForTool.type === 'write_report' && "Configure Report Document"}
                        {promptForTool.type === 'analyze_data' && "Configure Data Spreadsheet"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setPromptForTool(null);
                        setCustomToolPrompt("");
                      }}
                      className="text-white/30 hover:text-white p-1 rounded-lg w-6 h-6 flex items-center justify-center hover:bg-white/5"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-white/40 text-[11px] leading-relaxed">
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
                          : "e.g. Extract a spreadsheet of financial projections, costs, and revenues per quarter"
                      }
                      value={customToolPrompt}
                      onChange={(e) => setCustomToolPrompt(e.target.value)}
                      className="flex-1 bg-white/5 border-white/10 text-white rounded-xl text-xs h-10 placeholder:text-white/20 focus:border-white/25"
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
                      className="bg-primary text-black hover:bg-primary/95 font-bold rounded-xl h-10 px-5 text-xs shadow-lg shadow-primary/20"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              )}

              {/* Tools Quick Action Bar */}
              <div className="flex gap-2 px-4 py-2.5 border-t border-white/5 bg-black/10 overflow-x-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExecuteTool('create_presentation')}
                  className="text-white/60 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold py-1 px-3 flex items-center gap-1.5 h-9 shrink-0"
                >
                  <Presentation className="w-4 h-4 text-primary" />
                  Create Slides
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExecuteTool('write_report')}
                  className="text-white/60 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold py-1 px-3 flex items-center gap-1.5 h-9 shrink-0"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  Write Report
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleExecuteTool('analyze_data')}
                  className="text-white/60 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl text-xs font-bold py-1 px-3 flex items-center gap-1.5 h-9 shrink-0"
                >
                  <FileSpreadsheet className="w-4 h-4 text-primary" />
                  Analyze Data
                </Button>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/20 flex gap-3">
                <Input
                  required
                  placeholder="Ask a question about the project files..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isSending}
                  className="flex-1 bg-white/5 border-white/10 text-white rounded-xl focus:border-white/20 placeholder:text-white/20 h-12"
                />
                <Button
                  type="submit"
                  disabled={isSending || !inputMessage.trim()}
                  className="bg-white text-black hover:bg-primary hover:text-black rounded-xl w-12 h-12 flex items-center justify-center shrink-0 font-bold"
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
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4 animate-float">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-white text-2xl font-black font-outfit">Project Workspace</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  Start a new chat thread to search uploaded files, or execute custom analytical tools below to generate presentation decks and documents.
                </p>
              </div>

              {/* Action Suggestion Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                <SuggestionCard
                  icon={<Presentation className="w-5 h-5 text-primary" />}
                  title="Create presentation"
                  description="Generate downloadable PPTX slides based on your PDF contents."
                  onClick={() => handleExecuteTool('create_presentation')}
                />
                <SuggestionCard
                  icon={<FileText className="w-5 h-5 text-primary" />}
                  title="Write report"
                  description="Draft structured PDF reports containing key metrics from project files."
                  onClick={() => handleExecuteTool('write_report')}
                />
                <SuggestionCard
                  icon={<FileSpreadsheet className="w-5 h-5 text-primary" />}
                  title="Analyze data"
                  description="Inspect financial or audit spreadsheets to extract insights."
                  onClick={() => handleExecuteTool('analyze_data')}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setIsUploading(true)}
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 font-bold h-12 px-6 rounded-2xl text-sm"
                >
                  <Brain className="w-4 h-4 mr-2 text-primary" />
                  Agent Learnings ({sources.length})
                </Button>
                <Button
                  onClick={handleCreateChat}
                  className="bg-primary text-black hover:bg-primary/95 font-bold h-12 px-8 rounded-2xl text-sm"
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
          <div className="glass-dark border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-outfit text-white">Agent Knowledge Base</h3>
                <p className="text-white/40 text-xs mt-1">
                  Manage documents and web links the agent learns from.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsUploading(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg w-8 h-8 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Left/Right Grid: Manage & List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Add New Source */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 font-outfit">Add Learnings</span>
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setUploadType('pdf')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      uploadType === 'pdf' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    PDF Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                      uploadType === 'url' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Website URL
                  </button>
                </div>

                <form onSubmit={handleIngestSubmit} className="space-y-3">
                  {uploadType === 'pdf' ? (
                    <div className="space-y-2">
                      <div className="border border-dashed border-white/10 hover:border-white/20 transition-all rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] relative min-h-[110px]">
                        <FileText className="w-8 h-8 text-white/20 mb-1" />
                        {pdfFile ? (
                          <span className="text-[10px] text-white truncate max-w-full font-medium">{pdfFile.name}</span>
                        ) : (
                          <span className="text-[10px] text-white/30">Drag PDF here or browse</span>
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
                          className="mt-2 border-white/10 text-white rounded-lg h-7 text-[10px]"
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
                        className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-1.5 pt-1">
                    <input
                      type="checkbox"
                      checked={rightsConfirmed}
                      onChange={(e) => setRightsConfirmed(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 mt-0.5"
                      id="rights"
                    />
                    <label htmlFor="rights" className="text-[9px] leading-tight text-white/40 select-none">
                      I confirm content rights.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={uploadingState}
                    className="w-full bg-primary text-black hover:bg-primary/90 font-bold rounded-xl h-9 text-xs"
                  >
                    {uploadingState ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    ) : null}
                    Add Source
                  </Button>
                </form>
              </div>

              {/* Right Column: Current sources */}
              <div className="space-y-4 flex flex-col min-h-[200px] max-h-[280px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 font-outfit">Current Sources ({sources.length})</span>
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                  {sources.length > 0 ? (
                    sources.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {s.type === 'pdf' ? (
                            <File className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                          <span className="text-[11px] text-white/70 truncate font-medium">{s.source}</span>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => deleteSourceMutation.mutate(s.source)}
                          className="text-white/20 hover:text-red-400 p-1 rounded hover:bg-red-400/10 w-6 h-6 shrink-0 flex items-center justify-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-white/20 text-[10px] py-10">
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
    </Sidebar>
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
      className="glass-dark border-white/5 hover:border-white/10 cursor-pointer rounded-2xl hover:bg-white/[0.02] transition-all text-left group"
    >
      <CardContent className="p-5 space-y-3">
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-bold text-xs font-outfit uppercase tracking-wider">{title}</h4>
          <p className="text-white/30 text-xs mt-1.5 leading-normal">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
