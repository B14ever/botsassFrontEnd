"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe,
  Languages,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { getAxiosErrorMessage, getAxiosErrorPayload, isLimitReachedError, type LimitReachedError } from "@/lib/api/errors";
import { toast } from "sonner";

type KnowledgeResponse = {
  ready: boolean;
  chunk_count: number;
  source_count: number;
  sources: Array<{
    source: string;
    type: string;
    chunk_count: number;
  }>;
};

export default function CreateBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "am">("en");
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [ingestionError, setIngestionError] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<LimitReachedError | null>(null);
  const [knowledge, setKnowledge] = useState<KnowledgeResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!botId || !isPolling) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const poll = async () => {
      try {
        const response = await api.get<KnowledgeResponse>(`/bots/${botId}/knowledge`);
        if (cancelled) {
          return;
        }

        setKnowledge(response.data);
        if (response.data.ready) {
          toast.success("Ready to chat");
          router.push(`/dashboard/chat/${botId}`);
          return;
        }

        timeoutId = setTimeout(poll, 1500);
      } catch {
        timeoutId = setTimeout(poll, 2000);
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [botId, isPolling, router]);

  const handleCreateBot = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Bot name is required");
      return;
    }

    setLoading(true);
    setLimitError(null);

    try {
      const response = await api.post<{ id: string }>("/bots/", {
        name: name.trim(),
        description: description.trim(),
        preferred_language: preferredLanguage,
      });
      setBotId(response.data.id);
      toast.success("Bot created. Add one source to make it useful.");
    } catch (error: unknown) {
      const payload = getAxiosErrorPayload(error);
      if (isLimitReachedError(payload)) {
        setLimitError(payload);
      }
      toast.error(getAxiosErrorMessage(error, "Failed to create bot"));
    } finally {
      setLoading(false);
    }
  };

  const handleIngestUrl = async () => {
    if (!botId || !url.trim()) {
      return;
    }

    setLoading(true);
    setIngestionError(null);
    setLimitError(null);

    try {
      await api.post("/ingest/url", {
        bot_id: botId,
        source: url.trim(),
        type: "website",
        content_rights_confirmed: rightsConfirmed,
      });
      setIsPolling(true);
      toast.success("Website connected. Finishing indexing now.");
    } catch (error: unknown) {
      const payload = getAxiosErrorPayload(error);
      if (isLimitReachedError(payload)) {
        setLimitError(payload);
      }
      const message = getAxiosErrorMessage(error, "Website ingestion failed");
      setIngestionError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestPdf = async () => {
    if (!botId || !pdfFile) {
      return;
    }

    setLoading(true);
    setIngestionError(null);
    setLimitError(null);

    const formData = new FormData();
    formData.append("bot_id", botId);
    formData.append("file", pdfFile);
    formData.append("content_rights_confirmed", String(rightsConfirmed));

    try {
      await api.post("/ingest/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsPolling(true);
      toast.success("PDF uploaded. Your bot is indexing it now.");
    } catch (error: unknown) {
      const payload = getAxiosErrorPayload(error);
      if (isLimitReachedError(payload)) {
        setLimitError(payload);
      }
      const message = getAxiosErrorMessage(error, "PDF ingestion failed");
      setIngestionError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" />
              Fast Onboarding
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent font-outfit tracking-tight">
              Create your first bot
            </h1>
            <p className="text-white/40 font-medium tracking-wide max-w-2xl text-sm md:text-base">
              Make the bot, confirm your content rights, connect a website or PDF, and we&apos;ll move you straight into chat once knowledge is ready.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white/40 hover:text-white hover:bg-white/5 font-bold rounded-2xl h-12 px-6 border border-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
          <div className="space-y-4">
            <StepItem active={!botId} completed={Boolean(botId)} title="Create bot" description="Name it and set English or Amharic as the preferred language." />
            <StepItem active={Boolean(botId) && !isPolling} completed={Boolean(knowledge?.ready)} title="Connect knowledge" description="Add one website or PDF and confirm you have rights to use it." />
            <StepItem active={isPolling} completed={Boolean(knowledge?.ready)} title="Ready to chat" description="We check indexing progress and move you to live chat when the bot is ready." />
          </div>

          <AnimatePresence mode="wait">
            {!botId ? (
              <motion.div key="create" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-dark border-white/10 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="pb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-black font-outfit text-white">Bot profile</CardTitle>
                    <CardDescription className="text-white/40 font-medium">
                      Keep it simple now. You can fine-tune visuals and voice later.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateBot} className="space-y-6">
                      <Field label="Bot name">
                        <Input
                          placeholder="Acme Support Bot"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="h-14 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 rounded-2xl px-6"
                        />
                      </Field>

                      <Field label="Description">
                        <Input
                          placeholder="Answers onboarding, billing, and product questions."
                          value={description}
                          onChange={(event) => setDescription(event.target.value)}
                          className="h-14 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 rounded-2xl px-6"
                        />
                      </Field>

                      <Field label="Preferred language">
                        <div className="grid grid-cols-2 gap-3">
                          <LanguageButton active={preferredLanguage === "en"} onClick={() => setPreferredLanguage("en")} label="English" />
                          <LanguageButton active={preferredLanguage === "am"} onClick={() => setPreferredLanguage("am")} label="Amharic" />
                        </div>
                      </Field>

                      {limitError && <LimitCard limitError={limitError} onUpgrade={() => router.push("/dashboard/billing")} />}

                      <Button type="submit" disabled={loading} className="w-full bg-primary text-white hover:bg-primary/90 h-12 rounded-2xl font-bold text-base">
                        {loading ? "Creating..." : (
                          <span className="flex items-center gap-2">
                            Create bot
                            <ChevronRight className="w-6 h-6" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : isPolling ? (
              <motion.div key="polling" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-dark border-white/10 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="pb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      {knowledge?.ready ? <CheckCircle2 className="w-7 h-7 text-emerald-400" /> : <Zap className="w-7 h-7 text-emerald-400 animate-pulse" />}
                    </div>
                    <CardTitle className="text-xl font-black font-outfit text-white">
                      {knowledge?.ready ? "Ready to chat" : "Indexing your source"}
                    </CardTitle>
                    <CardDescription className="text-white/40 font-medium">
                      {knowledge?.ready
                        ? "Everything is connected. Opening your chat workspace now."
                        : "We are turning your source into searchable knowledge for grounded answers."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Metric label="Sources" value={knowledge?.source_count ?? 0} />
                      <Metric label="Chunks" value={knowledge?.chunk_count ?? 0} />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
                      {(knowledge?.sources ?? []).length > 0 ? (
                        knowledge?.sources.map((source) => (
                          <div key={source.source} className="flex items-center justify-between gap-3 text-sm text-white/70">
                            <div className="min-w-0">
                              <div className="font-semibold truncate">{source.source}</div>
                              <div className="text-white/30 uppercase tracking-[0.2em] text-[10px]">{source.type}</div>
                            </div>
                            <div className="text-white/40">{source.chunk_count} chunks</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-white/40">Waiting for the first indexed chunks to appear...</div>
                      )}
                    </div>

                    <Button onClick={() => router.push(`/dashboard/chat/${botId}`)} className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-2xl font-bold">
                      Open chat now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="ingest" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-dark border-white/10 rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="pb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      <ShieldCheck className="w-7 h-7 text-emerald-400" />
                    </div>
                    <CardTitle className="text-xl font-black font-outfit text-white">Connect a source</CardTitle>
                    <CardDescription className="text-white/40 font-medium">
                      Start with one website or one PDF. We respect usage limits and require explicit content rights confirmation before ingesting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <label className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rightsConfirmed}
                        onChange={(event) => setRightsConfirmed(event.target.checked)}
                        className="mt-1 accent-primary"
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-white">I confirm I have the rights to use this website or PDF.</div>
                        <div className="text-sm text-white/40">
                          Website crawling respects site access rules. You can delete sources later and derived knowledge will be removed.
                        </div>
                      </div>
                    </label>

                    {ingestionError ? (
                      <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-3xl flex gap-3 text-red-200">
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                        <div>{ingestionError}</div>
                      </div>
                    ) : null}

                    {limitError && <LimitCard limitError={limitError} onUpgrade={() => router.push("/dashboard/billing")} />}

                    <Tabs defaultValue="url" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/[0.03] border border-white/5 h-14 rounded-2xl p-1.5">
                        <TabsTrigger value="url" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold">
                          <Globe className="w-4 h-4 mr-2" />
                          Website
                        </TabsTrigger>
                        <TabsTrigger value="file" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold">
                          <Upload className="w-4 h-4 mr-2" />
                          PDF
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="url" className="space-y-5 pt-5">
                        <Field label="Website URL">
                          <Input
                            placeholder="https://docs.yourcompany.com"
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                            className="h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl px-6"
                          />
                        </Field>
                        <Button onClick={handleIngestUrl} disabled={!rightsConfirmed || !url.trim() || loading} className="w-full h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold">
                          {loading ? "Indexing website..." : "Connect website"}
                        </Button>
                      </TabsContent>

                      <TabsContent value="file" className="space-y-5 pt-5">
                        <button
                          type="button"
                          className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${
                            pdfFile ? "border-primary bg-primary/5" : "border-white/10 bg-white/[0.02]"
                          }`}
                          onClick={() => document.getElementById("pdf-upload")?.click()}
                        >
                          {pdfFile ? (
                            <>
                              <FileText className="w-12 h-12 text-primary mb-4" />
                              <div className="text-white font-bold">{pdfFile.name}</div>
                              <div className="text-white/30 text-sm mt-1">Ready to upload</div>
                            </>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 text-white/30 mb-4" />
                              <div className="text-white font-bold">Choose a PDF</div>
                              <div className="text-white/30 text-sm mt-1">Drop it here or browse your files</div>
                            </>
                          )}
                          <input
                            id="pdf-upload"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                          />
                        </button>
                        <Button onClick={handleIngestPdf} disabled={!rightsConfirmed || !pdfFile || loading} className="w-full h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold">
                          {loading ? "Uploading PDF..." : "Upload PDF"}
                        </Button>
                      </TabsContent>
                    </Tabs>

                    <div className="rounded-3xl bg-primary/5 border border-primary/10 p-5 flex gap-4 items-start">
                      <Languages className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-white/50 leading-relaxed">
                        Preferred language is set to <span className="text-white font-semibold">{preferredLanguage === "am" ? "Amharic" : "English"}</span>. You can update it later from bot settings too.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Sidebar>
  );
}

function StepItem({ active, completed, title, description }: { active: boolean; completed: boolean; title: string; description: string }) {
  return (
    <div className={`rounded-[2rem] border p-5 transition-all ${active ? "bg-white/5 border-white/20" : completed ? "bg-emerald-500/5 border-emerald-500/20" : "border-white/5 bg-transparent opacity-60"}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black ${completed ? "bg-emerald-500 text-white" : active ? "bg-primary text-white" : "bg-white/5 text-white/30"}`}>
          {completed ? <CheckCircle2 className="w-5 h-5" /> : title.charAt(0)}
        </div>
        <div className="space-y-1">
          <div className="text-white font-black">{title}</div>
          <div className="text-sm text-white/30 leading-relaxed">{description}</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <Label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">{label}</Label>
      {children}
    </div>
  );
}

function LanguageButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-14 rounded-2xl border font-bold transition-all ${active ? "border-primary bg-primary/10 text-white" : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white"}`}
    >
      {label}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">{label}</div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function LimitCard({ limitError, onUpgrade }: { limitError: LimitReachedError; onUpgrade: () => void }) {
  return (
    <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white">Current plan limit reached</div>
          <div className="text-sm text-white/50">
            {limitError.limit.replaceAll("_", " ")} resets on {new Date(limitError.period_end).toLocaleDateString()}.
          </div>
        </div>
      </div>
      <Button onClick={onUpgrade} className="bg-white text-black hover:bg-white/90 rounded-2xl font-bold">
        Upgrade plan
      </Button>
    </div>
  );
}
