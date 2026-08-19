"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Globe,
  Send,
  MessageSquare,
  Shield,
  Zap,
  Layers,
  Cpu,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Users,
  Key,
  Lock,
  Activity,
  Gauge,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function BentoCapabilities() {
  const [activeChannelTab, setActiveChannelTab] = useState<"tg" | "wa" | "web">("wa");
  const [activeOrgLevel, setActiveOrgLevel] = useState<number>(1);

  return (
    <section id="capabilities" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff1a40]/10 border border-[#ff1a40]/30 text-xs font-semibold text-[#ff3355] uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          Enterprise Capabilities
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Engineered for Deep Context & Scale
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          From multi-source unstructured document ingestion to zero-latency multi-channel
          orchestration.
        </p>
      </div>

      {/* Bento Grid (4 Cards: 2 Large, 2 Medium in 12-col layout) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* CARD 1: Knowledge Base & RAG (7 Cols on desktop) */}
        <div className="md:col-span-7 rounded-2xl bg-[#0e1118]/80 border border-white/[0.08] hover:border-[#ff1a40]/40 p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl shadow-lg relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff1a40]/10 rounded-full blur-3xl pointer-events-none -z-10 group-hover:bg-[#ff1a40]/20 transition-all duration-500" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#ff1a40]/15 border border-[#ff1a40]/30 flex items-center justify-center text-[#ff3355]">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-400 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                PostgreSQL + pgvector
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-slate-100 transition-colors">
                Multi-Source Knowledge Ingestion
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Ingest PDFs, PPTXs, spreadsheets, markdown, and full website scrapes into
                PostgreSQL + pgvector with sliding-window tiktoken chunking.
              </p>
            </div>

            {/* Interactive File Pipeline UI Preview */}
            <div className="p-4 rounded-xl bg-[#080a0e] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Ingestion Pipeline</span>
                <span className="text-[10px] text-[#ff3355] font-mono">Semantic Cosine: 0.982</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { name: "Financial.pdf", icon: FileText, chunks: "128 chunks" },
                  { name: "Decks.pptx", icon: Layers, chunks: "94 chunks" },
                  { name: "Catalog.xlsx", icon: FileSpreadsheet, chunks: "56 rows" },
                  { name: "Web API", icon: Globe, chunks: "210 pages" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#121622] border border-white/[0.06] flex flex-col items-center text-center space-y-1 hover:border-[#ff1a40]/40 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-[#ff1a40]" />
                    <span className="text-[11px] font-semibold text-slate-200 truncate w-full">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{item.chunks}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-[#141824] border border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Embedding Tensor: text-embedding-3-small (1536-d)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">14ms Indexing</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Auto OCR for Scans
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Contextual Metadata Tagging
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero Data Leakage
            </span>
          </div>
        </div>

        {/* CARD 2: Omnichannel Reach (5 Cols on desktop) */}
        <div className="md:col-span-5 rounded-2xl bg-[#0e1118]/80 border border-white/[0.08] hover:border-[#ff1a40]/40 p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl shadow-lg relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex bg-[#090b0f] p-1 rounded-lg border border-white/[0.08]">
                {(["tg", "wa", "web"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveChannelTab(t)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      activeChannelTab === t
                        ? "bg-[#ff1a40] text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Omnichannel Reach</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Connect your single verified knowledge base to WhatsApp Business, Telegram Bot,
                and embeddable Web widgets simultaneously.
              </p>
            </div>

            {/* Dynamic Interactive Channel Mockup */}
            <div className="p-4 rounded-xl bg-[#080a0e] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                      activeChannelTab === "tg"
                        ? "bg-sky-500"
                        : activeChannelTab === "wa"
                        ? "bg-emerald-500"
                        : "bg-[#ff1a40]"
                    }`}
                  >
                    {activeChannelTab.toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {activeChannelTab === "tg"
                      ? "Telegram Bot API"
                      : activeChannelTab === "wa"
                      ? "WhatsApp Cloud API"
                      : "React Web Chat Widget"}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">Synced Live</span>
              </div>

              <div className="p-3 rounded-lg bg-[#141722] text-xs text-slate-300 leading-relaxed font-sans">
                {activeChannelTab === "tg" && (
                  <span>
                    <strong>User:</strong> &quot;/ask What are the SLA escalation policies?&quot;
                    <br />
                    <strong className="text-[#ff3355]">RedAI Agent:</strong> Priority 1 tickets trigger SMS dispatch within 15 minutes.
                  </span>
                )}
                {activeChannelTab === "wa" && (
                  <span>
                    <strong>Customer:</strong> &quot;How do I reset 2FA for my enterprise workspace?&quot;
                    <br />
                    <strong className="text-emerald-400">RedAI Agent:</strong> Navigate to Settings &gt; Security &gt; Reset Authenticator Key.
                  </span>
                )}
                {activeChannelTab === "web" && (
                  <span>
                    <strong>Visitor:</strong> &quot;Can we book a dedicated pgvector migration demo?&quot;
                    <br />
                    <strong className="text-[#ff1a40]">RedAI Agent:</strong> Sure! Opening enterprise demo scheduler for your team.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Webhook Latency: <strong className="text-slate-200 font-mono">18ms</strong></span>
            <span className="text-[#ff3355] font-semibold flex items-center gap-1">
              One-click connect <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* CARD 3: Multi-Tenant & Security (5 Cols on desktop) */}
        <div className="md:col-span-5 rounded-2xl bg-[#0e1118]/80 border border-white/[0.08] hover:border-[#ff1a40]/40 p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl shadow-lg relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                RBAC & KMS
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Hierarchical Workspaces</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Organizations &rarr; Workspaces &rarr; Projects &rarr; Agents. Strict multi-tenant
                data segregation with role-based permissions and immutable audit logs.
              </p>
            </div>

            {/* Hierarchy visualizer */}
            <div className="p-3.5 rounded-xl bg-[#080a0e] border border-white/[0.06] space-y-2">
              {[
                { level: "Org Master", role: "Super Admin", access: "Billing & Workspaces", icon: Users },
                { level: "Security Workspace", role: "Knowledge Mgr", access: "Ingestion & pgvector", icon: Lock },
                { level: "Customer Agent", role: "Support Bot", access: "Telegram / Web Deploy", icon: Key },
              ].map((h, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-[#131622] border border-white/[0.06] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <h.icon className="w-3.5 h-3.5 text-[#ff1a40]" />
                    <span className="font-semibold text-slate-200">{h.level}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded">
                    {h.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>SOC2 Type II Ready</span>
            <span className="text-emerald-400 font-mono">100% Vector Isolated</span>
          </div>
        </div>

        {/* CARD 4: Enterprise Speed & Monetization (7 Cols on desktop) */}
        <div className="md:col-span-7 rounded-2xl bg-[#0e1118]/80 border border-white/[0.08] hover:border-[#ff1a40]/40 p-7 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl shadow-lg relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-300 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                Go 1.26 + Fiber v2
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">High-Performance Core & Token Metering</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Powered by a compiled Go Fiber v2 backend with OpenRouter API multi-model routing
                and millisecond-level token quota and billing enforcement.
              </p>
            </div>

            {/* Performance Metric & Model Dispatch preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#080a0e] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Engine Throughput</span>
                <div className="text-lg font-bold text-white font-mono flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  1,200,000 req/s
                </div>
                <span className="text-[9px] text-slate-500">Go Fiber v2 Core</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080a0e] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">OpenRouter Router</span>
                <div className="text-lg font-bold text-purple-400 font-mono">
                  Auto Failover
                </div>
                <span className="text-[9px] text-slate-500">Claude, GPT-4o, DeepSeek</span>
              </div>

              <div className="p-3 rounded-xl bg-[#080a0e] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Billing Meter</span>
                <div className="text-lg font-bold text-[#ff1a40] font-mono">
                  Zero Overages
                </div>
                <span className="text-[9px] text-slate-500">Real-time quota lock</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span className="text-slate-300">OpenRouter Multi-Model Failover Protocol</span>
            <span className="text-emerald-400 font-mono">99.99% Uptime SLA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
