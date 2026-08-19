"use client";

import React, { useState } from "react";
import {
  Bot,
  Globe,
  Send,
  MessageSquare,
  Presentation,
  FileText,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Building2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
} from "lucide-react";

export default function ProductShowcase() {
  const [mainMode, setMainMode] = useState<"agents" | "artifacts">("agents");
  const [activeChannel, setActiveChannel] = useState<"web" | "wa" | "tg">("web");
  const [activeArtifact, setActiveArtifact] = useState<"slides" | "report" | "sheet">("slides");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slidesData = [
    {
      title: "Q4 Business & Sales Growth Review",
      bullets: [
        "142% year-over-year revenue expansion across key regional hubs",
        "Average customer support resolution time reduced to under 1.4 minutes",
        "Expansion of manufacturing output in Awash & Hawassa distribution centers",
      ],
      tag: "Slide 1 of 4: Executive Overview",
    },
    {
      title: "Omnichannel Customer Support Metrics",
      bullets: [
        "Website Chat: 48% of total inquiries, resolved 24/7 without human handoff",
        "WhatsApp Business: 34% of inquiries from retail and wholesale buyers",
        "Telegram Bot: 18% of technical inquiries and internal agent queries",
      ],
      tag: "Slide 2 of 4: Channel Distribution",
    },
    {
      title: "Cost Efficiency & Automation ROI",
      bullets: [
        "Support operational overhead reduced by 64% within the first 60 days",
        "Zero hallucination rate maintained across 12,000+ customer conversations",
        "Seamless integration with local payment rails (Chapa, Telebirr, CBE)",
      ],
      tag: "Slide 3 of 4: Operational Impact",
    },
    {
      title: "2026 Strategic Expansion Roadmap",
      bullets: [
        "Deploy automated order dispatch triggers on WhatsApp Cloud API",
        "Integrate ERP inventory sync for instant stock check queries",
        "Scale multi-tenant workspaces to regional partner distributors",
      ],
      tag: "Slide 4 of 4: Strategic Next Steps",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden text-left card-hover">
      {/* Top Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-border bg-secondary/30 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-foreground">
            Redas Interactive Workspace Preview
          </span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            (Workspace: Awash Trading Group)
          </span>
        </div>

        {/* Major Mode Switch: Customer Agents vs Team Artifacts */}
        <div className="flex items-center bg-secondary p-1 rounded-lg border border-border">
          <button
            onClick={() => setMainMode("agents")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              mainMode === "agents"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            1. Customer Support Agents
          </button>
          <button
            onClick={() => setMainMode("artifacts")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
              mainMode === "artifacts"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            2. Team Artifacts &amp; Decks Studio
          </button>
        </div>
      </div>

      {/* MODE 1: CUSTOMER SUPPORT AGENTS */}
      {mainMode === "agents" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Knowledge Sources (4 cols) */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-border bg-secondary/10 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Knowledge Ingestion
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Your Uploaded Documents
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Redas indexes your files and gives verified answers without hallucinations.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-3">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-foreground truncate">
                      Company_Policy_&amp;_SLA.pdf
                    </div>
                    <div className="text-[10px] text-muted-foreground">PDF * 24 Knowledge Chunks</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-3">
                  <FileSpreadsheet className="w-4 h-4 text-primary shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-foreground truncate">
                      Product_Price_List_2026.xlsx
                    </div>
                    <div className="text-[10px] text-muted-foreground">Spreadsheet * 85 Items</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-foreground truncate">
                      https://awashgroup.com/faq
                    </div>
                    <div className="text-[10px] text-muted-foreground">Web Crawl * 12 Pages</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-border bg-card space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Instant Accuracy</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Grounded</span>
              </div>
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* Right Column: Live Omnichannel Chat (8 cols) */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6 bg-card">
            {/* Channel Switcher */}
            <div className="flex flex-wrap items-center justify-between border-b border-border pb-4 gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-foreground">
                  {activeChannel === "web" && "Website Live Chat Widget"}
                  {activeChannel === "wa" && "WhatsApp Business Account (+251 91 144 8920)"}
                  {activeChannel === "tg" && "Telegram Bot (@AwashSupportBot)"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Connected &bull; Active in Awash Trading Workspace
                </div>
              </div>

              <div className="flex items-center bg-secondary p-0.5 rounded-lg border border-border">
                <button
                  onClick={() => setActiveChannel("web")}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold ${
                    activeChannel === "web"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </button>
                <button
                  onClick={() => setActiveChannel("wa")}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold ${
                    activeChannel === "wa"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
                <button
                  onClick={() => setActiveChannel("tg")}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold ${
                    activeChannel === "tg"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram
                </button>
              </div>
            </div>

            {/* Simulated Live Messages */}
            <div className="space-y-4">
              {/* Customer question */}
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-secondary border border-border p-3.5 rounded-2xl rounded-tl-sm text-xs text-foreground leading-relaxed">
                  {activeChannel === "web" &&
                    "How do we pay for our bulk orders, and do you support payment in Birr?"}
                  {activeChannel === "wa" &&
                    "Hello! Can we get the wholesale discount pricing for orders over 50 units?"}
                  {activeChannel === "tg" &&
                    "What is the turnaround time for warranty repairs and hardware replacements?"}
                </div>
              </div>

              {/* Document Citation */}
              <div className="flex justify-start pl-2">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>
                    {activeChannel === "web" && "Grounded in: Company_Policy_&_SLA.pdf (Page 4)"}
                    {activeChannel === "wa" && "Grounded in: Product_Price_List_2026.xlsx (Row 14)"}
                    {activeChannel === "tg" && "Grounded in: https://awashgroup.com/faq (Section 2)"}
                  </span>
                </div>
              </div>

              {/* Bot response */}
              <div className="flex justify-end gap-2.5">
                <div className="max-w-[85%] bg-primary text-primary-foreground p-3.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed font-normal shadow-sm">
                  {activeChannel === "web" &&
                    "Yes, absolutely. We accept payments directly in Ethiopian Birr (ETB) through Chapa, Telebirr, and direct bank transfers. Invoices are generated automatically with official tax receipts."}
                  {activeChannel === "wa" &&
                    "For wholesale orders over 50 units, our standard tier discount is 18% off list price with free regional delivery within 3 business days."}
                  {activeChannel === "tg" &&
                    "Under our warranty SLA, replacement parts are dispatched within 24 hours of claim verification, and on-site repair technicians are scheduled within 2 business days."}
                </div>
                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-foreground" />
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Verified Grounding &bull; Zero Hallucination
              </span>
              <span>Response: &lt; 0.2s</span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: AI ARTIFACTS & PRESENTATION STUDIO (DOCGEN) */}
      {mainMode === "artifacts" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Artifact Type & Prompt (4 cols) */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-border bg-secondary/10 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  DocGen Studio
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  AI Artifacts Generator
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Turn your documents into structured PowerPoint slide decks, reports, and spreadsheets.
                </p>
              </div>

              {/* Artifact Tabs */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveArtifact("slides")}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                    activeArtifact === "slides"
                      ? "bg-card border-foreground text-foreground shadow-sm"
                      : "bg-transparent border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Presentation className="w-4 h-4 text-primary" />
                    <span>PowerPoint Deck (.pptx)</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-70">4 Slides</span>
                </button>

                <button
                  onClick={() => setActiveArtifact("report")}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                    activeArtifact === "report"
                      ? "bg-card border-foreground text-foreground shadow-sm"
                      : "bg-transparent border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>Executive Report (.docx)</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-70">Formatted</span>
                </button>

                <button
                  onClick={() => setActiveArtifact("sheet")}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                    activeArtifact === "sheet"
                      ? "bg-card border-foreground text-foreground shadow-sm"
                      : "bg-transparent border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-primary" />
                    <span>Data Spreadsheet (.xlsx)</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-70">Structured</span>
                </button>
              </div>

              {/* Prompt Box */}
              <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Team Prompt
                </span>
                <p className="text-xs text-foreground italic font-medium leading-relaxed">
                  {activeArtifact === "slides" &&
                    '"Synthesize our Q4 revenue reports into a 4-slide board presentation with metrics and strategic next steps."'}
                  {activeArtifact === "report" &&
                    '"Write a 3-page executive summary analyzing customer response times across WhatsApp, Telegram, and Web widget."'}
                  {activeArtifact === "sheet" &&
                    '"Extract all wholesale tier pricing and discount thresholds into a structured financial table."'}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Supports in-place revisions &amp; direct download</span>
            </div>
          </div>

          {/* Right Column: Live Interactive Slide / Report Viewer (8 cols) */}
          <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-5 bg-card">
            {activeArtifact === "slides" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Slide Header */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Presentation className="w-4 h-4 text-primary" />
                    <span>Q4_Board_Review_AwashTrading.pptx</span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2.5 py-0.5 rounded-md border border-border">
                    {slidesData[currentSlideIndex].tag}
                  </span>
                </div>

                {/* Active Slide Canvas */}
                <div className="p-6 md:p-8 rounded-xl border border-border bg-secondary/30 space-y-4 flex-1 flex flex-col justify-center shadow-inner">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      AWASH TRADING GROUP &bull; 2026
                    </span>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                      {slidesData[currentSlideIndex].title}
                    </h3>
                  </div>

                  <ul className="space-y-2.5 pt-2 text-xs md:text-sm text-foreground/90 leading-relaxed">
                    {slidesData[currentSlideIndex].bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Slide Navigation Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slidesData.length - 1))
                      }
                      className="p-1.5 rounded-md border border-border bg-secondary text-foreground hover:bg-muted transition-colors"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-muted-foreground px-2">
                      Slide {currentSlideIndex + 1} of {slidesData.length}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentSlideIndex((prev) => (prev < slidesData.length - 1 ? prev + 1 : 0))
                      }
                      className="p-1.5 rounded-md border border-border bg-secondary text-foreground hover:bg-muted transition-colors"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Ready to Download .pptx
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeArtifact === "report" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span>Support_Performance_Report_Q4.docx</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">3 Pages &bull; Formatted</span>
                </div>

                <div className="p-5 rounded-xl border border-border bg-secondary/30 space-y-3 text-xs leading-relaxed">
                  <h4 className="font-bold text-sm text-foreground">Executive Overview</h4>
                  <p className="text-muted-foreground">
                    During the fourth quarter of 2025, Awash Trading Group completed the full
                    migration of its customer support pipeline to Redas conversational agents across
                    Website Live Chat, WhatsApp Business, and Telegram.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="p-2.5 rounded bg-card border border-border text-center">
                      <span className="text-[10px] text-muted-foreground block">Inquiries</span>
                      <strong className="text-foreground font-bold">14,280</strong>
                    </div>
                    <div className="p-2.5 rounded bg-card border border-border text-center">
                      <span className="text-[10px] text-muted-foreground block">Automated</span>
                      <strong className="text-foreground font-bold">78.4%</strong>
                    </div>
                    <div className="p-2.5 rounded bg-card border border-border text-center">
                      <span className="text-[10px] text-muted-foreground block">Satisfaction</span>
                      <strong className="text-foreground font-bold">4.8 / 5.0</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
                  <span>Grounded in 12 workspace source files</span>
                  <span className="font-semibold text-foreground">Export as Word (.docx) or PDF</span>
                </div>
              </div>
            )}

            {activeArtifact === "sheet" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-primary" />
                    <span>Regional_Wholesale_Pricing_Matrix.xlsx</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">4 Columns &bull; 85 Rows</span>
                </div>

                <div className="rounded-xl border border-border overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/70 border-b border-border text-muted-foreground text-[10px] uppercase font-bold">
                        <th className="p-2.5">Item Code</th>
                        <th className="p-2.5">Product Description</th>
                        <th className="p-2.5">Base Price (ETB)</th>
                        <th className="p-2.5">Wholesale (&gt;50 Units)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-foreground">
                      <tr className="bg-card">
                        <td className="p-2.5 font-mono">TX-901</td>
                        <td className="p-2.5">Industrial Cotton Fabric (Grade A)</td>
                        <td className="p-2.5">480 ETB / m</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">390 ETB / m</td>
                      </tr>
                      <tr className="bg-card">
                        <td className="p-2.5 font-mono">TX-902</td>
                        <td className="p-2.5">Poly-Blend Heavy Canvas Roll</td>
                        <td className="p-2.5">620 ETB / m</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">510 ETB / m</td>
                      </tr>
                      <tr className="bg-card">
                        <td className="p-2.5 font-mono">TX-905</td>
                        <td className="p-2.5">Refined Yarn Spool (Bulk Box)</td>
                        <td className="p-2.5">1,200 ETB / unit</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">980 ETB / unit</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-muted-foreground">
                  <span>Synthesized directly from inventory records</span>
                  <span className="font-semibold text-foreground">Download as Excel (.xlsx)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
