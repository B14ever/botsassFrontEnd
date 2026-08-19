"use client";

import React, { useState } from "react";
import {
  Terminal,
  Cpu,
  Database,
  Layers,
  Code2,
  Copy,
  Check,
  Zap,
  Server,
  LayoutGrid,
  Shield,
} from "lucide-react";

type StackTab = "backend" | "frontend" | "rag";

export default function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState<StackTab>("backend");
  const [copied, setCopied] = useState(false);

  const codeSnippets: Record<StackTab, { title: string; filename: string; code: string; highlights: string[] }> = {
    backend: {
      title: "High-Performance Go 1.26 + Fiber v2 Core",
      filename: "internal/service/rag_engine.go",
      highlights: [
        "Go 1.26 + Fiber v2 for sub-millisecond routing",
        "PostgreSQL + pgvector with HNSW index indexing",
        "OpenRouter client with automatic fallback & streaming SSE",
        "Multi-tenant tenant_id scoped row-level security",
      ],
      code: `package service

import (
	"context"
	"github.com/gofiber/fiber/v2"
	"github.com/pgvector/pgvector-go"
	"github.com/redai/backend/internal/openrouter"
)

// ExecuteRAGQuery retrieves isolated vector chunks and streams response
func (s *RAGService) ExecuteRAGQuery(ctx context.Context, tenantID, agentID string, query string) (*RAGResponse, error) {
	// 1. Generate text embedding
	queryVector, err := s.embedder.EmbedQuery(ctx, query)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, "embedding failed")
	}

	// 2. Query pgvector with cosine distance & tenant isolation
	var chunks []DocumentChunk
	err = s.db.WithContext(ctx).Raw(\`
		SELECT id, content, source_file, 1 - (embedding <=> ?) AS similarity
		FROM document_chunks
		WHERE tenant_id = ? AND agent_id = ? AND 1 - (embedding <=> ?) > 0.78
		ORDER BY embedding <=> ? LIMIT 5
	\`, pgvector.NewVector(queryVector), tenantID, agentID, pgvector.NewVector(queryVector), pgvector.NewVector(queryVector)).Scan(&chunks).Error

	// 3. Dispatch to OpenRouter multi-model stream
	return s.openrouter.StreamCompletion(ctx, openrouter.Payload{
		Model:       "anthropic/claude-3.5-sonnet",
		Context:     chunks,
		UserPrompt:  query,
		Temperature: 0.15,
	})
}`,
    },
    frontend: {
      title: "Next.js App Router & Embeddable Web Widget SDK",
      filename: "packages/widget/src/RedAIChat.tsx",
      highlights: [
        "Next.js App Router with React Server Components & Streaming",
        "TypeScript strict typing with TanStack Query v5 state sync",
        "Tailwind CSS + Glassmorphism aesthetic tokens",
        "Ultra-lightweight embeddable JS widget bundle (<32KB gzip)",
      ],
      code: `"use client";

import React, { useState } from "react";
import { useRedAIAgent } from "@redai/react-sdk";
import { MotionChatWindow, StreamMessage } from "@/components/ui/chat";

export function RedAIWidget({ agentId, theme = "obsidian" }: WidgetProps) {
  const { messages, sendMessage, isStreaming, currentCitations } = useRedAIAgent({
    agentId,
    endpoint: "https://api.redai.io/v1/chat/stream",
    onCitationClick: (doc) => window.open(doc.url, "_blank"),
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <MotionChatWindow
        theme={theme}
        agentName="RedAI Support Specialist"
        messages={messages}
        citations={currentCitations}
        isStreaming={isStreaming}
        onSend={(prompt) => sendMessage({ text: prompt, channel: "web" })}
      />
    </div>
  );
}`,
    },
    rag: {
      title: "Multi-Source Tiktoken Chunking & pgvector Indexing",
      filename: "internal/rag/chunker.go",
      highlights: [
        "Sliding window tiktoken tokenization with 10% overlap",
        "PostgreSQL pgvector HNSW indexing (m=16, ef_construction=64)",
        "Zero-latency hybrid keyword + vector semantic fusion",
        "Document OCR extraction for complex scanned PDFs & tables",
      ],
      code: `package rag

import (
	"github.com/pkoukk/tiktoken-go"
	"github.com/pgvector/pgvector-go"
)

// ChunkDocument performs sliding-window chunking with tiktoken token boundaries
func (c *Chunker) ChunkDocument(content string, chunkSize, overlap int) ([]Chunk, error) {
	encoder, err := tiktoken.GetEncoding("cl100k_base")
	if err != nil {
		return nil, err
	}

	tokens := encoder.Encode(content, nil, nil)
	var chunks []Chunk

	for i := 0; i < len(tokens); i += (chunkSize - overlap) {
		end := i + chunkSize
		if end > len(tokens) {
			end = len(tokens)
		}

		chunkText := encoder.Decode(tokens[i:end])
		chunks = append(chunks, Chunk{
			TokenCount: end - i,
			Content:    chunkText,
			Index:      len(chunks),
		})
	}
	return chunks, nil
}`,
    },
  };

  const current = codeSnippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="architecture" className="py-24 px-6 max-w-7xl mx-auto relative">
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#ff1a40]/10 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ff1a40]/10 border border-[#ff1a40]/30 text-xs font-semibold text-[#ff3355] uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5" />
          Full-Stack Enterprise Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Built on Modern, High-Throughput Tech
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Zero bloat. Direct compiled Go services, PostgreSQL with pgvector for instant
          similarity search, and Next.js for rapid multi-tenant interfaces.
        </p>
      </div>

      {/* Architecture Tabs and Terminal Showcase */}
      <div className="rounded-2xl bg-[#090b10] border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
        {/* Tab Controls Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#10131d]/90 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("backend")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "backend"
                  ? "bg-[#ff1a40] text-white shadow-[0_0_15px_rgba(255,26,64,0.4)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Go Fiber v2 Backend
            </button>

            <button
              onClick={() => setActiveTab("frontend")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "frontend"
                  ? "bg-[#ff1a40] text-white shadow-[0_0_15px_rgba(255,26,64,0.4)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Next.js + Web Widget
            </button>

            <button
              onClick={() => setActiveTab("rag")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "rag"
                  ? "bg-[#ff1a40] text-white shadow-[0_0_15px_rgba(255,26,64,0.4)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              pgvector RAG Core
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
              {current.filename}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1] text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Code"}</span>
            </button>
          </div>
        </div>

        {/* Code & Architectural Feature Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Feature highlights column */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0c0e15]/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#ff3355] tracking-wider font-bold">
                  Architecture Specifications
                </span>
                <h3 className="text-lg font-bold text-white">{current.title}</h3>
              </div>

              <div className="space-y-2.5">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro stats */}
            <div className="p-3.5 rounded-xl bg-[#121520] border border-white/[0.06] space-y-2">
              <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Database Query Overhead</span>
                <span className="text-emerald-400 font-mono">1.4ms</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Concurrent Connections</span>
                <span className="text-[#ff3355] font-mono">100,000+</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Vector Index Algorithm</span>
                <span className="text-purple-400 font-mono">HNSW Cosine</span>
              </div>
            </div>
          </div>

          {/* Interactive Code Window */}
          <div className="lg:col-span-8 p-6 bg-[#07080c] overflow-x-auto">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed custom-scrollbar">
              <code>{current.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
