"use client";

import React from "react";
import {
  Send,
  MessageSquare,
  Globe,
  Database,
  Cpu,
  Layers,
  Zap,
  FileSpreadsheet,
  FileText,
  Webhook,
  Bot,
  ArrowRight,
} from "lucide-react";

export default function IntegrationsSection() {
  const integrations = [
    {
      name: "WhatsApp Business",
      category: "Customer Messaging",
      icon: MessageSquare,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      desc: "Cloud API webhooks with 24/7 automated session management.",
    },
    {
      name: "Telegram Bots",
      category: "Omnichannel Bot",
      icon: Send,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
      desc: "Native inline commands, button keyboards, and streaming replies.",
    },
    {
      name: "Embeddable Web SDK",
      category: "Web Chat",
      icon: Globe,
      color: "text-[#ff1a40] bg-[#ff1a40]/10 border-[#ff1a40]/30",
      desc: "Custom branded widget with zero-config React & vanilla script tags.",
    },
    {
      name: "PostgreSQL pgvector",
      category: "Vector Database",
      icon: Database,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
      desc: "HNSW high-dimensional index with schema-level tenant isolation.",
    },
    {
      name: "OpenRouter LLM",
      category: "Multi-Model Engine",
      icon: Cpu,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
      desc: "Dynamic failover across Claude 3.5 Sonnet, GPT-4o, and DeepSeek.",
    },
    {
      name: "REST & SSE Webhooks",
      category: "Developer Events",
      icon: Webhook,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      desc: "Server-Sent Events streaming with exponential backoff retries.",
    },
  ];

  return (
    <section id="integrations" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff1a40]/10 border border-[#ff1a40]/30 text-xs font-semibold text-[#ff3355] uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          Native Integrations Ecosystem
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Connects Everywhere Your Customers Are
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          One knowledge repository. Deploy seamlessly to messaging platforms, native apps, and
          internal workflow pipelines in seconds.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0c0e15]/80 border border-white/[0.08] hover:border-[#ff1a40]/40 hover:bg-[#111420] transition-all duration-300 backdrop-blur-xl group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider bg-white/[0.04] px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-slate-100 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Plug-and-Play
                </span>
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                  Adapter Ready &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
