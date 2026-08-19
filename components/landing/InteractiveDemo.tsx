"use client";

import React, { useState } from "react";
import {
  Bot,
  Globe,
  Send,
  MessageSquare,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Building2,
  ShieldCheck,
} from "lucide-react";

type Channel = "web" | "whatsapp" | "telegram";

interface ChannelPreview {
  channel: Channel;
  name: string;
  userQuestion: string;
  sourceDoc: string;
  sourceChunk: string;
  botAnswer: string;
  customerMeta: string;
}

const PREVIEWS: Record<Channel, ChannelPreview> = {
  web: {
    channel: "web",
    name: "Website Live Chat Widget",
    userQuestion: "Do you accept local payment methods like Chapa or bank transfers?",
    sourceDoc: "Pricing_&_Payment_Terms.pdf",
    sourceChunk: "Section 3.2 — Local Billing",
    botAnswer:
      "Yes, absolutely. All our business plans are billed in Ethiopian Birr (ETB) through Chapa, CBE Birr, and Telebirr. No international credit card is required.",
    customerMeta: "Website Visitor (Addis Ababa)",
  },
  whatsapp: {
    channel: "whatsapp",
    name: "WhatsApp Business Account",
    userQuestion: "What is your return policy for wholesale fabric orders if items arrive damaged?",
    sourceDoc: "Wholesale_Returns_Policy.docx",
    sourceChunk: "Clause 14 — Damage Claims",
    botAnswer:
      "Damaged goods must be reported within 48 hours of delivery with photographic evidence. Our warehouse will dispatch replacement stock or issue a credit note within 2 business days.",
    customerMeta: "+251 91 144 8920 (WhatsApp)",
  },
  telegram: {
    channel: "telegram",
    name: "Telegram Support Bot (@AwashSupportBot)",
    userQuestion: "Can our accounting team generate a monthly summary report from our knowledge base?",
    sourceDoc: "Product_Features_Guide.pdf",
    sourceChunk: "DocGen Module — Automated Reports",
    botAnswer:
      "Yes! With Redas DocGen, you can prompt your agent to synthesize your indexed invoices and sales sheets into a formatted PDF/Word report or a slide presentation in seconds.",
    customerMeta: "@samuel_finance (Telegram)",
  },
};

export default function InteractiveDemo() {
  const [activeChannel, setActiveChannel] = useState<Channel>("web");
  const current = PREVIEWS[activeChannel];

  return (
    <div className="w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden card-hover text-left">
      {/* Top Window Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-border bg-muted/30 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-border" />
          </div>
          <span className="text-xs font-semibold text-foreground ml-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            Workspace: <strong className="font-semibold">Awash Enterprises</strong>
          </span>
        </div>

        {/* Live Channel Selector Tabs */}
        <div className="flex items-center bg-secondary p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveChannel("web")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeChannel === "web"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Website
          </button>
          <button
            onClick={() => setActiveChannel("whatsapp")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeChannel === "whatsapp"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button
            onClick={() => setActiveChannel("telegram")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              activeChannel === "telegram"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Telegram
          </button>
        </div>
      </div>

      {/* Main Preview Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Side: Connected Knowledge Sources (4 Cols) */}
        <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-border bg-muted/10 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Indexed Sources (38)
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg border border-border bg-card flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-foreground truncate">Pricing_&_Payment_Terms.pdf</div>
                  <div className="text-[10px] text-muted-foreground">PDF Document * 24 Chunks</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border bg-card flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-foreground truncate">Wholesale_Returns_Policy.docx</div>
                  <div className="text-[10px] text-muted-foreground">Word File * 18 Chunks</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-border bg-card flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-foreground truncate">Product_Inventory_2026.xlsx</div>
                  <div className="text-[10px] text-muted-foreground">Spreadsheet * 85 Rows</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card space-y-1 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Instant Resolution</span>
              <span className="font-bold text-foreground">78%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div className="bg-foreground h-full rounded-full w-[78%]" />
            </div>
          </div>
        </div>

        {/* Right Side: Live Omnichannel Conversation (8 Cols) */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6 bg-card">
          {/* Channel Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-foreground">{current.name}</div>
              <div className="text-[11px] text-muted-foreground">{current.customerMeta}</div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border text-[10px] font-semibold text-muted-foreground">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              Connected
            </div>
          </div>

          {/* Conversation Messages */}
          <div className="space-y-4">
            {/* Customer Inquiry */}
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-secondary border border-border p-3 rounded-xl rounded-tl-sm text-xs text-foreground leading-relaxed">
                {current.userQuestion}
              </div>
            </div>

            {/* Document Grounding Citation */}
            <div className="flex justify-start pl-2">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                <Sparkles className="w-3 h-3 text-foreground" />
                <span>Grounded in: {current.sourceDoc} ({current.sourceChunk})</span>
              </div>
            </div>

            {/* Bot Response */}
            <div className="flex justify-end gap-2.5">
              <div className="max-w-[85%] bg-primary text-primary-foreground p-3.5 rounded-xl rounded-tr-sm text-xs leading-relaxed font-normal shadow-sm">
                {current.botAnswer}
              </div>
              <div className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-foreground" />
              </div>
            </div>
          </div>

          {/* Verified Guarantee Badge */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Zero Hallucination — Exact Document Match
            </span>
            <span>Response Time: &lt; 0.2s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
