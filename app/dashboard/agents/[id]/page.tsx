"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { fetchUsage, fetchUsageAnalytics } from "@/lib/api/usage";
import { use, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Spokes } from "@/components/loading-ui/spokes";
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
  Trash2,
  BarChart3,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { getAxiosErrorMessage } from "@/lib/api/errors";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("agent_detail");
  const tCommon = useTranslations("common");
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
    welcome_message: t("default_welcome")
  });

  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name || "",
        description: bot.description || "",
        avatar_url: bot.avatar_url || "",
        primary_color: bot.primary_color || "#10b981",
        welcome_message: bot.welcome_message || t("default_welcome")
      });
    }
  }, [bot, t]);

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
        { role: "assistant", content: formData.welcome_message || t("default_welcome") }
      ]);
    }
  }, [activeTab, bot, formData.welcome_message, t]);

  // Mutations
  const updateBotMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return api.patch(`/bots/${id}`, data);
    },
    onSuccess: () => {
      toast.success(t("save_success"));
      queryClient.invalidateQueries({ queryKey: ["bot", id] });
    },
    onError: () => {
      toast.error(t("save_error"));
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
      toast.success(t("copied"));
    } catch {
      const el = document.createElement("textarea");
      el.value = embedCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast.success(t("copied"));
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Telegram Handlers
  const handleConnectTelegram = async () => {
    if (!telegramToken.trim()) {
      toast.error(t("telegram_token_label"));
      return;
    }
    setIsConnectingTelegram(true);
    try {
      await api.post(`/bots/${id}/channels`, {
        type: "telegram",
        config: { bot_token: telegramToken.trim() }
      });
      toast.success(t("telegram_success"));
      setTelegramToken("");
      refetchChannels();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || tCommon("error"));
    } finally {
      setIsConnectingTelegram(false);
    }
  };

  // WhatsApp Handlers
  const handleConnectWhatsApp = async () => {
    if (!whatsappPhoneId.trim() || !whatsappVerifyToken.trim() || !whatsappAccessToken.trim()) {
      toast.error(tCommon("error"));
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
      toast.success(t("whatsapp_success"));
      setWhatsappPhoneId("");
      setWhatsappVerifyToken("");
      setWhatsappAccessToken("");
      refetchChannels();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || tCommon("error"));
    } finally {
      setIsConnectingWhatsApp(false);
    }
  };

  const handleDisconnectChannel = async (channelId: string) => {
    if (!confirm(t("disconnect_confirm"))) return;
    try {
      await api.delete(`/bots/${id}/channels/${channelId}`);
      toast.success(t("channel_disconnected"));
      refetchChannels();
    } catch (err: any) {
      toast.error(err.message || tCommon("error"));
    }
  };

  // URL Ingest
  const handleIngestURL = async () => {
    if (!url) return;
    setIngesting(true);
    setIngestionError(null);
    try {
      await api.post("/ingest/url", { bot_id: id, source: url, content_rights_confirmed: rightsConfirmed });
      toast.success(t("ingest_url_success"));
      setUrl("");
      setTimeout(() => refetchKnowledge(), 3000);
    } catch (error: unknown) {
      const errMsg = getAxiosErrorMessage(error, t("ingest_issue"));
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
    const form = new FormData();
    form.append("file", pdfFile);
    form.append("bot_id", id);
    form.append("content_rights_confirmed", String(rightsConfirmed));

    try {
      await api.post("/ingest/pdf", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(t("ingest_pdf_success"));
      setPdfFile(null);
      setTimeout(() => refetchKnowledge(), 3000);
    } catch (error: unknown) {
      const errMsg = getAxiosErrorMessage(error, t("ingest_issue"));
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
        throw new Error((errorPayload.error as string) || tCommon("error"));
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
      const message = error instanceof Error ? error.message : tCommon("error");
      toast.error(message);
    } finally {
      setIsTyping(false);
    }
  };

  if (botLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spokes className="size-16" />
      </div>
    );
  }

  return (
    /* ── Flush Edge-to-Edge Container (Cancels default Sidebar card border & padding) ── */
    <div className="w-[calc(100%+2.5rem)] md:w-[calc(100%+3.5rem)] h-[calc(100%+2.5rem)] md:h-[calc(100%+3.5rem)] -m-5 md:-m-7 flex flex-col lg:flex-row overflow-hidden bg-card animate-in fade-in duration-300">
        
        {/* LEFT PANEL: Menu & Navigation */}
        <div className="w-full lg:w-64 shrink-0 border-r border-border/40 p-5 flex flex-col h-full overflow-y-auto bg-card space-y-6">
          
          {/* Bot Name Title Block */}
          <div className="pb-4 border-b border-border/40">
            <h2 className="text-base font-bold text-foreground leading-tight truncate">
              {formData.name || bot?.name || t("ai_assistant")}
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            {/* General Group */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 block px-2 pb-1">
                {t("general_group")}
              </span>
              <button
                onClick={() => handleTabChange("basic-info")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "basic-info"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                {t("tab_basic_info")}
              </button>
              <button
                onClick={() => handleTabChange("knowledge")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "knowledge"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                {t("tab_knowledge")}
              </button>
              <button
                onClick={() => handleTabChange("usage-metrics")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "usage-metrics"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <BarChart3 className="w-4 h-4 shrink-0" />
                {t("tab_usage_metrics")}
              </button>
            </div>

            {/* Integrations Group */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 block px-2 pb-1">
                {t("integration_group")}
              </span>
              <button
                onClick={() => handleTabChange("integration-widget")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "integration-widget"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <MessageSquareCode className="w-4 h-4 shrink-0" />
                {t("tab_chat_widget")}
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
                  <SendIcon className="w-4 h-4 shrink-0" />
                  {t("tab_telegram")}
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
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {t("tab_whatsapp")}
                </span>
                {channels.some(c => c.type === 'whatsapp') && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'integration-whatsapp' ? 'bg-primary-foreground' : 'bg-green-500 animate-pulse'}`} />
                )}
              </button>
            </div>

            {/* Appearance Group */}
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/50 block px-2 pb-1">
                {t("preview_group")}
              </span>
              <button
                onClick={() => handleTabChange("preview-theme")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "preview-theme"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Palette className="w-4 h-4 shrink-0" />
                {t("tab_theme_settings")}
              </button>
              <button
                onClick={() => handleTabChange("preview-widget")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                  activeTab === "preview-widget"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Eye className="w-4 h-4 shrink-0" />
                {t("tab_preview_widget")}
              </button>
            </div>
          </nav>
        </div>

        {/* RIGHT PANEL: Tab Contents */}
        <div className={`flex-1 h-full flex flex-col ${activeTab === "preview-widget" ? "p-0 overflow-hidden" : "p-5 md:p-7 overflow-y-auto"}`}>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={activeTab === "preview-widget" ? "h-full flex flex-col flex-1 min-h-0" : "space-y-6"}
            >
              
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic-info" && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-border/40">
                    <h2 className="text-lg font-bold text-foreground ">{t("profile_title")}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t("profile_desc")}</p>
                  </div>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="space-y-4 max-w-2xl">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">{t("agent_name")}</Label>
                        <Input 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder={t("agent_name_placeholder")}
                          className="bg-background"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground">{t("avatar_url")}</Label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input 
                              value={formData.avatar_url}
                              onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                              placeholder={t("avatar_url_placeholder")}
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
                        <Label className="text-xs font-medium text-muted-foreground">{t("internal_desc")}</Label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder={t("internal_desc_placeholder")}
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
                        {updateBotMutation.isPending ? t("saving_profile") : t("save_profile")}
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
                    <h2 className="text-lg font-bold text-foreground">{t("metrics_title")}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t("metrics_desc")}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl pt-2">
                    <div className="border border-border p-5 rounded-md bg-secondary/15 space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span>{t("messages_processed")}</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{botMessageCount}</p>
                      <p className="text-[10px] text-muted-foreground">{t("billing_volume")}</p>
                    </div>

                    <div className="border border-border p-5 rounded-md bg-secondary/15 space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span>{t("avg_response_time")}</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{analytics?.avg_response_time || 0}s</p>
                      <p className="text-[10px] text-muted-foreground">{t("latency_desc")}</p>
                    </div>

                    <div className="border border-border p-5 rounded-md bg-secondary/15 space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                        <Check className="w-4 h-4 text-blue-500" />
                        <span>{t("resolution_rate")}</span>
                      </div>
                      <p className="text-3xl font-bold text-foreground">{analytics?.resolution_rate || 100}%</p>
                      <p className="text-[10px] text-muted-foreground">{t("resolution_desc")}</p>
                    </div>
                  </div>

                  {usage && (
                    <div className="border border-border/60 bg-secondary/5 rounded-md p-5 max-w-4xl space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{t("workspace_share")}</h3>
                        <p className="text-[11px] text-muted-foreground">{t("workspace_share_desc")}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-foreground">
                          <span>{t("messages_count", { count: botMessageCount })}</span>
                          <span>{t("limit_count", { limit: usage.limits.chat_messages_per_month })}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(100, Math.round((botMessageCount / (usage.limits.chat_messages_per_month || 1)) * 100))}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>{t("agent_share_text", { pct: Math.min(100, Math.round((botMessageCount / (usage.used.chat_messages || 1)) * 100)), used: usage.used.chat_messages })}</span>
                          <span>{t("total_share_text", { pct: Math.min(100, Math.round((botMessageCount / (usage.limits.chat_messages_per_month || 1)) * 100)) })}</span>
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
                    <h2 className="text-lg font-bold text-foreground ">{t("knowledge_title")}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t("knowledge_desc")}</p>
                  </div>
                  {ingestionError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md flex gap-3 text-red-200">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <div className="text-xs space-y-1">
                        <p className="font-bold">{t("ingest_issue")}</p>
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
                        {t("rights_confirmation")}
                      </div>
                    </label>

                    <Tabs defaultValue="url" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-secondary/40 border border-border/60 p-1 h-10 rounded-lg">
                        <TabsTrigger value="url" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs font-semibold">
                          <Globe className="w-3.5 h-3.5 mr-2" />
                          {t("crawler_tab")}
                        </TabsTrigger>
                        <TabsTrigger value="file" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs font-semibold">
                          <Upload className="w-3.5 h-3.5 mr-2" />
                          {t("pdf_tab")}
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="url" className="mt-4 space-y-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground font-medium">{t("url_label")}</Label>
                          <Input 
                            placeholder={t("url_placeholder")} 
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
                          {ingesting ? t("importing_url") : t("index_url_btn")}
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
                            else toast.error(t("pdf_only_error"));
                          }}
                        >
                          {pdfFile ? (
                            <>
                              <FileText className="w-8 h-8 text-primary mb-2" />
                              <p className="text-xs font-medium text-foreground truncate">{pdfFile.name}</p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setPdfFile(null)}
                                className="mt-2 text-muted-foreground hover:text-foreground text-[10px] h-7"
                              >
                                {t("cancel_selection")}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground/30 mb-2" />
                              <p className="text-xs text-muted-foreground text-center mb-1">{t("drag_pdf")}</p>
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
                                {t("select_pdf_btn")}
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
                          {ingesting ? t("ingesting_pdf") : t("upload_pdf_btn")}
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
                    <h2 className="text-lg font-bold text-foreground ">{t("widget_title")}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t("widget_desc")}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="space-y-3">
                        <div className="flex flex-row items-center justify-between">
                          <div>
                            <h3 className="text-xs font-bold text-foreground">{t("embed_code_title")}</h3>
                            <p className="text-[10px] text-muted-foreground">{t("embed_code_subtitle")}</p>
                          </div>
                          <Button
                            onClick={handleCopyCode}
                            variant="outline"
                            className={`rounded-lg border-border h-8 px-2.5 text-[10px] transition-all ${
                              copied ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary"
                            }`}
                          >
                            {copied ? <Check className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                            {copied ? t("copied") : t("copy_code")}
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
                            title: t("step1_title"),
                            desc: t("step1_desc")
                          },
                          {
                            title: t("step2_title"),
                            desc: t("step2_desc")
                          },
                          {
                            title: t("step3_title"),
                            desc: t("step3_desc")
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
                        <h3 className="text-xs font-bold text-foreground">{t("embed_status")}</h3>
                        <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/40">
                          <span className="text-xs text-muted-foreground">{t("embed_service")}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                            <span className="text-xs font-semibold text-foreground">{t("active_status")}</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 text-[10px] text-muted-foreground leading-relaxed">
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                            <p>{t("security_note")}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <p>{t("compatibility_note")}</p>
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
                    <h2 className="text-lg font-bold text-foreground ">{t("telegram_title")}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t("telegram_desc")}</p>
                  </div>

                  <div className="max-w-2xl space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-md border border-border/60">
                      <span className="text-xs font-medium text-foreground/70">{t("connection_status")}</span>
                      {channels.some(c => c.type === 'telegram') ? (
                        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase px-2.5 py-0.5 rounded-md">
                          {t("connected")}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-secondary border border-border/60 text-muted-foreground font-bold uppercase px-2.5 py-0.5 rounded-md">
                          {t("disconnected")}
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
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("webhook_callback")}</span>
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
                              {t("disconnect_telegram")}
                            </Button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="space-y-4 p-4 bg-secondary/10 border border-border rounded-md">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground font-medium">{t("telegram_token_label")}</Label>
                          <Input
                            type="password"
                            placeholder={t("telegram_token_placeholder")}
                            value={telegramToken}
                            onChange={(e) => setTelegramToken(e.target.value)}
                            className="bg-background"
                          />
                          <p className="text-[10px] text-muted-foreground/60 leading-normal">
                            {t("telegram_token_hint")}
                          </p>
                        </div>
                        <Button
                          type="button"
                          disabled={isConnectingTelegram} onClick={handleConnectTelegram}
                          className="font-bold text-xs"
                        >
                          {isConnectingTelegram ? t("connecting_telegram") : t("connect_telegram_btn")}
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
                    <h2 className="text-lg font-bold text-foreground ">{t("whatsapp_title")}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t("whatsapp_desc")}</p>
                  </div>

                  <div className="max-w-2xl space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-md border border-border/60">
                      <span className="text-xs font-medium text-foreground/70">{t("connection_status")}</span>
                      {channels.some(c => c.type === 'whatsapp') ? (
                        <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase px-2.5 py-0.5 rounded-md">
                          {t("connected")}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-secondary border border-border/60 text-muted-foreground font-bold uppercase px-2.5 py-0.5 rounded-md">
                          {t("disconnected")}
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
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("webhook_url")}</span>
                              <div className="text-xs font-mono text-emerald-300 bg-secondary p-3 rounded-lg break-all shadow-inner">
                                {hookUrl}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("verify_token")}</span>
                              <div className="text-xs font-mono text-emerald-300 bg-secondary p-3 rounded-lg break-all shadow-inner">
                                {verifyToken}
                              </div>
                            </div>
                            <p className="text-[10px] leading-relaxed text-muted-foreground/60">
                              {t("whatsapp_hint")}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleDisconnectChannel(waChannel.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-destructive/10 text-xs h-9 px-4"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                              {t("disconnect_whatsapp")}
                            </Button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="space-y-4 p-4 bg-secondary/10 border border-border rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground font-medium">{t("phone_id_label")}</Label>
                            <Input
                              placeholder="e.g. 109283920283722"
                              value={whatsappPhoneId}
                              onChange={(e) => setWhatsappPhoneId(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground font-medium">{t("verify_token_label")}</Label>
                            <Input
                              placeholder="Specify any unique string"
                              value={whatsappVerifyToken}
                              onChange={(e) => setWhatsappVerifyToken(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground font-medium">{t("access_token_label")}</Label>
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
                          {isConnectingWhatsApp ? t("connecting_whatsapp") : t("connect_whatsapp_btn")}
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
                    <h2 className="text-lg font-bold text-foreground ">{t("appearance_title")}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t("appearance_desc")}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-5xl">
                    {/* Theme configuration form */}
                    <form onSubmit={handleProfileSubmit} className="lg:col-span-7 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-muted-foreground">{t("primary_color")}</Label>
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
                          <Label className="text-xs font-medium text-muted-foreground">{t("preset_colors")}</Label>
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
                        <Label className="text-xs font-medium text-muted-foreground">{t("greeting_msg")}</Label>
                        <Input 
                          value={formData.welcome_message}
                          onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
                          placeholder={t("greeting_placeholder")}
                          className="bg-background"
                        />
                      </div>

                      <div className="pt-4 border-t border-border/20">
                        <Button 
                          type="submit"
                          disabled={updateBotMutation.isPending}
                          className="font-bold text-xs gap-2"
                        >
                          {updateBotMutation.isPending ? t("saving_appearance") : t("save_appearance")}
                          <Save className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </form>

                    {/* Instant Mock Widget Preview */}
                    <div className="lg:col-span-5 space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-1">{t("live_mockup")}</span>
                      <div className="bg-background rounded-md border border-border overflow-hidden shadow-sm">
                        <div className="p-3 border-b border-border flex items-center gap-2" style={{ backgroundColor: `${formData.primary_color}18` }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-xs text-white" style={{ backgroundColor: formData.primary_color }}>
                            {formData.avatar_url ? (
                              <img src={formData.avatar_url} className="w-full h-full object-cover" alt="AI Agent" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[11px] font-bold text-foreground truncate">{formData.name || t("ai_assistant")}</h4>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[8px] text-muted-foreground uppercase tracking-tighter font-semibold">{t("ai_assistant")}</span>
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
                <div className="h-full flex flex-col flex-1 min-h-0 bg-background/30">
                  {/* Mock header */}
                  <div className="p-3.5 px-6 bg-card/60 border-b border-border/40 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs text-white" style={{ backgroundColor: formData.primary_color }}>
                        {formData.avatar_url ? (
                          <img src={formData.avatar_url} className="w-full h-full object-cover rounded-lg" alt="AI Agent" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground leading-none">{formData.name || t("ai_assistant")}</h4>
                        <span className="text-[9px] text-muted-foreground flex items-center gap-1 mt-1 font-medium tracking-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span>{t("ai_assistant")}</span>
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setMessages([{ role: "assistant", content: formData.welcome_message }]);
                        toast.success(t("chat_cleared"));
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground h-8 px-3 gap-1.5 font-medium hover:bg-secondary/60 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t("clear_chat")}
                    </Button>
                  </div>

                  {/* Message Stream */}
                  <ScrollArea className="flex-1 p-4 md:p-6 min-h-0 font-sans">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center gap-2">
                        <Sparkles className="w-8 h-8 text-primary/40 animate-pulse" />
                        <p className="text-xs text-muted-foreground">{t("init_chat")}</p>
                      </div>
                    ) : (
                      <div className="space-y-4 pb-2 max-w-4xl mx-auto">
                        {messages.map((message, index) => (
                          <div
                            key={`${message.role}-${index}`}
                            className={`flex gap-3 items-start ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {message.role === "assistant" && (
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs mt-0.5 text-white"
                                style={{ backgroundColor: formData.primary_color }}
                              >
                                {formData.avatar_url ? (
                                  <img src={formData.avatar_url} className="w-full h-full object-cover rounded-lg" alt="AI" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5" />
                                )}
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-xs border ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                  : "bg-card text-foreground border-border/70 shadow-xs"
                              }`}
                            >
                              {message.role === "assistant" && (
                                <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-border/40 text-[10px] font-semibold text-primary">
                                  <Sparkles className="w-3 h-3" />
                                  <span>{t("ai_response")}</span>
                                </div>
                              )}
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
                          <div className="flex gap-3 items-start justify-start">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs mt-0.5 text-white"
                              style={{ backgroundColor: formData.primary_color }}
                            >
                              {formData.avatar_url ? (
                                <img src={formData.avatar_url} className="w-full h-full object-cover rounded-lg" alt="AI" />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div className="rounded-lg px-3.5 py-2 bg-card border border-border/70 flex items-center gap-1.5 shadow-xs">
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
                  <form onSubmit={handleSendChatMessage} className="p-3.5 px-6 bg-card/60 border-t border-border/40 flex items-center shrink-0">
                    <div className="flex-1 max-w-4xl mx-auto flex items-center gap-3 w-full">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder={t("chat_placeholder")}
                        disabled={isTyping}
                        className="flex-1 bg-background border-border/60 h-10 rounded-lg text-xs"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!chatInput.trim() || isTyping}
                        className="h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
                      >
                        {isTyping ? (
                          <RefreshCcw className="w-4 h-4 animate-spin" />
                        ) : (
                          <SendIcon className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    );
}
