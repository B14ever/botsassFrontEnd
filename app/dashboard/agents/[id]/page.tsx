"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { fetchUsage, fetchUsageAnalytics } from "@/lib/api/usage";
import {
  BarChart3, use, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  Palette,
  User,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  RefreshCcw,
  Sparkles,
  Globe,
  Upload,
  Plus,
  FileText,
  AlertCircle,
  Monitor,
  Code2,
  Send as SendIcon,
  MessageSquare,
  Check,
  Copy,
  ShieldCheck,
  Terminal,
  ExternalLink,
  MessageSquareCode,
  Smartphone,
  Eye,
  Trash2
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { getAxiosErrorMessage } from "@/lib/api/errors";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type BotRecord = {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  primary_color: string;
  welcome_message: string;
  preferred_language: string;
  created_at: string;
};

type KnowledgeResponse = {
  ready: boolean;
  source_count: number;
  chunk_count: number;
};

export default function AgentWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Workspace and Usage Queries
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  const { data: usage } = useQuery({
    queryKey: ["usage", activeWorkspaceId],
    queryFn: fetchUsage,
    enabled: !!activeWorkspaceId,
  });

  const { data: analytics } = useQuery({
    queryKey: ["usage-analytics", activeWorkspaceId],
    queryFn: fetchUsageAnalytics,
    enabled: !!activeWorkspaceId,
  });

  const botAnalytics = analytics?.bot_counts?.find((b) => b.bot_id === id);
  const botMessageCount = botAnalytics?.count || 0;

  // Tab State
  const initialTab = searchParams.get("tab") || "basic-info";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab changes to URL search params
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("tab", tabId);
    router.replace(`/dashboard/agents/${id}?${newParams.toString()}`);
  };

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Queries
  const { data: bot, isLoading: botLoading } = useQuery<BotRecord>({
    queryKey: ["bot", id],
    queryFn: async () => {
      const resp = await api.get(`/bots/${id}`);
      return resp.data;
    },
  });

  const { data: knowledge, refetch: refetchKnowledge } = useQuery<KnowledgeResponse>({
    queryKey: ["knowledge", id],
    queryFn: async () => {
      const response = await api.get(`/bots/${id}/knowledge`);
      return response.data;
    },
  });

  const { data: channelsData = [], refetch: refetchChannels } = useQuery<any[]>({
    queryKey: ["bot-channels", id],
    queryFn: async () => {
      const resp = await api.get(`/bots/${id}/channels`);
      return resp.data || [];
    },
  });
  const channels = channelsData || [];

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar_url: "",
    primary_color: "#10b981",
    welcome_message: "Hello! How can I help you today?"
  });

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name || "",
        description: bot.description || "",
        avatar_url: bot.avatar_url || "",
        primary_color: bot.primary_color || "#10b981",
        welcome_message: bot.welcome_message || "Hello! How can I help you today?"
      });
    }
  }, [bot]);

  // Ingestion State
  const [ingesting, setIngesting] = useState(false);
  const [ingestionError, setIngestionError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  // Channels state
  const [telegramToken, setTelegramToken] = useState("");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappVerifyToken, setWhatsappVerifyToken] = useState("");
  const [whatsappAccessToken, setWhatsappAccessToken] = useState("");
  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [isConnectingWhatsApp, setIsConnectingWhatsApp] = useState(false);

  // Interactive Live Chat Testing State
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Reset chat if the bot details change or on tab enter
  useEffect(() => {
    if (activeTab === "preview-widget" && messages.length === 0 && bot) {
      setMessages([
        { role: "assistant", content: formData.welcome_message }
      ]);
    }
  }, [activeTab, bot]);

  // Mutations
  const updateBotMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return api.patch(`/bots/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Agent settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bot", id] });
    },
    onError: () => {
      toast.error("Failed to update agent settings");
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotMutation.mutate(formData);
  };

  // Embed script variables
  const scriptUrl = typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}/widget.js`
    : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/widget.js`;
  const embedCode = `<!-- Redas Widget -->\n<script\n  src="${scriptUrl}"\n  data-bot-id="${id}"\n  async\n></script>\n<!-- End Redas Widget -->`;
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success("Code copied to clipboard!");
    } catch {
      const el = document.createElement("textarea");
      el.value = embedCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast.success("Code copied!");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Telegram Handlers
  const handleConnectTelegram = async () => {
    if (!telegramToken.trim()) {
      toast.error("Please enter a Telegram Bot Token");
      return;
    }
    setIsConnectingTelegram(true);
    try {
      await api.post(`/bots/${id}/channels`, {
        type: "telegram",
        config: { bot_token: telegramToken.trim() }
      });
      toast.success("Telegram channel connected successfully!");
      setTelegramToken("");
      refetchChannels();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to connect Telegram");
    } finally {
      setIsConnectingTelegram(false);
    }
  };

  // WhatsApp Handlers
  const handleConnectWhatsApp = async () => {
    if (!whatsappPhoneId.trim() || !whatsappVerifyToken.trim() || !whatsappAccessToken.trim()) {
      toast.error("Please fill in all WhatsApp fields");
      return;
    }
    setIsConnectingWhatsApp(true);
    try {
      await api.post(`/bots/${id}/channels`, {
        type: "whatsapp",
        config: {
          phone_number_id: whatsappPhoneId.trim(),
          verify_token: whatsappVerifyToken.trim(),
          access_token: whatsappAccessToken.trim()
        }
      });
      toast.success("WhatsApp channel connected successfully!");
      setWhatsappPhoneId("");
      setWhatsappVerifyToken("");
      setWhatsappAccessToken("");
      refetchChannels();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to connect WhatsApp");
    } finally {
      setIsConnectingWhatsApp(false);
    }
  };

  const handleDisconnectChannel = async (channelId: string) => {
    if (!confirm("Are you sure you want to disconnect this channel? Webhook connections will be removed.")) return;
    try {
      await api.delete(`/bots/${id}/channels/${channelId}`);
      toast.success("Channel disconnected successfully");
      refetchChannels();
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect channel");
    }
  };

  // URL Ingest
  const handleIngestURL = async () => {
    if (!url) return;
    setIngesting(true);
    setIngestionError(null);
    try {
      await api.post("/ingest/url", { bot_id: id, source: url, content_rights_confirmed: rightsConfirmed });
      toast.success("Website import started!");
      setUrl("");
      setTimeout(() => refetchKnowledge(), 3000);
    } catch (error: unknown) {
      const errMsg = getAxiosErrorMessage(error, "Ingestion failed");
      setIngestionError(errMsg);
      toast.error(errMsg);
    } finally {
      setIngesting(false);
    }
  };

  // PDF Ingest
  const handleIngestPDF = async () => {
    if (!pdfFile) return;
    setIngesting(true);
    setIngestionError(null);
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("bot_id", id);
    formData.append("content_rights_confirmed", String(rightsConfirmed));

    try {
      await api.post("/ingest/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("PDF import started!");
      setPdfFile(null);
      setTimeout(() => refetchKnowledge(), 3000);
    } catch (error: unknown) {
      const errMsg = getAxiosErrorMessage(error, "Ingestion failed");
      setIngestionError(errMsg);
      toast.error(errMsg);
    } finally {
      setIngesting(false);
    }
  };

  // Live Chat streaming message ask handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const session = await getSession();
      const token = (session as { accessToken?: string } | null)?.accessToken ?? "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/chat/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bot_id: id, message: userMessage }),
        }
      );

      if (!response.ok) {
        const errorPayload = (await response.json()) as Record<string, unknown>;
        throw new Error((errorPayload.error as string) || "Failed to connect to agent");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      let assistantMessage = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            assistantMessage += line.slice(6);
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1].content = assistantMessage;
              return next;
            });
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to connect to agent.";
      toast.error(message);
    } finally {
      setIsTyping(false);
    }
  };

  if (botLoading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-[70vh]">
          <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      {/* ── Flush Edge-to-Edge Container (Cancels default Sidebar card border & padding) ── */}
      <div className="w-[calc(100%+2.5rem)] md:w-[calc(100%+3.5rem)] h-[calc(100%+2.5rem)] md:h-[calc(100%+3.5rem)] -m-5 md:-m-7 flex flex-col lg:flex-row overflow-hidden bg-card animate-in fade-in duration-300">
        
        {/* LEFT PANEL: Menu & Navigation (Clean sidebar nav with border-r, p-5, matching workspace layout) */}
        <div className="w-full lg:w-64 shrink-0 border-r border-border/40 p-5 flex flex-col h-full overflow-y-auto bg-card space-y-6">
          
          {/* Bot Name Title Block (Actual bot name only, no label) */}
          <div className="pb-4 border-b border-border/40">
            <h2 className="text-base font-bold text-foreground leading-tight  truncate">
              {formData.name || bot?.name || "AI Agent"}
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            {/* General Group */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 block px-2 pb-1">General</span>
              <button
                onClick={() => handleTabChange("basic-info")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "basic-info"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <User className="w-4 h-4" />
                Basic Info
              </button>
              <button
                onClick={() => handleTabChange("knowledge")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "knowledge"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <FileText className="w-4 h-4" />
                Knowledge Info
              </button>
            </div>

            {/* Integrations Group */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 block px-2 pb-1">Integration</span>
              <button
                onClick={() => handleTabChange("integration-widget")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "integration-widget"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <MessageSquareCode className="w-4 h-4" />
                Chat Widget
              </button>
              <button
                onClick={() => handleTabChange("integration-telegram")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "integration-telegram"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <SendIcon className="w-4 h-4" />
                  Telegram
                </span>
                {channels.some(c => c.type === 'telegram') && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'integration-telegram' ? 'bg-primary-foreground' : 'bg-green-500 animate-pulse'}`} />
                )}
              </button>
              <button
                onClick={() => handleTabChange("integration-whatsapp")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "integration-whatsapp"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </span>
                {channels.some(c => c.type === 'whatsapp') && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'integration-whatsapp' ? 'bg-primary-foreground' : 'bg-green-500 animate-pulse'}`} />
                )}
              </button>
            </div>

            {/* Appearance Group */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 block px-2 pb-1">Preview</span>
              <button
                onClick={() => handleTabChange("preview-theme")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "preview-theme"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Palette className="w-4 h-4" />
                Theme Settings
              </button>
              <button
                onClick={() => handleTabChange("preview-widget")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "preview-widget"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview Widget
              </button>
            </div>
          </nav>
        </div>

        {/* RIGHT PANEL: Tab Contents (Clean borderless layout, p-5 md:p-7, scrollable) */}
        <div className="flex-1 p-5 md:p-7 h-full overflow-y-auto">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic-info" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">Agent Profile</h2>
                    <p className="text-xs text-muted-foreground mt-1">Configure the basic identity of your AI assistant.</p>
                  </div>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="space-y-4 max-w-2xl">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Agent Name</Label>
                        <Input 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Support Assistant"
                          className="bg-background"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Avatar Image URL</Label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input 
                              value={formData.avatar_url}
                              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                              placeholder="https://example.com/bot-avatar.png"
                              className="bg-background"
                            />
                          </div>
                          <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                            {formData.avatar_url ? (
                              <img src={formData.avatar_url} className="w-full h-full object-cover" alt="preview" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/45" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Internal Description</Label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="What is the objective or grounding context of this bot?"
                          className="w-full bg-secondary/40 border border-border rounded-md p-4 text-xs text-foreground placeholder:text-muted-foreground/50 h-28 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border/20 flex gap-3">
                      <Button 
                        type="submit"
                        disabled={updateBotMutation.isPending}
                        className="gap-2"
                      >
                        {updateBotMutation.isPending ? "Saving Profile..." : "Save Agent Profile"}
                        <Save className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB: USAGE METRICS */}
              {activeTab === "usage-metrics" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground">Usage Metrics</h2>
                    <p className="text-xs text-muted-foreground mt-1">Real-time usage volume and performance indicators for this agent.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl pt-2">
                    <div className="border border-border p-5 rounded-md bg-secondary/15 space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span>Messages Processed</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{botMessageCount}</p>
                      <p className="text-[10px] text-muted-foreground">Volume in the current billing period</p>
                    </div>

                    <div className="border border-border p-5 rounded-md bg-secondary/15 space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span>Avg Response Time</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{analytics?.avg_response_time || 0}s</p>
                      <p className="text-[10px] text-muted-foreground">Average text streaming generation latency</p>
                    </div>

                    <div className="border border-border p-5 rounded-md bg-secondary/15 space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                        <Check className="w-4 h-4 text-blue-500" />
                        <span>Resolution Rate</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{analytics?.resolution_rate || 100}%</p>
                      <p className="text-[10px] text-muted-foreground">Successful query response delivery rate</p>
                    </div>
                  </div>

                  {usage && (
                    <div className="border border-border/60 bg-secondary/5 rounded-md p-5 max-w-4xl space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Workspace Message Share</h3>
                        <p className="text-[11px] text-muted-foreground">Percentage of your workspace's total monthly message limit consumed by this specific agent.</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-foreground">
                          <span>{botMessageCount} messages</span>
                          <span>Limit: {usage.limits.chat_messages_per_month}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(100, Math.round((botMessageCount / (usage.limits.chat_messages_per_month || 1)) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>This agent represents {Math.min(100, Math.round((botMessageCount / (usage.used.chat_messages || 1)) * 100))}% of current workspace usage ({usage.used.chat_messages} messages used)</span>
                          <span>{Math.min(100, Math.round((botMessageCount / (usage.limits.chat_messages_per_month || 1)) * 100))}% of total monthly limit</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: KNOWLEDGE INFO */}
              {activeTab === "knowledge" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">Grounded Knowledge Base</h2>
                    <p className="text-xs text-muted-foreground mt-1">Add documentation, websites, or PDFs so your agent has the right context to answer customer questions.</p>
                  </div>
                  {ingestionError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md flex gap-3 text-red-200">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <div className="text-xs space-y-1">
                        <p className="font-bold">Ingestion issue detected</p>
                        <p className="opacity-80 leading-relaxed">{ingestionError}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6 max-w-2xl">
                    <label className="flex gap-3 rounded-lg border border-border/80 bg-secondary/20 p-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rightsConfirmed}
                        onChange={(event) => setRightsConfirmed(event.target.checked)}
                        className="mt-0.5 border-border bg-secondary accent-primary w-3.5 h-3.5"
                      />
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        I confirm that I have the legal rights to use this website crawler or upload this PDF document, and understand that crawling must respect access guidelines.
                      </div>
                    </label>

                    <Tabs defaultValue="url" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-secondary/40 border border-border/60 p-1 h-10 rounded-lg">
                        <TabsTrigger value="url" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs font-semibold">
                          <Globe className="w-3.5 h-3.5 mr-2" />
                          Website Crawler
                        </TabsTrigger>
                        <TabsTrigger value="file" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs font-semibold">
                          <Upload className="w-3.5 h-3.5 mr-2" />
                          PDF Document
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="url" className="mt-4 space-y-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground font-medium">Target URL to Index</Label>
                          <Input 
                            placeholder="https://docs.mycompany.com" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleIngestURL}
                          disabled={!url || ingesting || !rightsConfirmed}
                          className="w-full"
                        >
                          {ingesting ? "Importing Website..." : "Index Website URL"}
                        </Button>
                      </TabsContent>

                      <TabsContent value="file" className="mt-4 space-y-4">
                        <div 
                          className={`border-2 border-dashed rounded-lg p-7 flex flex-col items-center justify-center transition-all ${
                            pdfFile ? 'border-green-500/30 bg-green-500/10' : 'border-border/80 hover:border-border'
                          }`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file?.type === "application/pdf") setPdfFile(file);
                            else toast.error("Please upload a PDF file");
                          }}
                        >
                          {pdfFile ? (
                            <>
                              <FileText className="w-8 h-8 text-primary mb-2" />
                              <p className="text-xs font-medium text-foreground truncate max-w-[250px]">{pdfFile.name}</p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setPdfFile(null)}
                                className="mt-2 text-muted-foreground hover:text-foreground text-[10px] h-7"
                              >
                                Cancel Selection
                              </Button>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground/30 mb-2" />
                              <p className="text-xs text-muted-foreground text-center mb-1">Drag PDF file here or click to select</p>
                              <input 
                                type="file" 
                                accept=".pdf" 
                                className="hidden" 
                                id="pdf-upload-settings"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                              />
                              <Button 
                                type="button"
                                variant="outline" 
                                className="mt-2 border-border bg-secondary/50 rounded-lg text-[10px] h-8"
                                onClick={() => document.getElementById('pdf-upload-settings')?.click()}
                              >
                                Select PDF File
                              </Button>
                            </>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={handleIngestPDF}
                          disabled={!pdfFile || ingesting || !rightsConfirmed}
                          className="w-full font-bold text-xs"
                        >
                          {ingesting ? "Ingesting PDF..." : "Upload & Parse PDF"}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}

              {/* TAB 3: INTEGRATION - CHAT WIDGET */}
              {activeTab === "integration-widget" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">Embed Chat Widget</h2>
                    <p className="text-xs text-muted-foreground mt-1">Add this script to your site code to deploy the live chat widget bubble.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="space-y-3">
                        <div className="flex flex-row items-center justify-between">
                          <div>
                            <h3 className="text-xs font-bold text-foreground">Html Script Embed Code</h3>
                            <p className="text-[10px] text-muted-foreground">Paste it right before the closing &lt;/body&gt; tag</p>
                          </div>
                          <Button
                            onClick={handleCopyCode}
                            variant="outline"
                            className={`rounded-lg border-border h-8 px-2.5 text-[10px] transition-all ${
                              copied ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary"
                            }`}
                          >
                            {copied ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                            {copied ? "Copied!" : "Copy Code"}
                          </Button>
                        </div>
                        <div className="relative">
                          <pre className="bg-secondary/40 border border-border rounded-md p-4 overflow-x-auto font-mono text-[10px] leading-relaxed text-emerald-300 relative shadow-inner">
                            {embedCode}
                          </pre>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          {
                            title: "1. Embed code",
                            desc: "Paste the HTML script into your website builder or templates."
                          },
                          {
                            title: "2. Deploy site",
                            desc: "Push your updates live to let your users connect."
                          },
                          {
                            title: "3. Update theme",
                            desc: "Match widget color scheme anytime in the Theme panel."
                          }
                        ].map((step) => (
                          <div key={step.title} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">{step.title}</span>
                            <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-foreground">Embed Status</h3>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/40">
                          <span className="text-xs text-muted-foreground">Embed Service</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                            <span className="text-xs font-semibold text-foreground">Active</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 text-[10px] text-muted-foreground leading-relaxed">
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                            <p>Requests are securely validated via the public Agent ID.</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <p>Compatible with React, Vue, NextJS, Webflow, Shopify, WordPress.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: INTEGRATION - TELEGRAM */}
              {activeTab === "integration-telegram" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">Telegram Bot Connection</h2>
                    <p className="text-xs text-muted-foreground mt-1">Connect your AI Agent to a Telegram bot token to handle customer inquiries on Telegram.</p>
                  </div>

                  <div className="max-w-2xl space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-md border border-border/60">
                      <span className="text-xs font-medium text-foreground/70">Connection Status</span>
                      {channels.some(c => c.type === 'telegram') ? (
                        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase px-2.5 py-0.5 rounded-md">
                          Connected
                        </span>
                      ) : (
                        <span className="text-[10px] bg-secondary border border-border/60 text-muted-foreground font-bold uppercase px-2.5 py-0.5 rounded-md">
                          Disconnected
                        </span>
                      )}
                    </div>

                    {channels.some(c => c.type === 'telegram') ? (
                      (() => {
                        const tgChannel = channels.find(c => c.type === 'telegram');
                        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";
                        const hookUrl = `${backendUrl}/webhooks/telegram/${tgChannel.id}`;
                        return (
                          <div className="space-y-4 p-4 bg-secondary/35 border border-border rounded-md">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Webhook Callback</span>
                              <div className="text-xs font-mono text-emerald-300 bg-secondary p-3 rounded-lg break-all shadow-inner">
                                {hookUrl}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleDisconnectChannel(tgChannel.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-destructive/10 text-xs h-9 px-4"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                              Disconnect Telegram Bot
                            </Button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="space-y-4 p-4 bg-secondary/10 border border-border rounded-md">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground font-medium">Telegram Bot Token</Label>
                          <Input
                            type="password"
                            placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                            value={telegramToken}
                            onChange={(e) => setTelegramToken(e.target.value)}
                            className="bg-background"
                          />
                          <p className="text-[10px] text-muted-foreground/60 leading-normal">
                            Get a bot token by talking to the official <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-primary hover:underline">@BotFather</a> on Telegram.
                          </p>
                        </div>
                        <Button
                          type="button"
                          disabled={isConnectingTelegram} onClick={handleConnectTelegram}
                          className="font-bold text-xs"
                        >
                          {isConnectingTelegram ? "Connecting Bot..." : "Connect Bot Token"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: INTEGRATION - WHATSAPP */}
              {activeTab === "integration-whatsapp" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">WhatsApp Cloud API Connection</h2>
                    <p className="text-xs text-muted-foreground mt-1">Connect your AI Agent to your WhatsApp business profile using the official Meta developer cloud API.</p>
                  </div>

                  <div className="max-w-2xl space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-md border border-border/60">
                      <span className="text-xs font-medium text-foreground/70">Connection Status</span>
                      {channels.some(c => c.type === 'whatsapp') ? (
                        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase px-2.5 py-0.5 rounded-md">
                          Connected
                        </span>
                      ) : (
                        <span className="text-[10px] bg-secondary border border-border/60 text-muted-foreground font-bold uppercase px-2.5 py-0.5 rounded-md">
                          Disconnected
                        </span>
                      )}
                    </div>

                    {channels.some(c => c.type === 'whatsapp') ? (
                      (() => {
                        const waChannel = channels.find(c => c.type === 'whatsapp');
                        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";
                        const hookUrl = `${backendUrl}/webhooks/whatsapp/${waChannel.id}`;
                        const verifyToken = waChannel.config?.verify_token || "configured_verify_token";
                        return (
                          <div className="space-y-4.5 p-4 bg-secondary/35 border border-border rounded-md">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Webhook Callback URL</span>
                              <div className="text-xs font-mono text-emerald-300 bg-secondary p-3 rounded-lg break-all shadow-inner">
                                {hookUrl}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Verify Token</span>
                              <div className="text-xs font-mono text-emerald-300 bg-secondary p-3 rounded-lg break-all shadow-inner">
                                {verifyToken}
                              </div>
                            </div>
                            <p className="text-[10px] leading-relaxed text-muted-foreground/60">
                              Configure the Webhook parameters above inside the Webhooks settings in your Meta App Developer Dashboard.
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleDisconnectChannel(waChannel.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-destructive/10 text-xs h-9 px-4"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                              Disconnect WhatsApp
                            </Button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="space-y-4 p-4 bg-secondary/10 border border-border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground font-medium">Phone Number ID</Label>
                            <Input
                              placeholder="e.g. 109283920283722"
                              value={whatsappPhoneId}
                              onChange={(e) => setWhatsappPhoneId(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground font-medium">Webhook Verify Token</Label>
                            <Input
                              placeholder="Specify any unique string"
                              value={whatsappVerifyToken}
                              onChange={(e) => setWhatsappVerifyToken(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground font-medium">System User Access Token</Label>
                          <Input
                            type="password"
                            placeholder="EAABw..."
                            value={whatsappAccessToken}
                            onChange={(e) => setWhatsappAccessToken(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                        <Button
                          type="button"
                          disabled={isConnectingWhatsApp} onClick={handleConnectWhatsApp}
                          className="font-bold text-xs"
                        >
                          {isConnectingWhatsApp ? "Connecting WhatsApp..." : "Connect WhatsApp API"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: PREVIEW - THEME SETTINGS */}
              {activeTab === "preview-theme" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">Appearance Customization</h2>
                    <p className="text-xs text-muted-foreground mt-1">Adjust brand colors, custom themes, and default welcome greetings.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-5xl">
                    {/* Theme configuration form */}
                    <form onSubmit={handleProfileSubmit} className="lg:col-span-7 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-muted-foreground">Primary Brand Color</Label>
                          <div className="flex gap-2">
                            <Input 
                              type="color"
                              value={formData.primary_color}
                              onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                              className="w-9 h-9 p-1 bg-secondary border border-border rounded-md cursor-pointer"
                            />
                            <Input 
                              value={formData.primary_color}
                              onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                              className="flex-1 bg-background uppercase"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-muted-foreground">Preset Colors</Label>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'].map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setFormData({...formData, primary_color: color})}
                                className={`w-7 h-7 rounded-lg border-2 transition-all p-0 ${
                                  formData.primary_color === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">Greeting Welcome Message</Label>
                        <Input 
                          value={formData.welcome_message}
                          onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
                          placeholder="e.g. Hello! How can I help you today?"
                          className="bg-background"
                        />
                      </div>

                      <div className="pt-4 border-t border-border/20">
                        <Button 
                          type="submit"
                          disabled={updateBotMutation.isPending}
                          className="font-bold text-xs gap-2"
                        >
                          {updateBotMutation.isPending ? "Saving Appearance..." : "Save Appearance Settings"}
                          <Save className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </form>

                    {/* Instant Mock Widget Preview */}
                    <div className="lg:col-span-5 space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-1">Live Widget Mockup</span>
                      <div className="bg-background rounded-md border border-border overflow-hidden shadow-sm">
                        <div className="p-3 border-b border-border flex items-center gap-2" style={{ backgroundColor: `${formData.primary_color}18` }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: formData.primary_color }}>
                            {formData.avatar_url ? (
                              <img src={formData.avatar_url} className="w-full h-full object-cover" alt="bot" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[11px] font-bold text-foreground truncate">{formData.name || "Support Assistant"}</h4>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[8px] text-muted-foreground uppercase tracking-tighter">Online</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 space-y-3 h-44 bg-card/10 overflow-y-auto">
                          <div className="bg-secondary border border-border/50 rounded-md rounded-tl-none p-3 max-w-[85%] shadow-sm">
                            <p className="text-[10px] text-foreground leading-relaxed">
                              {formData.welcome_message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: PREVIEW - INTERACTIVE PREVIEW WIDGET */}
              {activeTab === "preview-widget" && (
                <div className="space-y-4 flex flex-col h-[65vh]">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">Live Widget Preview Sandbox</h2>
                    <p className="text-xs text-muted-foreground mt-1">Test the agent's knowledge and response speed in a real-time conversational streaming terminal.</p>
                  </div>

                  {/* Interactive Widget Terminal Container (borderless, direct layout) */}
                  <div className="flex-1 bg-background/50 border border-border/60 rounded-lg overflow-hidden flex flex-col min-h-0">
                    {/* Mock header */}
                    <div className="p-3 bg-secondary/30 border-b border-border/40 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: formData.primary_color }}>
                          {formData.avatar_url ? (
                            <img src={formData.avatar_url} className="w-full h-full object-cover" alt="bot" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground leading-none">{formData.name || "AI Agent"}</h4>
                          <span className="text-[8px] text-muted-foreground flex items-center gap-0.5 mt-0.5 uppercase tracking-tighter">
                            <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                            Sandboxed Terminal
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost" onClick={() => setMessages([{ role: "assistant", content: formData.welcome_message }])}
                        className="text-[10px] text-muted-foreground hover:text-foreground h-8 px-2.5 gap-1"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Restart Chat
                      </Button>
                    </div>

                    {/* Message Stream */}
                    <ScrollArea className="flex-1 p-4 min-h-0 font-sans">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
                          <Bot className="w-8 h-8 text-muted-foreground/30 animate-pulse" />
                          <p className="text-xs text-muted-foreground">Initializing chat terminal...</p>
                        </div>
                      ) : (
                        <div className="space-y-4 pb-2">
                          {messages.map((message, index) => (
                            <div
                              key={`${message.role}-${index}`}
                              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[85%] rounded-md px-3.5 py-2 text-xs border ${
                                  message.role === "user"
                                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                    : "bg-secondary/40 text-foreground border-border/85"
                                }`}
                              >
                                <div className="prose prose-sm max-w-none text-inherit leading-relaxed dark:prose-invert">
                                  <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                                {index === messages.length - 1 &&
                                  isTyping &&
                                  message.role === "assistant" && (
                                    <span className="inline-block w-1.5 h-3.5 bg-current opacity-60 ml-0.5 animate-pulse align-middle" />
                                  )}
                              </div>
                            </div>
                          ))}

                          {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
                            <div className="flex justify-start">
                              <div className="rounded-md px-3 py-1.5 bg-secondary/40 border border-border/80 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                              </div>
                            </div>
                          )}

                          <div ref={bottomRef} />
                        </div>
                      )}
                    </ScrollArea>

                    {/* Input Footer */}
                    <form onSubmit={handleSendChatMessage} className="p-3 bg-secondary/20 border-t border-border/40 flex items-center gap-2 shrink-0">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a query to test your grounded knowledge..."
                        disabled={isTyping}
                        className="flex-1 bg-secondary/50 border-border/60 h-10 rounded-lg text-xs"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!chatInput.trim() || isTyping}
                        className="h-9 w-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isTyping ? (
                          <RefreshCcw className="w-4 h-4 animate-spin" />
                        ) : (
                          <SendIcon className="w-4 h-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </Sidebar>
  );
}
