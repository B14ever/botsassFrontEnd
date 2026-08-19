"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Presentation, FileText, FileSpreadsheet, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function DocGenSection() {
  const [activeTab, setActiveTab] = useState<"report" | "deck" | "sheet">("deck");

  return (
    <section id="doc-gen" className="px-6 py-16 max-w-5xl mx-auto border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mb-10 space-y-2 text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Document &amp; Presentation Generator
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Turn company data into decks and reports.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Don&apos;t just answer customer chats. Let your team synthesize your uploaded knowledge into
          formatted slides, executive summaries, and spreadsheets.
        </p>
      </motion.div>

      {/* Interactive Mockup Box */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="rounded-xl border border-border bg-card overflow-hidden card-hover"
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-border bg-muted/20 gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-foreground" />
            <span className="text-xs font-bold text-foreground">Redas DocGen Studio</span>
          </div>

          <div className="flex items-center bg-secondary p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab("deck")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === "deck"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              Slide Deck (.pptx)
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === "report"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Report (.pdf / .docx)
            </button>
            <button
              onClick={() => setActiveTab("sheet")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === "sheet"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Data Sheet (.xlsx)
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Prompt description (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-3.5 rounded-lg border border-border bg-secondary/40 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Team Prompt
              </span>
              <p className="text-xs text-foreground font-medium italic">
                {activeTab === "deck" &&
                  '"Create a 6-slide presentation summarizing our 2026 sales performance and product milestones for the board."'}
                {activeTab === "report" &&
                  '"Generate a structured executive report analyzing customer support trends and response times from last month."'}
                {activeTab === "sheet" &&
                  '"Extract all regional product pricing tiers and discounts from our contract documents into a spreadsheet."'}
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                <span>Grounded directly in your workspace files</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                <span>Downloadable in standard office formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                <span>Ready to present or share with stakeholders</span>
              </div>
            </div>
          </div>

          {/* Generated Result Preview (6 cols) */}
          <div className="md:col-span-6 p-4 rounded-lg border border-border bg-muted/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                {activeTab === "deck" && "Sales_Review_2026_BoardDeck.pptx"}
                {activeTab === "report" && "Support_Performance_Report.pdf"}
                {activeTab === "sheet" && "Regional_Pricing_Matrix.xlsx"}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Generated
              </span>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card space-y-2 text-xs">
              <div className="h-3 bg-secondary rounded w-3/4" />
              <div className="h-2 bg-secondary rounded w-full" />
              <div className="h-2 bg-secondary rounded w-5/6" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <span className="text-[9px] text-muted-foreground block">Accuracy</span>
                  <strong className="text-foreground text-xs">100%</strong>
                </div>
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <span className="text-[9px] text-muted-foreground block">Sources</span>
                  <strong className="text-foreground text-xs">8 Docs</strong>
                </div>
                <div className="p-2 rounded bg-secondary/50 text-center">
                  <span className="text-[9px] text-muted-foreground block">Format</span>
                  <strong className="text-foreground text-xs">Ready</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
