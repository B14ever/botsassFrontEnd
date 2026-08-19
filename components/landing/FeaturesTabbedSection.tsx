"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Presentation,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Layers,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface FeatureTab {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  icon: React.ElementType;
  points: string[];
  mockup: React.ReactNode;
}

export default function FeaturesTabbedSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const AUTO_CYCLE_DURATION = 6000; // 6 seconds per tab

  const tabs: FeatureTab[] = [
    {
      id: "ingestion",
      badge: "Knowledge Engine",
      title: "Smart Ingestion & Vector Indexing",
      tagline: "Upload PDFs, docs, spreadsheets, or link your website — Redas parses and organizes your data into a live vector collection.",
      icon: Brain,
      points: [
        "Automatic parsing for PDF, DOCX, XLSX, TXT, and web URLs",
        "Chunking & embedding generation with zero manual configuration",
        "Continuous auto-sync keeps your knowledge current as files update",
      ],
      mockup: (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <UploadCloud className="w-4 h-4 text-primary" />
              <span>Workspace Data Vault</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Live Vector Index
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  PDF
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Company_Policies_2026.pdf</div>
                  <div className="text-[10px] text-muted-foreground">142 pages • 850 chunks indexed</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-500">100% Ready</span>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                  URL
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">https://docs.yourbrand.com</div>
                  <div className="text-[10px] text-muted-foreground">38 pages crawled • Live Sync</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-500">Synched</span>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                  XLSX
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Pricing_and_Inventory.xlsx</div>
                  <div className="text-[10px] text-muted-foreground">3 sheets • 2,400 rows parsed</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-500">100% Ready</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "omnichannel",
      badge: "Frontline Support",
      title: "Omnichannel Multilingual Agents",
      tagline: "Deploy your agent across your Website Widget, WhatsApp Business, and Telegram bot with unified conversational memory.",
      icon: MessageSquare,
      points: [
        "Natively supports 50+ languages with automatic real-time detection",
        "Grounded exclusively in authorized workspace files with citation links",
        "24/7 autonomous support deflection with zero response latency",
      ],
      mockup: (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Globe2 className="w-4 h-4 text-primary" />
              <span>Multi-Channel Dispatcher</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              <span>WhatsApp • Telegram • Web</span>
            </div>
          </div>

          <div className="space-y-2.5 p-4 rounded-xl border border-border/80 bg-background/80 text-xs">
            <div className="p-2.5 rounded-lg bg-secondary/60 text-foreground text-[11px] leading-relaxed max-w-[85%]">
              &quot;እንደምን አደራችሁ! የድርጅታችሁን የክፍያ ስርአት እና የዋጋ ዝርዝር መመልከት እፈልጋለሁ።&quot;
            </div>

            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-foreground text-[11px] leading-relaxed ml-auto max-w-[90%] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary">
                <Sparkles className="w-3 h-3" />
                <span>Verified by Redas Intelligence Core</span>
              </div>
              <p>
                ጤና ይስጥልኝ! እንደ ሰነዳችን መሰረት 3 የዋጋ እቅዶች አሉን። ክፍያዎን በChapa በኩል በኢትዮጵያ ብር መፈፀም ይችላሉ።
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "docgen",
      badge: "Automated Deliverables",
      title: "Instant Business Artifacts & Decks",
      tagline: "Ask your workspace to synthesize your data into boardroom-ready PowerPoint presentations, Word briefs, and spreadsheets.",
      icon: Presentation,
      points: [
        "Direct export to Microsoft PowerPoint (.pptx), Word (.docx), and Excel (.xlsx)",
        "Auto-generated executive summaries with data charts and financial metrics",
        "Integrated AI image generation for custom on-brand visual assets",
      ],
      mockup: (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Presentation className="w-4 h-4 text-primary" />
              <span>DocGen Studio</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Export Ready
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-background/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                  PPTX
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Board_Briefing_Q3.pptx</div>
                  <div className="text-[10px] text-muted-foreground">8 slides • Formatted executive deck</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                Download .pptx
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[10px] text-muted-foreground">
              <div className="p-2 rounded bg-secondary/50 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Executive Summary.docx</span>
              </div>
              <div className="p-2 rounded bg-secondary/50 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Financial_Model.xlsx</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "multi-tenant",
      badge: "Enterprise Security",
      title: "Isolated Workspaces & Role Control",
      tagline: "Create dedicated workspaces for departments or client accounts with isolated vector vaults and granular role-based permissions.",
      icon: ShieldCheck,
      points: [
        "Granular team roles: Workspace Owner, Bot Manager, Knowledge Base Editor, Support Agent",
        "Complete multi-tenant vector isolation — zero cross-organization data leakage",
        "Comprehensive audit logging for all interactions and data modifications",
      ],
      mockup: (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Layers className="w-4 h-4 text-primary" />
              <span>Workspace Access Matrix</span>
            </div>
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              Role-Based Access
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                  AD
                </div>
                <div>
                  <div className="font-bold text-foreground">Workspace Admin</div>
                  <div className="text-[10px] text-muted-foreground">Full permissions &amp; billing</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-foreground bg-secondary px-2 py-0.5 rounded">
                Owner
              </span>
            </div>

            <div className="p-3 rounded-xl border border-border/80 bg-background/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-bold text-[10px]">
                  BM
                </div>
                <div>
                  <div className="font-bold text-foreground">Bot Manager</div>
                  <div className="text-[10px] text-muted-foreground">Telegram &amp; WhatsApp Channels</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                Manager
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Auto-cycle timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, AUTO_CYCLE_DURATION);

    return () => clearInterval(interval);
  }, [isPaused, tabs.length]);

  return (
    <section id="features-tabbed" className="px-6 py-20 max-w-6xl mx-auto border-t border-border">
      {/* Section Header */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mb-14 text-center max-w-2xl mx-auto space-y-3"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border/80">
          Feature Deep Dive
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Auto-synced intelligence at every layer.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Explore how Redas integrates your documentation, frontline messaging, and automated deliverable generation.
        </p>
      </motion.div>

      {/* Main Tabbed Grid */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Column: Tab Selectors (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-4.5 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col gap-2 ${
                  isActive
                    ? "bg-card border-primary/50 shadow-md"
                    : "bg-card/40 border-border/70 hover:border-border hover:bg-card/70 text-muted-foreground"
                }`}
              >
                {/* Auto-cycle Progress Bar Indicator */}
                {isActive && !isPaused && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTO_CYCLE_DURATION / 1000, ease: "linear" }}
                    className="absolute top-0 left-0 h-[2px] bg-primary"
                  />
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        isActive ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {tab.title}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-semibold">
                      {tab.badge}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Tab Content & Mockup (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={tabs[activeTab].id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full rounded-2xl border border-border bg-card/60 dark:bg-card/40 backdrop-blur-md p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg"
            >
              {/* Top Details */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                  <span>{tabs[activeTab].badge}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {tabs[activeTab].title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {tabs[activeTab].tagline}
                </p>

                {/* Bullet Points */}
                <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                  {tabs[activeTab].points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Mockup Preview Box */}
              <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-secondary/30">
                {tabs[activeTab].mockup}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
