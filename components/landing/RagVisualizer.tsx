"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  FileSpreadsheet,
  Globe,
  Database,
  Cpu,
  Send,
  MessageSquare,
  Layers,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  Terminal,
  Zap,
} from "lucide-react";

type ChannelType = "telegram" | "whatsapp" | "web";
type DocType = "pdf" | "pptx" | "excel" | "web";

interface DocumentItem {
  id: DocType;
  name: string;
  size: string;
  chunks: number;
  icon: any;
  type: string;
}

const SAMPLE_DOCS: DocumentItem[] = [
  {
    id: "pdf",
    name: "Enterprise_SLA_2026.pdf",
    size: "4.2 MB",
    chunks: 142,
    icon: FileText,
    type: "PDF Document",
  },
  {
    id: "pptx",
    name: "Product_Architecture.pptx",
    size: "12.8 MB",
    chunks: 86,
    icon: Layers,
    type: "Slide Deck",
  },
  {
    id: "excel",
    name: "Pricing_Matrix_Tiers.xlsx",
    size: "1.1 MB",
    chunks: 64,
    icon: FileSpreadsheet,
    type: "Spreadsheet",
  },
  {
    id: "web",
    name: "https://docs.redai.io/api",
    size: "Live Crawl",
    chunks: 210,
    icon: Globe,
    type: "Web Scrape",
  },
];

const CHAT_SIMULATIONS: Record<
  ChannelType,
  {
    title: string;
    sender: string;
    avatarBg: string;
    incomingMsg: string;
    sourceUsed: string;
    similarity: string;
    latency: string;
    responseMsg: string;
  }
> = {
  telegram: {
    title: "Telegram Bot Adapter",
    sender: "@Alex_EnterpriseDev",
    avatarBg: "from-sky-500 to-blue-600",
    incomingMsg: "Does RedAI support multi-tenant pgvector row-level isolation for HIPAA compliant data?",
    sourceUsed: "Enterprise_SLA_2026.pdf (Chunk #88)",
    similarity: "0.984 Cosine Match",
    latency: "142ms",
    responseMsg:
      "Yes. RedAI enforces strict tenant-level row isolation via PostgreSQL schemas + pgvector metadata filters. All embeddings are encrypted with workspace-scoped KMS keys.",
  },
  whatsapp: {
    title: "WhatsApp Business API",
    sender: "+1 (415) 890-4221",
    avatarBg: "from-emerald-500 to-green-600",
    incomingMsg: "What is the token limit and webhook retry strategy for the Pro tier?",
    sourceUsed: "Pricing_Matrix_Tiers.xlsx (Chunk #12)",
    similarity: "0.971 Cosine Match",
    latency: "165ms",
    responseMsg:
      "The Pro Tier includes 10M tokens/mo with exponential backoff webhook retries (up to 5 attempts across 24h) and automated OpenRouter model failover.",
  },
  web: {
    title: "Embeddable Web SDK",
    sender: "Visitor #8410 (Web)",
    avatarBg: "from-[#ff1a40] to-[#b30022]",
    incomingMsg: "How do I embed the RedAI chat widget in a Next.js App Router project?",
    sourceUsed: "https://docs.redai.io/api (Live Index)",
    similarity: "0.992 Cosine Match",
    latency: "118ms",
    responseMsg:
      "Add `<script src='https://cdn.redai.io/widget.js' data-agent-id='agt_99x' defer></script>` or import `@redai/react-widget` for full React state bindings.",
  },
};

export default function RagVisualizer() {
  const [selectedDoc, setSelectedDoc] = useState<DocType>("pdf");
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>("telegram");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamStep, setStreamStep] = useState(3);

  const activeDoc = SAMPLE_DOCS.find((d) => d.id === selectedDoc) || SAMPLE_DOCS[0];
  const chatData = CHAT_SIMULATIONS[selectedChannel];

  // Auto-cycle through channels or trigger simulated pulse
  const triggerSimulate = (docId: DocType) => {
    setSelectedDoc(docId);
    setIsProcessing(true);
    setStreamStep(1);

    setTimeout(() => setStreamStep(2), 350);
    setTimeout(() => setStreamStep(3), 700);
    setTimeout(() => setIsProcessing(false), 900);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0c0e14]/90 border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden relative">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#11141d]/70 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff1a40]/30 border border-[#ff1a40] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a40] animate-ping" />
            </span>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Live RAG Ingestion & Multi-Tenant Routing Engine
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            pgvector v0.8.0 : ACTIVE
          </span>
        </div>

        {/* Telemetry pill */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#ff1a40]" />
            <span>TTFT: <strong className="text-slate-200">{chatData.latency}</strong></span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Dim: <strong className="text-slate-200">1536</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Data Ingestion Hub (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#ff1a40]" />
                1. Multi-Source Ingestion
              </span>
              <span className="text-[10px] text-slate-500 font-mono">tiktoken 512-tk</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select a raw enterprise document to observe realtime semantic chunking and embedding.
            </p>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_DOCS.map((doc) => {
              const isSelected = selectedDoc === doc.id;
              const Icon = doc.icon;
              return (
                <button
                  key={doc.id}
                  onClick={() => triggerSimulate(doc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? "bg-[#ff1a40]/10 border-[#ff1a40]/50 shadow-[0_0_20px_rgba(255,26,64,0.15)]"
                      : "bg-[#141722]/60 border-white/[0.06] hover:bg-[#181c2b] hover:border-white/[0.15]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-[#ff1a40]/20 border-[#ff1a40] text-[#ff1a40]"
                          : "bg-white/[0.04] border-white/[0.08] text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-[180px]">
                        {doc.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{doc.type}</span>
                        <span>*</span>
                        <span className="text-slate-500">{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-[#ff1a40]/20 text-[#ff3355]"
                          : "bg-white/[0.04] text-slate-400"
                      }`}
                    >
                      {doc.chunks} Chunks
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Realtime Ingestion Status */}
          <div className="p-3.5 rounded-xl bg-[#090b0f] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                pgvector Isolated Tenant
              </span>
              <span className="text-emerald-400 font-mono text-[10px]">Synced</span>
            </div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#ff1a40] to-emerald-400 h-full rounded-full"
                animate={{ width: isProcessing ? "100%" : "88%" }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Center Column: OpenRouter + RAG Engine Matrix (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-4 border-y lg:border-y-0 lg:border-x border-white/[0.08] lg:px-5 py-4 lg:py-0">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#ff1a40]" />
              2. RAG Orchestration
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hybrid dense vector retrieval paired with multi-model inference.
            </p>
          </div>

          {/* Pipeline flow nodes */}
          <div className="space-y-3 relative">
            <div className="p-3 rounded-xl bg-[#141824] border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">Embedding Node</span>
                <span className="text-[10px] font-bold text-[#ff1a40]">text-embed-3</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">1536-dim vector tensor</p>
              {streamStep >= 1 && (
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-[#ff1a40] shadow-[0_0_10px_#ff1a40]" />
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#141824] border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">pgvector Match</span>
                <span className="text-[10px] font-bold text-emerald-400">{chatData.similarity}</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">Cosine distance ≤ 0.02</p>
              {streamStep >= 2 && (
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_10px_#10b981]" />
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#141824] border border-white/[0.08] relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase text-slate-400">LLM Inference</span>
                <span className="text-[10px] font-bold text-purple-400">OpenRouter</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">Claude 3.5 / GPT-4o / DeepSeek</p>
              {streamStep >= 3 && (
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-purple-400 shadow-[0_0_10px_#a855f7]" />
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#090b0f] border border-white/[0.06] flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Fiber v2 Go Router</span>
            <span className="text-[10px] font-bold text-[#ff1a40] flex items-center gap-1">
              <Zap className="w-3 h-3" />
              1.2M req/sec
            </span>
          </div>
        </div>

        {/* Right Column: Live Omnichannel Chat Output (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-[#ff1a40]" />
              3. Omnichannel Dispatch
            </span>

            {/* Channel Toggles */}
            <div className="flex items-center bg-[#090b0f] p-0.5 rounded-lg border border-white/[0.08]">
              {(["telegram", "whatsapp", "web"] as ChannelType[]).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${
                    selectedChannel === ch
                      ? "bg-[#ff1a40] text-white shadow-[0_0_10px_rgba(255,26,64,0.4)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Chat Mockup Window */}
          <div className="rounded-xl bg-[#080a0e] border border-white/[0.08] p-4 space-y-3.5 flex-1 flex flex-col justify-between shadow-inner">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr ${chatData.avatarBg} flex items-center justify-center text-white text-[11px] font-bold shadow-sm`}
                >
                  {selectedChannel === "telegram" ? "TG" : selectedChannel === "whatsapp" ? "WA" : "WB"}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">{chatData.title}</div>
                  <div className="text-[10px] text-slate-400">{chatData.sender}</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* User Question */}
              <div className="flex justify-start">
                <div className="max-w-[85%] bg-[#171b26] border border-white/[0.06] p-3 rounded-2xl rounded-tl-sm text-xs text-slate-200 leading-relaxed shadow-sm">
                  {chatData.incomingMsg}
                </div>
              </div>

              {/* RAG Citation Pill */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff1a40]/10 border border-[#ff1a40]/30 text-[10px] font-mono text-[#ff3355]">
                  <Sparkles className="w-3 h-3" />
                  <span>Grounding: {chatData.sourceUsed}</span>
                </div>
              </div>

              {/* AI Agent Response */}
              <div className="flex justify-end">
                <div className="max-w-[88%] bg-gradient-to-br from-[#1a1f2e] to-[#12151f] border border-[#ff1a40]/30 p-3 rounded-2xl rounded-tr-sm text-xs text-slate-100 leading-relaxed shadow-[0_0_20px_rgba(255,26,64,0.1)]">
                  {chatData.responseMsg}
                </div>
              </div>
            </div>

            {/* Realtime Footer */}
            <div className="border-t border-white/[0.06] pt-2.5 flex items-center justify-between text-[10px] text-slate-500">
              <span>Tenant Scope: <strong className="text-slate-400">Enterprise_Master</strong></span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified Zero Hallucination
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
