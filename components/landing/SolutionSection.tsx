"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Bot, FileStack, RefreshCw, Zap, CheckCircle2 } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function SolutionSection() {
  return (
    <section className="px-6 py-20 max-w-5xl mx-auto border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mb-12 space-y-3 text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          The Solution
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground max-w-2xl leading-snug">
          One Platform. Every Channel. Zero Manual Work.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Redas connects directly to your organization&apos;s knowledge base — documents, PDFs, and
          website content — transforming static data into active intelligence and tangible business outputs.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Pillar 1: Multilingual Agents */}
        <motion.div
          variants={fadeInUp}
          className="p-7 rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-sm space-y-5 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Intelligent Omnichannel AI Agents
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Answer customer inquiries accurately in any language across Web, WhatsApp, and Telegram —
              grounded strictly in your authorized documentation.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              Automatic customer language detection
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              Unified conversational memory across channels
            </span>
          </div>
        </motion.div>

        {/* Pillar 2: Ready-Made Business Artifacts */}
        <motion.div
          variants={fadeInUp}
          className="p-7 rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-sm space-y-5 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FileStack className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Ready-Made Business Artifacts
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Generate formatted PowerPoint presentations, Word reports, Excel spreadsheets, and on-brand AI images built straight from your workspace data.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              Executive slide decks &amp; structured docs
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              Formulas &amp; datasets ready for immediate export
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Auto-sync Callout */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mt-6 p-5 rounded-xl border border-border/70 bg-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-3">
          <RefreshCw className="w-4 h-4 text-foreground shrink-0" />
          <span className="text-foreground font-medium">
            No prompting from scratch. No retraining every time your docs change.
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Just upload, and Redas keeps your agents and outputs current.
        </span>
      </motion.div>
    </section>
  );
}
