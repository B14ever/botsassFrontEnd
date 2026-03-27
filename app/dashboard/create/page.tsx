"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Upload,
  Globe,
  Plus,
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
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
import Sidebar from "@/components/shared/Sidebar";

export default function CreateBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [ingestionError, setIngestionError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleCreateBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return toast.error("Bot name is required");

    setLoading(true);
    try {
      const resp = await api.post("/bots/", { name, description });
      setBotId(resp.data.id);
      toast.success("Bot created. Add sources to get started.");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create bot");
    } finally {
      setLoading(false);
    }
  };

  const handleIngestURL = async () => {
    if (!url || !botId) return;
    setLoading(true);
    setIngestionError(null);
    try {
      await api.post("/ingest/url", { bot_id: botId, source: url });
      toast.success("Website import started.");
      router.push("/dashboard");
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Ingestion failed";
      setIngestionError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleIngestPDF = async () => {
    if (!pdfFile || !botId) return;
    setLoading(true);
    setIngestionError(null);
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("bot_id", botId);

    try {
      await api.post("/ingest/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("PDF import started.");
      router.push("/dashboard");
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Ingestion failed";
      setIngestionError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" />
              Create a Bot
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent font-outfit tracking-tighter">
              Create support bot
            </h1>
            <p className="text-white/40 font-medium tracking-wide max-w-lg">
              Set up a bot trained on your docs and help center.
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-4">
            <StepItem
              active={!botId}
              completed={!!botId}
              number={1}
              title="Profile"
              desc="Name and describe your bot."
            />
            <div className="flex justify-center py-2">
              <div className="w-[2px] h-8 bg-gradient-to-b from-primary to-transparent opacity-20" />
            </div>
            <StepItem
              active={!!botId}
              completed={false}
              number={2}
              title="Sources"
              desc="Add a website or a PDF."
            />
          </div>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!botId ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <Card className="glass-dark border-white/10 rounded-[2.5rem] overflow-hidden card-hover transition-all">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <CardHeader className="pb-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                        <Bot className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-3xl font-black font-outfit text-white">Bot profile</CardTitle>
                      <CardDescription className="text-white/40 font-medium">
                        These details appear in the widget and dashboard.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateBot} className="space-y-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Bot name</Label>
                          <Input
                            placeholder="Acme Support Bot"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-14 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-primary/20 transition-all font-medium text-lg px-6"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Description (optional)</Label>
                          <Input
                            placeholder="Handles billing and setup questions."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-14 bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-primary/20 transition-all font-medium text-lg px-6"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-primary text-white hover:bg-primary/90 h-16 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 group"
                        >
                          {loading ? "Creating..." : (
                            <span className="flex items-center gap-2">
                              Create bot
                              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <Card className="glass-dark border-white/10 rounded-[2.5rem] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                    <CardHeader className="pb-8">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                        <Plus className="w-7 h-7 text-emerald-400" />
                      </div>
                      <CardTitle className="text-3xl font-black font-outfit text-white">Add sources</CardTitle>
                      <CardDescription className="text-white/40 font-medium">
                        Add a website or PDF so your bot can answer accurately.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {ingestionError && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl flex gap-4 text-red-200"
                        >
                          <AlertCircle className="w-6 h-6 shrink-0 text-red-500" />
                          <div className="space-y-1">
                            <p className="font-black text-xs uppercase tracking-widest text-red-400">Upload failed</p>
                            <p className="opacity-80 leading-relaxed font-semibold">{ingestionError}</p>
                          </div>
                        </motion.div>
                      )}

                      <Tabs defaultValue="url" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-white/[0.03] border border-white/5 h-14 rounded-2xl p-1.5 mb-8">
                          <TabsTrigger value="url" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </TabsTrigger>
                          <TabsTrigger value="file" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all">
                            <Upload className="w-4 h-4 mr-2" />
                            PDF
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">Website URL</Label>
                            <Input
                              placeholder="https://docs.yourcompany.com"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              className="h-14 bg-white/[0.03] border-white/10 text-white rounded-2xl px-6 font-medium"
                            />
                          </div>
                          <Button
                            onClick={handleIngestURL}
                            disabled={!url || loading}
                            className="w-full bg-white text-black hover:bg-white/90 h-16 rounded-2xl font-black text-xl shadow-2xl transition-all"
                          >
                            {loading ? "Importing..." : "Import website"}
                          </Button>
                        </TabsContent>

                        <TabsContent value="file" className="space-y-6">
                          <div
                            className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer group ${
                              pdfFile ? "border-primary bg-primary/5 hover:bg-primary/10" : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                            }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const file = e.dataTransfer.files[0];
                              if (file?.type === "application/pdf") setPdfFile(file);
                              else toast.error("Please upload a PDF file");
                            }}
                            onClick={() => document.getElementById("pdf-upload")?.click()}
                          >
                            {pdfFile ? (
                              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                                <FileText className="w-16 h-16 text-primary mb-4 mx-auto" />
                                <p className="text-white text-lg font-black">{pdfFile.name}</p>
                                <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-black">Ready to upload</p>
                              </motion.div>
                            ) : (
                              <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500">
                                  <Upload className="w-10 h-10 text-white/20" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-white font-bold text-xl">Upload a PDF</p>
                                  <p className="text-white/20 text-sm font-medium">Drag and drop or click to browse</p>
                                </div>
                              </div>
                            )}
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              id="pdf-upload"
                              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                            />
                          </div>
                          <Button
                            onClick={handleIngestPDF}
                            disabled={!pdfFile || loading}
                            className="w-full bg-white text-black hover:bg-white/90 h-16 rounded-2xl font-black text-xl transition-all"
                          >
                            {loading ? "Uploading..." : "Upload PDF"}
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <div className="p-6 bg-primary/5 border border-primary/10 rounded-[2.5rem] flex gap-4 items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-white/40 font-medium leading-relaxed">
                      We split your content into searchable sections so answers stay fast and accurate.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function StepItem({
  number,
  title,
  desc,
  active,
  completed
}: {
  number: number;
  title: string;
  desc: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className={`p-6 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group ${
      active ? "bg-white/5 border-white/20 shadow-2xl shadow-primary/5" :
      completed ? "bg-emerald-500/5 border-emerald-500/10" : "bg-transparent border-white/5 opacity-40"
    }`}>
      {active && (
        <motion.div
          layoutId="step-gradient"
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
        />
      )}
      <div className="flex items-start gap-5 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${
          completed ? "bg-emerald-500 text-white" :
          active ? "bg-primary text-white shadow-lg shadow-primary/40 scale-110" : "bg-white/5 text-white/20"
        }`}>
          {completed ? <ShieldCheck className="w-6 h-6" /> : number}
        </div>
        <div className="space-y-1">
          <h3 className={`text-lg font-black font-outfit leading-none ${active || completed ? "text-white" : "text-white/40"}`}>
            {title}
          </h3>
          <p className="text-sm font-medium text-white/30 leading-tight pr-4">{desc}</p>
        </div>
      </div>
    </div>
  );
}
