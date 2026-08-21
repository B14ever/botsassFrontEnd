"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Geometric Visual 1: Customer Support Hub (Concentric Radar Lens)
function SupportLensVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center select-none relative p-2">
      <svg className="w-full h-full max-w-[240px] max-h-[150px]" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="140" y1="10" x2="140" y2="190" className="stroke-border/40" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="40" y1="100" x2="240" y2="100" className="stroke-border/40" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="65" y1="35" x2="215" y2="165" className="stroke-border/25" strokeWidth="1" />
        <line x1="65" y1="165" x2="215" y2="35" className="stroke-border/25" strokeWidth="1" />
        <circle cx="140" cy="100" r="75" className="stroke-border/50" strokeWidth="1.5" />
        <circle cx="140" cy="100" r="48" className="stroke-primary/30" strokeWidth="1.5" strokeDasharray="6 4" />
        <circle cx="140" cy="100" r="26" className="fill-secondary/60 stroke-primary/70" strokeWidth="1.5" />
        <circle cx="140" cy="100" r="9" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
        <circle cx="140" cy="100" r="3.5" className="fill-primary" />
        <circle cx="140" cy="25" r="4" className="fill-emerald-500" />
        <circle cx="215" cy="100" r="4" className="fill-primary" />
        <circle cx="140" cy="175" r="4" className="fill-muted-foreground/60" />
        <circle cx="65" cy="100" r="4" className="fill-muted-foreground/60" />
      </svg>
    </div>
  );
}

// Geometric Visual 2: Sales Pipeline Stream
function SalesStreamVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center select-none relative p-2">
      <svg className="w-full h-full max-w-[240px] max-h-[150px]" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="30" y1="40" x2="250" y2="40" className="stroke-border/30" strokeWidth="1" />
        <line x1="30" y1="100" x2="250" y2="100" className="stroke-border/30" strokeWidth="1" />
        <line x1="30" y1="160" x2="250" y2="160" className="stroke-border/30" strokeWidth="1" />
        <path d="M40 60 C 90 60, 110 100, 160 100" className="stroke-primary/40" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M40 140 C 90 140, 110 100, 160 100" className="stroke-primary/40" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M160 100 L 230 100" className="stroke-primary" strokeWidth="2" />
        <rect x="40" y="46" width="26" height="26" rx="6" className="fill-secondary/60 stroke-border/70" strokeWidth="1.5" />
        <rect x="40" y="126" width="26" height="26" rx="6" className="fill-secondary/60 stroke-border/70" strokeWidth="1.5" />
        <circle cx="160" cy="100" r="20" className="fill-secondary/80 stroke-primary" strokeWidth="1.5" />
        <circle cx="160" cy="100" r="7" className="fill-primary" />
        <rect x="220" y="87" width="26" height="26" rx="6" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <circle cx="233" cy="100" r="3.5" className="fill-emerald-500" />
      </svg>
    </div>
  );
}

// Geometric Visual 3: Layered Knowledge Vault
function KnowledgeVaultVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center select-none relative p-2">
      <svg className="w-full h-full max-w-[240px] max-h-[150px]" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="140" y1="20" x2="140" y2="180" className="stroke-border/30" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="30" y1="100" x2="250" y2="100" className="stroke-border/30" strokeWidth="1" strokeDasharray="2 2" />
        <rect x="70" y="125" width="140" height="34" rx="8" className="fill-secondary/40 stroke-border/60" strokeWidth="1.5" />
        <line x1="85" y1="142" x2="155" y2="142" className="stroke-muted-foreground/40" strokeWidth="2" strokeLinecap="round" />
        <rect x="60" y="85" width="160" height="34" rx="8" className="fill-secondary/60 stroke-border/80" strokeWidth="1.5" />
        <line x1="75" y1="102" x2="175" y2="102" className="stroke-muted-foreground/60" strokeWidth="2" strokeLinecap="round" />
        <rect x="50" y="45" width="180" height="34" rx="8" className="fill-card stroke-primary" strokeWidth="1.5" />
        <circle cx="70" cy="62" r="4.5" className="fill-primary" />
        <line x1="85" y1="62" x2="195" y2="62" className="stroke-primary/70" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// Geometric Visual 4: Structured DocGen & Reports
function DocGenVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center select-none relative p-2">
      <svg className="w-full h-full max-w-[240px] max-h-[150px]" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="25" width="160" height="150" rx="10" className="fill-secondary/40 stroke-border" strokeWidth="1.5" />
        <rect x="75" y="40" width="60" height="9" rx="3.5" className="fill-primary/60" />
        <rect x="175" y="40" width="30" height="9" rx="3.5" className="fill-muted-foreground/30" />
        <line x1="75" y1="60" x2="205" y2="60" className="stroke-border/70" strokeWidth="1" />
        <rect x="75" y="72" width="130" height="22" rx="4" className="fill-secondary/70 stroke-border/50" strokeWidth="1" />
        <line x1="85" y1="83" x2="135" y2="83" className="stroke-muted-foreground/60" strokeWidth="2" strokeLinecap="round" />
        <circle cx="190" cy="83" r="3.5" className="fill-emerald-500" />
        <rect x="75" y="102" width="130" height="22" rx="4" className="fill-secondary/70 stroke-border/50" strokeWidth="1" />
        <line x1="85" y1="113" x2="150" y2="113" className="stroke-muted-foreground/60" strokeWidth="2" strokeLinecap="round" />
        <circle cx="190" cy="113" r="3.5" className="fill-primary" />
        <rect x="75" y="132" width="130" height="20" rx="4" className="fill-secondary/50 stroke-border/40" strokeWidth="1" />
        <line x1="85" y1="142" x2="125" y2="142" className="stroke-muted-foreground/40" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function UseCasesSection({ userName }: { userName?: string | null }) {
  const t = useTranslations("landing.use_cases");
  const [activeIndex, setActiveIndex] = useState(0);
  const authHref = userName ? "/dashboard" : "/signup";

  const useCases = [
    {
      number: "01",
      title: t("uc1_title"),
      tagline: "Support & Triage · Web & WhatsApp",
      description: t("uc1_desc"),
      badge: "01 / 04",
      metricLabel: t("uc1_title"),
      metricValue: t("uc1_metric"),
      visual: <SupportLensVisual />,
    },
    {
      number: "02",
      title: t("uc2_title"),
      tagline: "Growth & Pipeline · Telegram & Web",
      description: t("uc2_desc"),
      badge: "02 / 04",
      metricLabel: t("uc2_title"),
      metricValue: t("uc2_metric"),
      visual: <SalesStreamVisual />,
    },
    {
      number: "03",
      title: t("uc3_title"),
      tagline: "Team Operations · PDFs & Docs",
      description: t("uc3_desc"),
      badge: "03 / 04",
      metricLabel: t("uc3_title"),
      metricValue: t("uc3_metric"),
      visual: <KnowledgeVaultVisual />,
    },
    {
      number: "04",
      title: "Automated Deliverables",
      tagline: "Executive Workflows · Export Ready",
      description:
        "Turn workspace data and discussions into clean executive summaries, spreadsheets, and presentation decks.",
      badge: "04 / 04",
      metricLabel: "DocGen Flow",
      metricValue: "1-click slides & spreadsheets",
      visual: <DocGenVisual />,
    },
  ];

  const currentCase = useCases[activeIndex];

  return (
    <section
      id="use-cases"
      className="w-full flex flex-col justify-center items-center px-4 sm:px-6 pt-12 pb-20 md:pt-16 md:pb-28 relative z-10"
    >
      <div className="w-full max-w-6xl mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 lg:sticky lg:top-28">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="space-y-4"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.12]">
                {t("title")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("subtitle")}
              </p>
              <div className="pt-1">
                <Link
                  href={authHref}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors group"
                >
                  <span>{t("title")}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Dynamic Active Preview Card */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="w-full"
            >
              <Link
                href={authHref}
                className="block w-full h-[310px] sm:h-[330px] rounded-2xl bg-white/95 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-foreground/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono select-none z-10 shrink-0">
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 font-medium text-[11px] text-foreground">
                    {currentCase.badge}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1 font-medium">
                    <span>Deploy Workflow</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>

                <div className="flex-1 w-full flex items-center justify-center my-1 relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {currentCase.visual}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-xs z-10 shrink-0">
                  <span className="font-medium text-foreground truncate max-w-[150px] sm:max-w-[180px]">
                    {currentCase.metricLabel}
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50 text-[11px] shrink-0">
                    {currentCase.metricValue}
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-4">
            {useCases.map((uc, index) => {
              const isActive = activeIndex === index;
              return (
                <motion.div
                  key={uc.number}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={fadeInUp}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-2xl p-6 sm:p-7 border transition-all cursor-pointer select-none ${
                    isActive
                      ? "bg-white dark:bg-zinc-900/90 border-zinc-300 dark:border-zinc-700 shadow-md"
                      : "bg-white/50 dark:bg-zinc-900/30 hover:bg-white/80 dark:hover:bg-zinc-900/50 border-zinc-200/60 dark:border-zinc-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-muted-foreground">
                          {uc.number}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                          {uc.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                        {uc.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
