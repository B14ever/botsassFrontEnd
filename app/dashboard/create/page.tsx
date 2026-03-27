"use strict";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Bot, 
  Upload, 
  Globe, 
  Plus, 
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertCircle
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

export default function CreateBotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);
  
  // Bot Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Ingestion State
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
      toast.success("Bot created! Now add some knowledge.");
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
      toast.success("Learning from website started!");
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
      toast.success("Learning from PDF started!");
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
    <div className="min-h-screen bg-[#030303] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Create Knowledge Bot
            </h1>
            <p className="text-white/40">Build an AI that knows your specific data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step Indicators */}
          <div className="space-y-4">
            <StepItem 
              active={!botId} 
              completed={!!botId} 
              number={1} 
              title="Identity" 
              desc="Name and description" 
            />
            <StepItem 
              active={!!botId} 
              completed={false} 
              number={2} 
              title="Knowledge" 
              desc="URLs, Documents, or Files" 
            />
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {!botId ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white">Bot Identity</CardTitle>
                    <CardDescription className="text-white/40">
                      Give your bot a name and explain what it should help with.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateBot} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white/60">Bot Name</Label>
                        <Input 
                          placeholder="e.g. Acme Support Hero" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white/60">Description (Optional)</Label>
                        <Input 
                          placeholder="Internal bot for product documentation" 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-white/90 font-semibold"
                      >
                        {loading ? "Creating..." : "Create Bot Identity"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-green-400" />
                      Add Knowledge
                    </CardTitle>
                    <CardDescription className="text-white/40">
                      Choose how you want your bot to learn.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ingestionError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 text-red-200"
                      >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-red-400">Ingestion issue detected</p>
                          <p className="opacity-80 leading-relaxed font-medium">{ingestionError}</p>
                        </div>
                      </motion.div>
                    )}
                    <Tabs defaultValue="url" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
                        <TabsTrigger value="url" className="data-[state=active]:bg-white/10">
                          <Globe className="w-4 h-4 mr-2" />
                          Website URL
                        </TabsTrigger>
                        <TabsTrigger value="file" className="data-[state=active]:bg-white/10">
                          <Upload className="w-4 h-4 mr-2" />
                          PDF Document
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="url" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-white/60">Website URL</Label>
                          <Input 
                            placeholder="https://docs.example.com" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <Button 
                          onClick={handleIngestURL}
                          disabled={!url || loading}
                          className="w-full bg-white text-black hover:bg-white/90"
                        >
                          {loading ? "Processing..." : "Start Learning"}
                        </Button>
                      </TabsContent>

                      <TabsContent value="file" className="mt-4 space-y-4">
                        <div 
                          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
                            pdfFile ? 'border-green-400/50 bg-green-400/5' : 'border-white/10 hover:border-white/20'
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
                              <FileText className="w-12 h-12 text-green-400 mb-2" />
                              <p className="text-white font-medium">{pdfFile.name}</p>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setPdfFile(null)}
                                className="mt-2 text-white/40 hover:text-white"
                              >
                                Change file
                              </Button>
                            </>
                          ) : (
                            <>
                              <Upload className="w-12 h-12 text-white/20 mb-2" />
                              <p className="text-white/60">Drag and drop your PDF</p>
                              <p className="text-white/20 text-sm mt-1">Maximum 10MB</p>
                              <input 
                                type="file" 
                                accept=".pdf" 
                                className="hidden" 
                                id="pdf-upload"
                                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                              />
                              <Button 
                                variant="outline" 
                                className="mt-4 bg-transparent border-white/10 text-white"
                                onClick={() => document.getElementById('pdf-upload')?.click()}
                              >
                                Choose File
                              </Button>
                            </>
                          )}
                        </div>
                        <Button 
                          onClick={handleIngestPDF}
                          disabled={!pdfFile || loading}
                          className="w-full bg-white text-black hover:bg-white/90"
                        >
                          {loading ? "Uploading..." : "Upload & Learn"}
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                  <p className="text-sm text-blue-200/80">
                    Ingestion might take a few minutes depending on the size of the content. 
                    You can start chatting with your bot once processing is complete.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
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
    <div className={`p-4 rounded-xl border transition-all ${
      active ? 'bg-white/10 border-white/20 ring-1 ring-white/20' : 
      completed ? 'bg-green-500/5 border-green-500/20' : 'bg-transparent border-white/5'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          completed ? 'bg-green-500 text-white' : 
          active ? 'bg-white text-black' : 'bg-white/10 text-white/40'
        }`}>
          {completed ? <CheckCircle2 className="w-5 h-5" /> : number}
        </div>
        <div>
          <h3 className={`font-semibold ${active || completed ? 'text-white' : 'text-white/40'}`}>
            {title}
          </h3>
          <p className="text-xs text-white/20">{desc}</p>
        </div>
      </div>
    </div>
  );
}
