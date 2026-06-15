"use strict";
"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Code2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/shared/Sidebar";
import { getAxiosErrorMessage } from "@/lib/api/errors";

export default function BotSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const { data: bot, isLoading } = useQuery({
    queryKey: ["bot", id],
    queryFn: async () => {
      const resp = await api.get(`/bots/${id}`);
      return resp.data;
    },
  });

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

  // Knowledge State
  const [ingesting, setIngesting] = useState(false);
  const [ingestionError, setIngestionError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  // Channel State
  const { data: channelsData = [], refetch: refetchChannels } = useQuery<any[]>({
    queryKey: ["bot-channels", id],
    queryFn: async () => {
      const resp = await api.get(`/bots/${id}/channels`);
      return resp.data || [];
    },
  });
  const channels = channelsData || [];

  const [telegramToken, setTelegramToken] = useState("");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappVerifyToken, setWhatsappVerifyToken] = useState("");
  const [whatsappAccessToken, setWhatsappAccessToken] = useState("");
  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [isConnectingWhatsApp, setIsConnectingWhatsApp] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to connect Telegram");
    } finally {
      setIsConnectingTelegram(false);
    }
  };

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
      queryClient.invalidateQueries({ queryKey: ["usage"] });
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
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to disconnect channel");
    }
  };

  const handleIngestURL = async () => {
    if (!url) return;
    setIngesting(true);
    setIngestionError(null);
    try {
      await api.post("/ingest/url", { bot_id: id, source: url, content_rights_confirmed: rightsConfirmed });
      toast.success("Website import started!");
      setUrl("");
    } catch (error: unknown) {
      const errMsg = getAxiosErrorMessage(error, "Ingestion failed");
      setIngestionError(errMsg);
      toast.error(errMsg);
    } finally {
      setIngesting(false);
    }
  };

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
    } catch (error: unknown) {
      const errMsg = getAxiosErrorMessage(error, "Ingestion failed");
      setIngestionError(errMsg);
      toast.error(errMsg);
    } finally {
      setIngesting(false);
    }
  };

  const updateBotMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return api.patch(`/bots/${id}`, data);
    },
    onSuccess: () => {
      toast.success("Bot settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["bot", id] });
    },
    onError: () => {
      toast.error("Failed to update bot settings");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBotMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="space-y-8 max-w-6xl mx-auto pb-20">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-white/40 hover:text-white flex items-center gap-2 mb-4 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" />
              Settings
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight">
              Bot <span className="gradient-text">Settings</span>
            </h1>
            <p className="text-white/40 mt-3 text-lg max-w-2xl">
              Customize the widget styling, message tone, and data sources.
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <Link href={`/dashboard/integrate/${id}`}>
              <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 h-12 px-6 transition-all">
                <Code2 className="w-4 h-4 mr-2" />
                Integrations
              </Button>
            </Link>
            <Link href={`/widget-chat?botId=${id}`} target="_blank" rel="noreferrer">
              <Button className="rounded-2xl h-12 px-6 bg-white text-black hover:bg-white/90 font-bold">
                <Monitor className="w-4 h-4 mr-2" />
                Preview Widget
              </Button>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-dark border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-outfit text-white">Bot Profile</CardTitle>
                  <CardDescription className="text-white/40">Basic identity and description</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Bot Name</label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Support Bot"
                  className="bg-white/5 border-white/5 rounded-xl h-12 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Avatar Image URL</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input 
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                      placeholder="https://example.com/bot-avatar.png"
                      className="bg-white/5 border-white/5 rounded-xl h-12 focus:ring-primary/20"
                    />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-white/20" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Description (Internal)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What is this bot for?"
                  className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-white placeholder:text-white/20 h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Base Integration */}
          <Card className="glass-dark border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/20">
                  <Plus className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-outfit text-white">Knowledge Base</CardTitle>
                  <CardDescription className="text-white/40">Add sources for answers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {ingestionError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-200"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold">Ingestion issue detected</p>
                    <p className="opacity-80 leading-relaxed">{ingestionError}</p>
                  </div>
                </motion.div>
              )}

              <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightsConfirmed}
                  onChange={(event) => setRightsConfirmed(event.target.checked)}
                  className="mt-1 accent-primary"
                />
                <div className="text-xs text-white/50 leading-relaxed">
                  I confirm I have rights to use this website or PDF and understand crawlers should respect access rules.
                </div>
              </label>

              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 h-12 rounded-xl">
                  <TabsTrigger value="url" className="data-[state=active]:bg-white/10 rounded-lg">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </TabsTrigger>
                  <TabsTrigger value="file" className="data-[state=active]:bg-white/10 rounded-lg">
                    <Upload className="w-4 h-4 mr-2" />
                    PDF
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="url" className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/60">Target URL</Label>
                    <Input 
                      placeholder="https://docs.example.com" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-white/5 border-white/5 h-12 rounded-xl"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleIngestURL}
                    disabled={!url || ingesting || !rightsConfirmed}
                    className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-2xl font-bold"
                  >
                    {ingesting ? "Importing website..." : "Import from URL"}
                  </Button>
                </TabsContent>

                <TabsContent value="file" className="mt-6 space-y-4">
                  <div 
                    className={`border-2 border-dashed rounded-[1.5rem] p-8 flex flex-col items-center justify-center transition-all ${
                      pdfFile ? 'border-green-400/50 bg-green-400/5' : 'border-white/5 hover:border-white/10'
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
                        <FileText className="w-10 h-10 text-green-400 mb-2" />
                        <p className="text-sm font-medium">{pdfFile.name}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setPdfFile(null)}
                          className="mt-2 text-white/20 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-white/10 mb-2" />
                        <p className="text-sm text-white/40 text-center">Drag PDF here or click to upload</p>
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
                          className="mt-4 border-white/10 bg-white/5 rounded-xl"
                          onClick={() => document.getElementById('pdf-upload-settings')?.click()}
                        >
                          Select PDF
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleIngestPDF}
                    disabled={!pdfFile || ingesting || !rightsConfirmed}
                    className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-2xl font-bold"
                  >
                    {ingesting ? "Uploading PDF..." : "Upload PDF"}
                  </Button>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <p className="text-xs text-white/40 leading-relaxed">
                  We re-index these sources so answers stay up to date. This may take a few seconds.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Channel Deployments */}
          <Card className="glass-dark border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20">
                  <Monitor className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-outfit text-white">Multi-Channel Deployments</CardTitle>
                  <CardDescription className="text-white/40">Deploy your chatbot on Telegram and WhatsApp</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Telegram Section */}
              <div className="space-y-4 border-b border-white/5 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">Telegram Bot</h4>
                  </div>
                  {channels.some(c => c.type === 'telegram') ? (
                    <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold uppercase px-2 py-0.5 rounded-md">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/5 border border-white/10 text-white/40 font-bold uppercase px-2 py-0.5 rounded-md">
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
                      <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-white/40 uppercase">Webhook Endpoint URL</span>
                          <div className="text-xs font-mono text-white/70 bg-black/40 p-2.5 rounded-xl break-all">
                            {hookUrl}
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDisconnectChannel(tgChannel.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold rounded-xl text-xs h-9 px-4 mt-1"
                        >
                          Disconnect Telegram Bot
                        </Button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs">Telegram Bot Token</Label>
                      <Input
                        type="password"
                        placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        value={telegramToken}
                        onChange={(e) => setTelegramToken(e.target.value)}
                        className="bg-white/5 border-white/5 h-11 rounded-xl text-xs"
                      />
                      <p className="text-[10px] text-white/30">Get this token from @BotFather on Telegram.</p>
                    </div>
                    <Button
                      type="button"
                      disabled={isConnectingTelegram}
                      onClick={handleConnectTelegram}
                      className="bg-primary text-black hover:bg-primary/95 font-bold h-10 px-5 rounded-xl text-xs"
                    >
                      {isConnectingTelegram ? "Connecting..." : "Connect Telegram"}
                    </Button>
                  </div>
                )}
              </div>

              {/* WhatsApp Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider font-outfit">WhatsApp Cloud API</h4>
                  </div>
                  {channels.some(c => c.type === 'whatsapp') ? (
                    <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold uppercase px-2 py-0.5 rounded-md">
                      Connected
                    </span>
                  ) : (
                    <span className="text-[10px] bg-white/5 border border-white/10 text-white/40 font-bold uppercase px-2 py-0.5 rounded-md">
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
                      <div className="space-y-3.5 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-white/40 uppercase">Webhook Callback URL</span>
                          <div className="text-xs font-mono text-white/70 bg-black/40 p-2.5 rounded-xl break-all">
                            {hookUrl}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-white/40 uppercase">Verify Token</span>
                          <div className="text-xs font-mono text-white/70 bg-black/40 p-2.5 rounded-xl break-all">
                            {verifyToken}
                          </div>
                        </div>
                        <p className="text-[10px] leading-relaxed text-white/30">
                          Configure these parameters under the Webhooks settings in your Meta App Developer Dashboard to establish connection.
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleDisconnectChannel(waChannel.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold rounded-xl text-xs h-9 px-4"
                        >
                          Disconnect WhatsApp
                        </Button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs">Phone Number ID</Label>
                        <Input
                          placeholder="e.g. 109283920283722"
                          value={whatsappPhoneId}
                          onChange={(e) => setWhatsappPhoneId(e.target.value)}
                          className="bg-white/5 border-white/5 h-11 rounded-xl text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/60 text-xs">Webhook Verify Token</Label>
                        <Input
                          placeholder="Choose any random string (e.g. my-verify-token)"
                          value={whatsappVerifyToken}
                          onChange={(e) => setWhatsappVerifyToken(e.target.value)}
                          className="bg-white/5 border-white/5 h-11 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white/60 text-xs">System User Access Token</Label>
                      <Input
                        type="password"
                        placeholder="EAABw..."
                        value={whatsappAccessToken}
                        onChange={(e) => setWhatsappAccessToken(e.target.value)}
                        className="bg-white/5 border-white/5 h-11 rounded-xl text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      disabled={isConnectingWhatsApp}
                      onClick={handleConnectWhatsApp}
                      className="bg-primary text-black hover:bg-primary/95 font-bold h-10 px-5 rounded-xl text-xs"
                    >
                      {isConnectingWhatsApp ? "Connecting..." : "Connect WhatsApp"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-dark border-white/5 rounded-[2rem] overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-outfit text-white">UI Customization</CardTitle>
                  <CardDescription className="text-white/40">Visual theme and behavior</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Primary Brand Color</label>
                  <div className="flex gap-3">
                    <Input 
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                      className="w-12 h-12 p-1 bg-white/5 border-white/5 rounded-xl"
                    />
                    <Input 
                      value={formData.primary_color}
                      onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                      className="flex-1 bg-white/5 border-white/5 rounded-xl h-12 focus:ring-primary/20 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Quick Presets</label>
                  <div className="flex gap-2">
                    {['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({...formData, primary_color: color})}
                        className={`w-10 h-10 rounded-xl border-2 transition-all ${
                          formData.primary_color === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Welcome Message</label>
                <Input 
                  value={formData.welcome_message}
                  onChange={(e) => setFormData({...formData, welcome_message: e.target.value})}
                  placeholder="e.g. Hello! How can I assist you?"
                  className="bg-white/5 border-white/5 rounded-xl h-12 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>
          
        </div>

        <div className="space-y-6">
          <Card className="glass-dark border-white/5 rounded-[2rem] overflow-hidden sticky top-8">
            <CardHeader>
                <CardTitle className="text-xl font-outfit text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Live Preview
                </CardTitle>
                <CardDescription className="text-white/40">How it looks on your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Mock Widget UI */}
                <div className="bg-[#09090b] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-3 border-b border-white/5 flex items-center gap-2" style={{ backgroundColor: `${formData.primary_color}1a` }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: formData.primary_color }}>
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} className="w-full h-full object-cover" alt="bot" />
                            ) : (
                                <Bot className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-[11px] font-bold text-white truncate">{formData.name || "Support Bot"}</h4>
                            <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] text-white/40 uppercase tracking-tighter">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 space-y-3 h-48">
                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                            <p className="text-[10px] text-white/80 leading-relaxed">
                                {formData.welcome_message}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button 
                        type="submit"
                        disabled={updateBotMutation.isPending}
                        className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-2xl transition-all"
                    >
                        {updateBotMutation.isPending ? "Saving Changes..." : "Save Changes"}
                        {!updateBotMutation.isPending && <Save className="w-4 h-4 ml-2" />}
                    </Button>
                    <p className="text-[10px] text-center text-white/20">
                        Changes apply instantly to all live widgets.
                    </p>
                </div>
            </CardContent>
          </Card>
        </div>
        </form>
      </div>
    </Sidebar>
  );
}
