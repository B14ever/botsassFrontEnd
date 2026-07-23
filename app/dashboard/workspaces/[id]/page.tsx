"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  UserPlus, Users, Send, Bot, Check, Copy, Sparkles, MessageSquare,
  FileText, Upload, BookOpen, Plus, Globe, FileUp, Settings, History
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
  getWorkspace, listMembers, inviteMember, listInvitations,
  type WorkspaceMember, type WorkspaceInvitation
} from "@/lib/api/workspace";
import {
  fetchProjectSources, ingestProjectUrl, ingestProjectPdf,
  fetchProjectChats, createProjectChat, fetchProjectChatHistory,
  type KnowledgeSource, type ProjectChat, type ProjectMessage
} from "@/lib/api/projects";
import { useWorkspacePermissions } from "@/hooks/useWorkspacePermissions";
import { getAxiosErrorMessage, type LimitReachedError, isLimitReachedError } from "@/lib/api/errors";
import { PLATFORM_NAME } from "@/constants";

const ROLES = [
  { id: "bot_manager", name: "Bot Manager", desc: "Manage AI agents, deployment & channels" },
  { id: "knowledge_manager", name: "Knowledge Manager", desc: "Manage training sources & documents" },
  { id: "support_agent", name: "Support Agent", desc: "Live customer chat takeovers & support" },
  { id: "viewer", name: "Viewer", desc: "Read-only access to view workspace & chat" },
];

function groupChatsByDate(chats: ProjectChat[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const sevenDaysAgoStart = todayStart - 6 * 86400000;

  const categories: { [key: string]: ProjectChat[] } = {
    Today: [],
    Yesterday: [],
    "7 days ago": [],
    Older: [],
  };

  chats.forEach((chat) => {
    const time = chat.created_at ? new Date(chat.created_at).getTime() : Date.now();
    if (time >= todayStart) {
      categories["Today"].push(chat);
    } else if (time >= yesterdayStart) {
      categories["Yesterday"].push(chat);
    } else if (time >= sevenDaysAgoStart) {
      categories["7 days ago"].push(chat);
    } else {
      categories["Older"].push(chat);
    }
  });

  return [
    { label: "Today", chats: categories["Today"] },
    { label: "Yesterday", chats: categories["Yesterday"] },
    { label: "7 days ago", chats: categories["7 days ago"] },
    { label: "Older", chats: categories["Older"] },
  ].filter((group) => group.chats.length > 0);
}

export default function SingleWorkspaceDashboardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);
  
  const workspaceId = params.id;

  useEffect(() => {
    if (workspaceId) {
      setActiveWorkspaceId(workspaceId);
    }
  }, [workspaceId, setActiveWorkspaceId]);

  const { isOwner } = useWorkspacePermissions();

  // Dialog States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);

  // Invite Member State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [createdInviteToken, setCreatedInviteToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Knowledge Ingestion State
  const [sourceType, setSourceType] = useState<"url" | "text" | "pdf">("url");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);

  // Active Private Chat Thread State
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Chat Messages & Input
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [limitError, setLimitError] = useState<LimitReachedError | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch Workspace Details
  const { data: workspace } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspace(workspaceId!),
    enabled: !!workspaceId,
  });

  // Fetch Workspace Members
  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => listMembers(workspaceId!),
    enabled: !!workspaceId,
  });

  // Fetch Workspace Invitations (Owner only)
  const { data: invitations = [] } = useQuery<WorkspaceInvitation[]>({
    queryKey: ["workspace-invitations", workspaceId],
    queryFn: () => listInvitations(workspaceId!),
    enabled: !!workspaceId && isOwner,
  });

  // Fetch Knowledge Sources
  const { data: realSources = [], isLoading: isSourcesLoading } = useQuery<KnowledgeSource[]>({
    queryKey: ["workspace-sources", workspaceId],
    queryFn: async () => {
      try {
        const res = await fetchProjectSources(workspaceId!);
        return res || [];
      } catch {
        return [];
      }
    },
    enabled: !!workspaceId,
  });

  // Fetch Private Chat Threads
  const { data: chatThreads = [], isLoading: isThreadsLoading } = useQuery<ProjectChat[]>({
    queryKey: ["workspace-chats", workspaceId],
    queryFn: async () => {
      try {
        const res = await fetchProjectChats(workspaceId!);
        return res || [];
      } catch {
        return [];
      }
    },
    enabled: !!workspaceId,
  });

  const groupedChatHistory = useMemo(() => groupChatsByDate(chatThreads), [chatThreads]);

  useEffect(() => {
    if (chatThreads.length > 0 && !activeChatId) {
      setActiveChatId(chatThreads[0].id);
    }
  }, [chatThreads, activeChatId]);

  // Fetch Chat Messages for Active Chat Thread
  const { data: messages = [], refetch: refetchMessages } = useQuery<ProjectMessage[]>({
    queryKey: ["workspace-messages", workspaceId, activeChatId],
    queryFn: async () => {
      if (!activeChatId) return [];
      try {
        const res = await fetchProjectChatHistory(workspaceId!, activeChatId);
        return res || [];
      } catch {
        return [];
      }
    },
    enabled: !!workspaceId && !!activeChatId,
  });

  // Create Private Chat Thread Mutation
  const createChatMutation = useMutation({
    mutationFn: () => createProjectChat(workspaceId!, `Chat ${chatThreads.length + 1}`),
    onSuccess: (newChat) => {
      toast.success("New chat session created");
      queryClient.invalidateQueries({ queryKey: ["workspace-chats", workspaceId] });
      if (newChat?.id) {
        setActiveChatId(newChat.id);
      }
    },
    onError: (e: any) => {
      toast.error(getAxiosErrorMessage(e, "Failed to create chat thread"));
    },
  });

  // Invite Member Mutation
  const inviteMutation = useMutation({
    mutationFn: () => inviteMember(workspaceId!, inviteEmail.trim(), inviteRole),
    onSuccess: (inv) => {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setCreatedInviteToken(inv.token);
      setInviteError(null);
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", workspaceId] });
    },
    onError: (e: any) => {
      setInviteError(e?.response?.data?.error || e?.message || "Failed to send invitation");
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleInviteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteError(null);
    inviteMutation.mutate();
  }

  function copyInviteLink(token: string) {
    const link = `${window.location.origin}/org/invite/${token}`;
    void navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Invite link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIngesting(true);
    try {
      if (sourceType === "url" && sourceUrl.trim()) {
        await ingestProjectUrl(workspaceId!, sourceUrl.trim());
        toast.success("Web URL ingested into backend knowledge base!");
        setSourceUrl("");
      } else if (sourceType === "pdf" && sourceFile) {
        await ingestProjectPdf(workspaceId!, sourceFile);
        toast.success(`PDF "${sourceFile.name}" ingested into backend successfully!`);
        setSourceFile(null);
      } else if (sourceType === "text" && sourceText.trim()) {
        await ingestProjectUrl(workspaceId!, `text://${sourceText.trim().substring(0, 30)}`);
        toast.success("Text snippet added to workspace knowledge base!");
        setSourceText("");
      }
      setIsKnowledgeModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workspace-sources", workspaceId] });
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Failed to ingest knowledge source"));
    } finally {
      setIsIngesting(false);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMessage = textToSend.trim();
    setInput("");
    setLimitError(null);
    setIsTyping(true);

    let targetChatId = activeChatId;
    if (!targetChatId) {
      if (chatThreads.length > 0) {
        targetChatId = chatThreads[0].id;
        setActiveChatId(targetChatId);
      } else {
        targetChatId = "default";
      }
    }

    try {
      await api.post(`/projects/${workspaceId}/chats/${targetChatId}/ask`, {
        message: userMessage,
      });

      if (targetChatId !== activeChatId) {
        setActiveChatId(targetChatId);
      }
      queryClient.invalidateQueries({ queryKey: ["workspace-chats", workspaceId] });
      refetchMessages();
    } catch (err: unknown) {
      if (isLimitReachedError(err)) {
        setLimitError(err);
      } else {
        toast.error(getAxiosErrorMessage(err, "Failed to send message"));
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "User";

  return (
    <Sidebar>
      {/* ── Flush Edge-to-Edge Container (No outer margins, no outer padding, no color contrast) ── */}
      <div className="w-[calc(100%+2.5rem)] md:w-[calc(100%+3.5rem)] h-[calc(100%+2.5rem)] md:h-[calc(100%+3.5rem)] -m-5 md:-m-7 flex flex-col lg:flex-row overflow-hidden bg-card">
        
        {/* ── LEFT INNER SIDEBAR / DRAWER (Divided by single border-r line) ── */}
        <div className="w-full lg:w-80 shrink-0 border-r border-border p-4 pb-3 flex flex-col justify-between h-full overflow-hidden bg-card">
          
          {/* Top Section: Categorized Chat History ("Today", "Yesterday", "7 days ago") */}
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <History className="w-4 h-4 text-primary" />
                <span>Chat History</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded border">
                {chatThreads.length} threads
              </span>
            </div>

            {/* Date Grouped Scrollable History */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {isThreadsLoading ? (
                <div className="py-6 text-center text-xs text-muted-foreground animate-pulse">Loading history...</div>
              ) : groupedChatHistory.length > 0 ? (
                groupedChatHistory.map((group) => (
                  <div key={group.label} className="space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60 px-1">
                      {group.label}
                    </div>
                    <div className="space-y-1">
                      {group.chats.map((thread) => (
                        <button
                          key={thread.id}
                          onClick={() => setActiveChatId(thread.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between group ${
                            activeChatId === thread.id
                              ? "text-foreground font-bold bg-secondary/50"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                          }`}
                        >
                          <span className="truncate pr-2">{thread.title || "Untitled Chat"}</span>
                          {activeChatId === thread.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center space-y-2 border border-dashed border-border/60 rounded-lg p-3">
                  <MessageSquare className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                  <p className="text-xs text-muted-foreground font-medium">No chat history</p>
                  <p className="text-[10px] text-muted-foreground/70">Click "+ New Chat" below to start.</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Inner Sidebar Controls (Wireframe: Members, Knowledge Source, New Chat) */}
          <div className="mt-auto pt-3 border-t border-border/40 shrink-0 space-y-2">
            
            {/* Members Button */}
            <button
              onClick={() => setIsMembersModalOpen(true)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors flex items-center justify-between border border-border/40"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Members</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                {members.length}
              </span>
            </button>

            {/* Knowledge Source Button */}
            <button
              onClick={() => setIsKnowledgeModalOpen(true)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors flex items-center justify-between border border-border/40"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Knowledge Source</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                {realSources.length}
              </span>
            </button>

            {/* Wireframe Primary Action: New Chat (Pinned at absolute bottom of drawer) */}
            <Button
              size="sm"
              className="w-full h-9 text-xs font-bold gap-2 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground mt-1"
              onClick={() => {
                setActiveChatId(null);
                createChatMutation.mutate();
              }}
              disabled={createChatMutation.isPending}
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* ── RIGHT MAIN CHAT AREA (Seamless continuation, same bg-card background) ── */}
        <div className="flex-1 flex flex-col h-full bg-card min-w-0 overflow-hidden">
          
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto min-h-0 flex flex-col">
            {messages.length === 0 ? (
              
              /* ── WELCOME HERO VIEW (Wireframe Sketch with Centered Input) ── */
              <div className="my-auto flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full space-y-6">
                
                {/* Redas Logo & Brand Section */}
                <div className="space-y-3 flex flex-col items-center">
                  <div className="flex items-center gap-2.5 mb-1">
                    <img src="/redas_icon.png" alt={`${PLATFORM_NAME} Logo`} className="h-10 w-10 object-contain shrink-0" />
                    <span className="text-xl font-extrabold tracking-tight text-foreground font-outfit">{PLATFORM_NAME}</span>
                  </div>
                  
                  {/* Greeting, User-Name */}
                  <h2 className="text-2xl font-extrabold text-foreground font-outfit tracking-tight">
                    Greeting, {userName}
                  </h2>
                  
                  {/* How can I Assist You */}
                  <p className="text-sm font-semibold text-muted-foreground">
                    How can I Assist You
                  </p>
                </div>

                {/* Centered Input Box directly under "How can I Assist You" */}
                <div className="w-full pt-2">
                  {limitError && (
                    <div className="p-2.5 mb-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center justify-between">
                      <span>{limitError.error}</span>
                      <Link href="/dashboard/plans">
                        <Button size="sm" className="h-6 text-[10px] font-bold">
                          Upgrade Plan
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center gap-2 bg-background border border-input rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                    <Input
                      ref={inputRef}
                      placeholder="Ask anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                      className="text-sm border-0 shadow-none focus-visible:ring-0 h-10 bg-transparent"
                    />
                    
                    {/* Circular Send Action Button (Wireframe Circle Button 'A') */}
                    <Button
                      size="icon"
                      onClick={() => void handleSend()}
                      disabled={!input.trim() || isTyping}
                      className="h-9 w-9 rounded-full font-bold text-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              
              /* ── ACTIVE CHAT MESSAGES ── */
              <div className="space-y-4 my-auto w-full">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex gap-3 text-xs ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                          : "bg-secondary/70 border border-border text-foreground rounded-tl-none"
                      }`}
                    >
                      {msg.role === "user" ? (
                        msg.content
                      ) : (
                        <div className="prose prose-invert prose-xs max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 text-xs justify-start">
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 animate-pulse">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-secondary/70 border border-border text-muted-foreground rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* PINNED BOTTOM INPUT BAR (Active Chat) */}
          {messages.length > 0 && (
            <div className="p-4 border-t border-border/40 bg-card shrink-0 space-y-2">
              {limitError && (
                <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center justify-between">
                  <span>{limitError.error}</span>
                  <Link href="/dashboard/plans">
                    <Button size="sm" className="h-6 text-[10px] font-bold">
                      Upgrade Plan
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center gap-2 bg-background border border-input rounded-xl p-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20">
                <Input
                  ref={inputRef}
                  placeholder="Ask a question or type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  className="text-xs border-0 shadow-none focus-visible:ring-0 h-9 bg-transparent"
                />
                
                <Button
                  size="icon"
                  onClick={() => void handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="h-9 w-9 rounded-full font-bold text-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Members Modal */}
      <Dialog open={isMembersModalOpen} onOpenChange={setIsMembersModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-outfit text-lg flex items-center justify-between pr-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Workspace Members
              </div>
              <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded border">
                {members.length} Members
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Active team members with access to this workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 max-h-64 overflow-y-auto">
            {members.map((m) => (
              <div key={m.user_id} className="p-2.5 bg-secondary/30 border border-border/50 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                    {(m.role_name || m.role_id || "M")[0].toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-foreground truncate">{m.user_name || m.user_email || m.user_id}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{m.role_name || m.role_id}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active
                </span>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-2 flex items-center justify-between">
            {isOwner && (
              <Button
                size="sm"
                onClick={() => {
                  setIsMembersModalOpen(false);
                  setIsInviteModalOpen(true);
                }}
                className="text-xs h-8 font-semibold gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Invite Member
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setIsMembersModalOpen(false)} className="text-xs h-8">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Knowledge Sources Modal */}
      <Dialog open={isKnowledgeModalOpen} onOpenChange={setIsKnowledgeModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-outfit text-lg flex items-center justify-between pr-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Knowledge Sources
              </div>
              <span className="text-xs font-mono bg-secondary px-2 py-0.5 rounded border">
                {realSources.length} Indexed
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ingest PDF files, website URLs, or text guidelines into workspace.
            </DialogDescription>
          </DialogHeader>

          {realSources.length > 0 && (
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 pb-2">
              {realSources.map((s) => (
                <div key={s.id || s.source} className="p-2 bg-secondary/30 border border-border/50 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    {s.type === "pdf" ? (
                      <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    )}
                    <span className="font-medium text-foreground truncate" title={s.source}>{s.source}</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {s.chunk_count || 0} chunks
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 py-2 border-t border-border/40">
            <div className="flex border-b border-border/60 pb-2 gap-2">
              <Button
                size="sm"
                variant={sourceType === "url" ? "default" : "outline"}
                className="h-8 text-xs gap-1.5"
                onClick={() => setSourceType("url")}
              >
                <Globe className="w-3.5 h-3.5" /> Web URL
              </Button>
              <Button
                size="sm"
                variant={sourceType === "pdf" ? "default" : "outline"}
                className="h-8 text-xs gap-1.5"
                onClick={() => setSourceType("pdf")}
              >
                <FileText className="w-3.5 h-3.5" /> PDF File
              </Button>
              <Button
                size="sm"
                variant={sourceType === "text" ? "default" : "outline"}
                className="h-8 text-xs gap-1.5"
                onClick={() => setSourceType("text")}
              >
                <FileUp className="w-3.5 h-3.5" /> Text / FAQ
              </Button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-3">
              {sourceType === "url" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Website / Documentation URL</label>
                  <Input
                    type="url"
                    placeholder="https://docs.company.com/workspace-guide"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="text-xs h-9"
                    required
                  />
                </div>
              )}

              {sourceType === "pdf" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Upload PDF File</label>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setSourceFile(e.target.files?.[0] || null)}
                    className="text-xs h-9"
                    required
                  />
                </div>
              )}

              {sourceType === "text" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Text / Guidelines Snippet</label>
                  <textarea
                    placeholder="Paste text guidelines, company FAQs, or knowledge snippet..."
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-md border border-input bg-background min-h-[100px] focus:outline-hidden"
                    required
                  />
                </div>
              )}

              <Button type="submit" size="sm" disabled={isIngesting} className="w-full h-8 text-xs font-semibold gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                {isIngesting ? "Ingesting Knowledge..." : "Ingest Source into Workspace"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Member Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-outfit text-lg">Invite Member to Workspace</DialogTitle>
            <DialogDescription className="text-xs">
              Invite a colleague to access and chat in this workspace.
            </DialogDescription>
          </DialogHeader>

          {!createdInviteToken ? (
            <form onSubmit={handleInviteSubmit} className="space-y-4 py-2">
              {inviteError && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  {inviteError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="text-xs h-9"
                  autoFocus
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inviteEmail.trim() || inviteMutation.isPending}
                  className="text-xs h-8 font-semibold"
                >
                  {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-4 py-3">
              <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                Invitation created for <strong>{inviteEmail}</strong>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Direct Invitation Link</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/org/invite/${createdInviteToken}`}
                    className="text-xs h-9 font-mono text-muted-foreground bg-muted/40"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 gap-1.5 text-xs shrink-0"
                    onClick={() => copyInviteLink(createdInviteToken)}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Link"}
                  </Button>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  size="sm"
                  className="text-xs h-8 w-full font-semibold"
                  onClick={() => {
                    setIsInviteModalOpen(false);
                    setCreatedInviteToken(null);
                  }}
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
