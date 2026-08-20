"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Bot,
  FileText,
  Presentation,
  UploadCloud,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Globe2,
  Sparkles,
  Search,
  ChevronRight,
  TrendingUp,
  Download,
  Users,
  Settings,
  CheckCircle2,
  Layers,
} from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

type PreviewTab = "agents" | "docgen" | "knowledge";

export default function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("agents");

  return (
    <section
      id="product-preview"
      className="w-full min-h-screen flex flex-col justify-center items-center px-6 py-10 md:py-12 border-t border-border"
    >
      <div className="w-full max-w-6xl mx-auto my-auto space-y-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto space-y-2"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            A unified command center for your workspace.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monitor active customer agents, review indexed knowledge, and generate business deliverables from one interface.
          </p>
        </motion.div>

        {/* Tab Switcher Pills */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border">
            <button
              onClick={() => setActiveTab("agents")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "agents"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Omnichannel Agents</span>
            </button>

            <button
              onClick={() => setActiveTab("docgen")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "docgen"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>DocGen Studio</span>
            </button>

            <button
              onClick={() => setActiveTab("knowledge")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "knowledge"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Knowledge Base</span>
            </button>
          </div>
        </div>

        {/* High-Fidelity Dashboard Mockup Window */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="rounded-2xl border border-border bg-card/90 dark:bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-secondary/60 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 font-mono text-[11px] text-muted-foreground hidden sm:inline">
                app.redas.ai/workspace/production
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-foreground">Production Workspace</span>
            </div>
          </div>

          {/* App Body (Sidebar + Content Stage) */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
            {/* Left Sidebar (3 cols) */}
            <aside className="hidden md:flex md:col-span-3 border-r border-border p-4 flex-col justify-between bg-secondary/20">
              <div className="space-y-4">
                {/* Workspace Switcher */}
                <div className="p-2 rounded-lg bg-background border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      R
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground truncate max-w-[110px]">Acme Global</div>
                      <div className="text-[9px] text-muted-foreground">Enterprise Plan</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>

                {/* Nav Links */}
                <nav className="space-y-1 text-xs">
                  <div
                    onClick={() => setActiveTab("agents")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      activeTab === "agents"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span>AI Agents</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("docgen")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      activeTab === "docgen"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Presentation className="w-4 h-4" />
                    <span>DocGen Studio</span>
                  </div>

                  <div
                    onClick={() => setActiveTab("knowledge")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      activeTab === "knowledge"
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Knowledge Vault</span>
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground opacity-60">
                    <Users className="w-4 h-4" />
                    <span>Team &amp; Roles</span>
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground opacity-60">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                </nav>
              </div>

              {/* Usage Mini Widget */}
              <div className="p-3 rounded-xl bg-background border border-border space-y-2">
                <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
                  <span>Monthly Conversations</span>
                  <span className="text-foreground">8,420 / 25,000</span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="w-[34%] h-full bg-primary rounded-full" />
                </div>
              </div>
            </aside>

            {/* Main Stage (9 cols) */}
            <main className="md:col-span-9 p-5 sm:p-6 bg-background/50 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {/* VIEW 1: Omnichannel Agents */}
                {activeTab === "agents" && (
                  <motion.div
                    key="agents"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-[10px] text-muted-foreground font-medium">Active Channels</span>
                        <div className="text-lg font-bold text-foreground">3 Connected</div>
                        <span className="text-[10px] text-emerald-500 font-semibold">● WhatsApp, TG, Web</span>
                      </div>

                      <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-[10px] text-muted-foreground font-medium">Avg. Response Time</span>
                        <div className="text-lg font-bold text-foreground">0.8s</div>
                        <span className="text-[10px] text-emerald-500 font-semibold">99.9% Grounded Accuracy</span>
                      </div>

                      <div className="p-3 rounded-xl border border-border bg-card space-y-1">
                        <span className="text-[10px] text-muted-foreground font-medium">Resolution Rate</span>
                        <div className="text-lg font-bold text-foreground">86.4%</div>
                        <span className="text-[10px] text-primary font-semibold">Autonomous Deflection</span>
                      </div>
                    </div>

                    {/* Live Conversation Stream Simulator */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-border text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-bold text-foreground">Live Customer Thread — WhatsApp</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">ID: #WA-9042</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-secondary/60 text-foreground max-w-[80%] leading-relaxed text-[11px]">
                          &quot;ሰላም! ስለ ምርቶቻችሁ ዋጋና አቅርቦት ማወቅ እፈልጋለሁ።&quot;
                        </div>

                        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-foreground max-w-[90%] ml-auto space-y-1 text-[11px] leading-relaxed">
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary">
                            <Sparkles className="w-3 h-3" /> Grounded from: Pricing_2026.xlsx (Page 1)
                          </div>
                          <p>
                            እንኳን ደህና መጡ! እንደ ሰነዳችን መሰረት 3 የዋጋ አማራጮች አሉን። በChapa በብር መክፈል ይችላሉ።
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 2: DocGen Studio */}
                {activeTab === "docgen" && (
                  <motion.div
                    key="docgen"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">DocGen Studio</h3>
                        <p className="text-[11px] text-muted-foreground">
                          Synthesize workspace data into board presentations, Word briefs, and spreadsheets.
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        Ready for Export
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                            PPTX
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Q3_Executive_Briefing.pptx</div>
                            <div className="text-[10px] text-muted-foreground">8 slides • Charts &amp; financials formatted</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded cursor-pointer">
                          Download .pptx
                        </span>
                      </div>

                      <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                            DOCX
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Support_Audit_Report.docx</div>
                            <div className="text-[10px] text-muted-foreground">4 pages • Executive summary format</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded cursor-pointer">
                          Download .docx
                        </span>
                      </div>

                      <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                            XLSX
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Channel_Performance.xlsx</div>
                            <div className="text-[10px] text-muted-foreground">3 sheets • Clean formulas &amp; breakdown</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded cursor-pointer">
                          Download .xlsx
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 3: Knowledge Base & Files */}
                {activeTab === "knowledge" && (
                  <motion.div
                    key="knowledge"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Workspace Knowledge Vault</h3>
                        <p className="text-[11px] text-muted-foreground">
                          Vector partitions indexed and continuously synced for active agents.
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                        100% Partitioned
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            PDF
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Company_Policies_2026.pdf</div>
                            <div className="text-[10px] text-muted-foreground">142 pages • 850 vector chunks indexed</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-500">Active</span>
                      </div>

                      <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                            URL
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">https://docs.yourbrand.com</div>
                            <div className="text-[10px] text-muted-foreground">38 pages crawled • Live Sync Enabled</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-500">Synced</span>
                      </div>

                      <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                            XLSX
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground">Pricing_and_Inventory.xlsx</div>
                            <div className="text-[10px] text-muted-foreground">3 sheets • 2,400 rows parsed</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-500">Active</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
