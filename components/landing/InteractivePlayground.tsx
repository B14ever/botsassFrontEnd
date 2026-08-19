"use client";

import React, { useState } from "react";
import {
  Terminal,
  Send,
  Sparkles,
  Database,
  FileText,
  FileCode,
  ShieldAlert,
  Bot,
  User,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
} from "lucide-react";

interface SampleKnowledge {
  id: string;
  name: string;
  category: string;
  icon: any;
  promptSuggestions: string[];
  qaMap: Record<
    string,
    {
      answer: string;
      source: string;
      chunk: number;
      similarity: string;
      latency: string;
    }
  >;
}

const SAMPLE_KNOWLEDGE_BASES: SampleKnowledge[] = [
  {
    id: "security",
    name: "Enterprise Security & SLA Policy.pdf",
    category: "Compliance & Security",
    icon: ShieldAlert,
    promptSuggestions: [
      "How are multi-tenant pgvector embeddings isolated?",
      "What is our guaranteed uptime SLA and disaster recovery RPO?",
      "Are LLM training opt-outs enforced for OpenRouter models?",
    ],
    qaMap: {
      "How are multi-tenant pgvector embeddings isolated?": {
        answer:
          "All vector embeddings are partitioned at the database schema level using PostgreSQL Row-Level Security (RLS) and encrypted with tenant-specific KMS master keys. No vector embeddings are ever mixed across tenant boundaries.",
        source: "Enterprise Security & SLA Policy.pdf",
        chunk: 42,
        similarity: "0.988 Cosine Match",
        latency: "135ms",
      },
      "What is our guaranteed uptime SLA and disaster recovery RPO?": {
        answer:
          "RedAI provides a 99.99% monthly uptime SLA. Our continuous replication across multi-region PostgreSQL instances guarantees an RPO (Recovery Point Objective) of < 1 minute and RTO of < 5 minutes.",
        source: "Enterprise Security & SLA Policy.pdf",
        chunk: 18,
        similarity: "0.976 Cosine Match",
        latency: "142ms",
      },
      "Are LLM training opt-outs enforced for OpenRouter models?": {
        answer:
          "Yes. All inference calls dispatched through our OpenRouter pipeline enforce strict zero-data-retention headers (`HTTP-Referer: redai.io`, `X-Data-Policy: no-training`). No customer telemetry or RAG context is retained or used for model training.",
        source: "Enterprise Security & SLA Policy.pdf",
        chunk: 67,
        similarity: "0.991 Cosine Match",
        latency: "128ms",
      },
    },
  },
  {
    id: "api",
    name: "RedAI_Developer_API_v1.md",
    category: "Developer Documentation",
    icon: FileCode,
    promptSuggestions: [
      "How do I create an omnichannel Telegram bot via API?",
      "How do webhooks handle rate limits and retries?",
      "Can we stream SSE chat completions from the Go backend?",
    ],
    qaMap: {
      "How do I create an omnichannel Telegram bot via API?": {
        answer:
          "Post to `POST /api/v1/channels/telegram` with your bot token and `agent_id`. RedAI automatically verifies the webhook secret, maps chat session states to your workspace, and enables instant pgvector RAG grounding.",
        source: "RedAI_Developer_API_v1.md",
        chunk: 23,
        similarity: "0.984 Cosine Match",
        latency: "119ms",
      },
      "How do webhooks handle rate limits and retries?": {
        answer:
          "RedAI implements exponential backoff with jitter across 5 retry attempts (at 5s, 30s, 2m, 15m, 1h). Webhooks returning HTTP 429 or 5xx are queued in Redis with dead-letter queue alerts.",
        source: "RedAI_Developer_API_v1.md",
        chunk: 35,
        similarity: "0.969 Cosine Match",
        latency: "130ms",
      },
      "Can we stream SSE chat completions from the Go backend?": {
        answer:
          "Yes! Connect to `GET /api/v1/agents/:id/chat/stream?prompt=...` for standard Server-Sent Events (SSE). Chunks stream in real-time as tokens are generated from OpenRouter with <180ms TTFT.",
        source: "RedAI_Developer_API_v1.md",
        chunk: 14,
        similarity: "0.993 Cosine Match",
        latency: "112ms",
      },
    },
  },
  {
    id: "billing",
    name: "Enterprise_Pricing_&_Quotas.xlsx",
    category: "Commercial & Billing",
    icon: FileText,
    promptSuggestions: [
      "What happens when our workspace hits the monthly token quota?",
      "Can we add custom workspace seats on the Pro plan?",
      "Do you support local payment gateways like Chapa?",
    ],
    qaMap: {
      "What happens when our workspace hits the monthly token quota?": {
        answer:
          "You can configure hard stops or automatic micro-top-ups ($1.50 per 1M tokens). When reaching 80% and 95% thresholds, administrators receive webhook and email alerts.",
        source: "Enterprise_Pricing_&_Quotas.xlsx",
        chunk: 9,
        similarity: "0.975 Cosine Match",
        latency: "145ms",
      },
      "Can we add custom workspace seats on the Pro plan?": {
        answer:
          "Yes. Pro plans include 5 team seats by default, and additional team members (Bot Managers, Knowledge Editors, Auditors) can be added for $15/seat/month.",
        source: "Enterprise_Pricing_&_Quotas.xlsx",
        chunk: 12,
        similarity: "0.982 Cosine Match",
        latency: "124ms",
      },
      "Do you support local payment gateways like Chapa?": {
        answer:
          "Yes! RedAI natively integrates with Chapa for direct local currency billing (ETB) alongside international card processing via Stripe.",
        source: "Enterprise_Pricing_&_Quotas.xlsx",
        chunk: 4,
        similarity: "0.995 Cosine Match",
        latency: "108ms",
      },
    },
  },
];

export default function InteractivePlayground() {
  const [selectedKb, setSelectedKb] = useState<SampleKnowledge>(SAMPLE_KNOWLEDGE_BASES[0]);
  const [activeQuestion, setActiveQuestion] = useState<string>(
    SAMPLE_KNOWLEDGE_BASES[0].promptSuggestions[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  const currentQA =
    selectedKb.qaMap[activeQuestion] || {
      answer:
        "RedAI searched " +
        selectedKb.name +
        " via pgvector cosine similarity and synthesized a verified grounded answer with zero hallucination.",
      source: selectedKb.name,
      chunk: 15,
      similarity: "0.972 Cosine Match",
      latency: "140ms",
    };

  const handleSelectQuestion = (q: string) => {
    setIsSimulating(true);
    setActiveQuestion(q);
    setTimeout(() => setIsSimulating(false), 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsSimulating(true);
    setActiveQuestion(inputValue);
    setInputValue("");
    setTimeout(() => setIsSimulating(false), 500);
  };

  const handleSelectKb = (kb: SampleKnowledge) => {
    setSelectedKb(kb);
    setActiveQuestion(kb.promptSuggestions[0]);
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 350);
  };

  return (
    <section id="playground" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Glow behind */}
      <div
        className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#ff1a40]/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff1a40]/10 border border-[#ff1a40]/30 text-xs font-semibold text-[#ff3355] uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          Interactive RAG Playground
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Test Live Vector Retrieval
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Select a sample enterprise knowledge source below and watch how pgvector semantic search
          grounds responses in real time.
        </p>
      </div>

      {/* Playground Window */}
      <div className="rounded-2xl bg-[#090b10] border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Knowledge Source Selector Strip */}
        <div className="p-4 border-b border-white/[0.08] bg-[#10131d]/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Database className="w-4 h-4 text-[#ff1a40]" />
            <span>Active Knowledge Base:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_KNOWLEDGE_BASES.map((kb) => {
              const isSelected = selectedKb.id === kb.id;
              const Icon = kb.icon;
              return (
                <button
                  key={kb.id}
                  onClick={() => handleSelectKb(kb)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#ff1a40] text-white shadow-[0_0_15px_rgba(255,26,64,0.4)]"
                      : "bg-[#141724] border border-white/[0.06] text-slate-300 hover:text-white hover:bg-[#1b2030]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{kb.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playground Split Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Prompt Suggestions Column (4 Cols) */}
          <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0c0e15]/50 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff1a40]" />
                Suggested Test Prompts
              </span>
              <div className="space-y-2">
                {selectedKb.promptSuggestions.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectQuestion(prompt)}
                    className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                      activeQuestion === prompt
                        ? "bg-[#ff1a40]/10 border-[#ff1a40]/60 text-white font-medium shadow-[0_0_15px_rgba(255,26,64,0.15)]"
                        : "bg-[#121520]/80 border-white/[0.06] text-slate-300 hover:bg-[#161a28] hover:text-white"
                    }`}
                  >
                    &quot;{prompt}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Model & Security Specs */}
            <div className="p-3 rounded-xl bg-[#08090d] border border-white/[0.06] space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Inference Engine</span>
                <span className="text-purple-400 font-mono font-semibold">Claude 3.5 Sonnet</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Vector Index</span>
                <span className="text-emerald-400 font-mono">pgvector HNSW</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Hallucination Guard</span>
                <span className="text-[#ff3355] font-mono">Active (Score &gt; 0.75)</span>
              </div>
            </div>
          </div>

          {/* Chat & Grounding Live Output (8 Cols) */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6 bg-[#080a0f]">
            {/* Conversation Thread */}
            <div className="space-y-4">
              {/* User Question */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-[#131622] border border-white/[0.08] p-3.5 rounded-2xl rounded-tl-sm text-sm text-slate-100 leading-relaxed shadow-sm">
                  {activeQuestion}
                </div>
              </div>

              {/* Vector Citations & Similarity Banner */}
              <div className="pl-11">
                <div className="p-3 rounded-xl bg-[#111420] border border-[#ff1a40]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Database className="w-3.5 h-3.5 text-[#ff1a40]" />
                    <span>Grounding Chunk #{currentQA.chunk}</span>
                    <span className="text-slate-500">({currentQA.source})</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-emerald-400 font-semibold">{currentQA.similarity}</span>
                    <span className="text-slate-400">{currentQA.latency}</span>
                  </div>
                </div>
              </div>

              {/* AI Agent Answer */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#ff1a40]/20 border border-[#ff1a40]/50 flex items-center justify-center text-[#ff1a40] shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#161a26] to-[#0f121b] border border-white/[0.1] p-4 rounded-2xl rounded-tl-sm text-sm text-slate-100 leading-relaxed shadow-lg">
                  {isSimulating ? (
                    <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#ff1a40]" />
                      <span>Retrieving pgvector context &amp; streaming token synthesis...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>{currentQA.answer}</p>
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Grounded in Knowledge Base
                        </span>
                        <span>Multi-Tenant RLS Verified</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Interactive Input Bar */}
            <form onSubmit={handleCustomSubmit} className="pt-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask a question against ${selectedKb.name}...`}
                  className="w-full bg-[#111420] border border-white/[0.1] focus:border-[#ff1a40]/60 focus:ring-1 focus:ring-[#ff1a40] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 pr-12 transition-all outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 rounded-lg bg-[#ff1a40] text-white hover:bg-[#d40028] disabled:opacity-40 disabled:hover:bg-[#ff1a40] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
