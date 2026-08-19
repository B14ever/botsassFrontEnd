"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  MessageSquare,
  Presentation,
  ShieldCheck,
  Send,
  Sparkles,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Layers,
  Bot,
  Globe2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FeaturesAlternatingSection() {
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "telegram" | "web">("whatsapp");

  return (
    <section id="features" className="px-6 py-24 max-w-6xl mx-auto border-t border-border space-y-28">
      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border/80">
          Core Capabilities
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Everything your workspace needs to operate on autopilot.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Unified conversational intelligence paired with automated document generation and isolated team workspaces.
        </p>
      </motion.div>

      {/* Row 1: Omnichannel Phone Mockup (Text Left, Phone Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Copy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="lg:col-span-6 space-y-5"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Omnichannel Agents</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            One AI Brain. Deployed Across WhatsApp, Telegram &amp; Web.
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect your customer-facing communication channels in one click. Your agents detect incoming languages automatically and resolve questions with verified accuracy from your uploaded files.
          </p>

          <div className="space-y-2.5 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Automatic real-time language detection (Amharic, English, Oromo, French, etc.)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Unified conversation history across all connected messaging endpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Zero hallucinations — replies are strictly grounded in your authorized documents</span>
            </div>
          </div>
        </motion.div>

        {/* Mockup: Interactive Smartphone Frame */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="w-full max-w-[320px] rounded-[36px] border-4 border-foreground/15 bg-background shadow-2xl p-3 relative overflow-hidden">
            {/* Phone Notch & Speaker */}
            <div className="w-24 h-4 bg-foreground/15 rounded-full mx-auto mb-3" />

            {/* Channel Switcher Tabs */}
            <div className="flex items-center bg-secondary/80 p-1 rounded-xl border border-border mb-3 gap-1">
              <button
                onClick={() => setActiveChannel("whatsapp")}
                className={`flex-1 text-[11px] font-semibold py-1 rounded-lg transition-all ${
                  activeChannel === "whatsapp"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setActiveChannel("telegram")}
                className={`flex-1 text-[11px] font-semibold py-1 rounded-lg transition-all ${
                  activeChannel === "telegram"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Telegram
              </button>
              <button
                onClick={() => setActiveChannel("web")}
                className={`flex-1 text-[11px] font-semibold py-1 rounded-lg transition-all ${
                  activeChannel === "web"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Web Chat
              </button>
            </div>

            {/* Chat Screen Mockup */}
            <div className="rounded-2xl border border-border bg-card/80 p-3.5 space-y-3 min-h-[340px] flex flex-col justify-between text-xs">
              {/* Header inside phone */}
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                  R
                </div>
                <div>
                  <div className="text-[11px] font-bold text-foreground">Redas Support Agent</div>
                  <div className="text-[9px] text-emerald-500 font-medium">● Online • {activeChannel.toUpperCase()}</div>
                </div>
              </div>

              {/* Chat Bubble Thread */}
              <div className="space-y-2.5 my-auto">
                <div className="bg-secondary/70 border border-border/80 text-foreground p-2.5 rounded-xl rounded-tl-none max-w-[85%] text-[11px] leading-relaxed">
                  {activeChannel === "whatsapp" && "ሰላም! ስለ ምርቶቻችሁ ዋጋና አቅርቦት ማወቅ እፈልጋለሁ።"}
                  {activeChannel === "telegram" && "Hi, what are the enterprise onboarding steps?"}
                  {activeChannel === "web" && "Can your agents generate a PowerPoint deck from my PDF?"}
                </div>

                <div className="bg-primary/10 border border-primary/20 text-foreground p-2.5 rounded-xl rounded-tr-none ml-auto max-w-[90%] text-[11px] leading-relaxed">
                  <div className="flex items-center gap-1 text-[9px] font-semibold text-primary mb-1">
                    <Sparkles className="w-3 h-3" /> Grounded in Knowledge Base
                  </div>
                  {activeChannel === "whatsapp" && "እንኳን ደህና መጡ! እንደ ሰነዳችን መሰረት 3 የዋጋ አማራጮች አሉን። በChapa በብር መክፈል ይችላሉ።"}
                  {activeChannel === "telegram" && "Onboarding takes under 5 minutes: Upload your docs, connect your Telegram bot token, and your agent goes live immediately."}
                  {activeChannel === "web" && "Yes! Simply ask Redas for a slide presentation, and our DocGen engine builds a formatted .pptx deck directly from your data."}
                </div>
              </div>

              {/* Input box */}
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <div className="flex-1 bg-secondary/50 rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground">
                  Type a reply...
                </div>
                <div className="w-6 h-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                  <Send className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Instant Data Artifacts Card (Artifact Left, Text Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Mockup: Business Artifact Showcase Card */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="lg:col-span-6 order-2 lg:order-1"
        >
          <div className="rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-md p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">DocGen Studio Output</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Ready for Export
              </span>
            </div>

            {/* Generated Deliverables Previews */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                    PPTX
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Q3 Executive Briefing.pptx</div>
                    <div className="text-[10px] text-muted-foreground">8 slides • Charts &amp; financials auto-synthesized</div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                  Download
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                    DOCX
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Customer Support Audit Report.docx</div>
                    <div className="text-[10px] text-muted-foreground">4 pages • Formatted executive summary</div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                  Download
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                    XLSX
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Sales &amp; Inquiry Breakdown.xlsx</div>
                    <div className="text-[10px] text-muted-foreground">Clean formulas • Granular channel metrics</div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded">
                  Download
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Copy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="lg:col-span-6 space-y-5 order-1 lg:order-2"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <Presentation className="w-3.5 h-3.5" />
            <span>Automated Deliverables</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Turn Raw Documents Into Executive Presentations &amp; Reports.
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Don&apos;t spend hours building slide decks from scratch. Ask Redas to synthesize your uploaded data into professionally formatted PowerPoint presentations, Word briefs, and spreadsheets in seconds.
          </p>

          <div className="space-y-2.5 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Direct export to standard Microsoft Office formats (.pptx, .docx, .xlsx)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Automated data charts and executive executive summaries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>AI image generation for custom on-brand visual assets</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Isolated Workspaces & Team Roles (Text Left, Workspace Feed Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Copy */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="lg:col-span-6 space-y-5"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multi-Tenant Architecture</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Isolated Workspaces with Granular Role Control.
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Create distinct workspaces for different departments, client accounts, or brand subsidiaries. Each workspace maintains its own vector storage, custom agents, and team roles with zero cross-tenant data leakage.
          </p>

          <div className="space-y-2.5 pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Role-based access (Workspace Owner, Bot Manager, Editor, Agent)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Complete audit logs and encrypted document storage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Agency-ready multi-workspace management with a single login</span>
            </div>
          </div>
        </motion.div>

        {/* Mockup: Team & Workspace Security Feed */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="lg:col-span-6"
        >
          <div className="rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-md p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">Workspace Hub: Production Ops</span>
              </div>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                Encrypted &amp; Isolated
              </span>
            </div>

            {/* Team Roles & Activity */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    JD
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">John D. (Founder)</div>
                    <div className="text-[10px] text-muted-foreground">Workspace Owner • Full Access</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-foreground bg-secondary px-2 py-0.5 rounded">
                  Admin
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-bold text-xs">
                    SM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">Sara M. (Support Lead)</div>
                    <div className="text-[10px] text-muted-foreground">Bot Manager • WhatsApp &amp; Web</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  Manager
                </span>
              </div>

              <div className="p-3 rounded-xl border border-border/80 bg-secondary/30 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Tenant Vector Collections</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-foreground">100% Partitioned</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
