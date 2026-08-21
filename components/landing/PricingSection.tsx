"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PricingSection({ userName }: { userName?: string | null }) {
  const t = useTranslations("landing.pricing");
  const tNav = useTranslations("nav");
  const [selectedCadence, setSelectedCadence] = useState<"annual" | "monthly">("annual");
  const [selectedTier, setSelectedTier] = useState<"standard" | "pro">("standard");

  const authHref = userName ? "/dashboard" : "/signup";

  const tierData = {
    standard: {
      name: t("standard_tab"),
      annualMonthlyPrice: "1,200",
      annualTotal: "14,400",
      monthlyPrice: "1,500",
      savings: t("save_badge"),
      summary: t("standard_summary"),
    },
    pro: {
      name: t("pro_tab"),
      annualMonthlyPrice: "3,040",
      annualTotal: "36,480",
      monthlyPrice: "3,800",
      savings: t("save_badge"),
      summary: t("pro_summary"),
    },
  };

  const currentTier = tierData[selectedTier];

  return (
    <section
      id="pricing"
      className="w-full flex flex-col justify-center items-center px-4 sm:px-6 pt-24 pb-12 sm:pt-32 sm:pb-16 relative z-10"
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Kicker */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3 select-none"
        >
          {t("kicker")}
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] max-w-2xl"
        >
          {t("title")}
        </motion.h2>

        {/* Subhead */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-sm sm:text-base text-muted-foreground max-w-lg mt-4 mb-8 leading-relaxed font-normal"
        >
          {t("subhead")}
        </motion.p>

        {/* Plan Tier Selector Tabs (Standard vs Pro) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="inline-flex p-1 rounded-full bg-zinc-200/70 dark:bg-zinc-900/80 mb-8 border-0 shadow-xs"
        >
          <button
            onClick={() => setSelectedTier("standard")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedTier === "standard"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("standard_tab")}
          </button>
          <button
            onClick={() => setSelectedTier("pro")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedTier === "pro"
                ? "bg-foreground text-background shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("pro_tab")}
          </button>
        </motion.div>

        {/* 2-Card Cadence Selector Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl"
        >
          {/* Card 1: Annual */}
          <div
            onClick={() => setSelectedCadence("annual")}
            className={`relative rounded-2xl p-6 cursor-pointer border-0 transition-all ${
              selectedCadence === "annual"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
                : "bg-zinc-100/90 dark:bg-[#141416]/90 backdrop-blur-md text-foreground hover:bg-zinc-200/80 dark:hover:bg-[#18181b]"
            }`}
          >
            <div
              className={`absolute -top-3 left-5 text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs select-none border-0 ${
                selectedCadence === "annual"
                  ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-900 dark:text-zinc-100"
                  : "bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-200"
              }`}
            >
              {currentTier.savings}
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  {t("annual_tab")}
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight">
                  {currentTier.annualMonthlyPrice} {t("currency")}
                </div>
                <div
                  className={`mt-1 text-xs ${
                    selectedCadence === "annual"
                      ? "text-zinc-400 dark:text-zinc-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {currentTier.annualMonthlyPrice} {t("currency")} {t("per_month")}, {t("billed_annually", { total: currentTier.annualTotal })}
                </div>
              </div>

              <div className="mt-0.5">
                {selectedCadence === "annual" ? (
                  <div className="w-6 h-6 rounded-full bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Monthly */}
          <div
            onClick={() => setSelectedCadence("monthly")}
            className={`relative rounded-2xl p-6 cursor-pointer border-0 transition-all ${
              selectedCadence === "monthly"
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
                : "bg-zinc-100/90 dark:bg-[#141416]/90 backdrop-blur-md text-foreground hover:bg-zinc-200/80 dark:hover:bg-[#18181b]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  {t("monthly_tab")}
                </div>
                <div className="mt-3 text-3xl font-bold tracking-tight">
                  {currentTier.monthlyPrice} {t("currency")}
                </div>
                <div
                  className={`mt-1 text-xs ${
                    selectedCadence === "monthly"
                      ? "text-zinc-400 dark:text-zinc-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {t("billed_monthly")}
                </div>
              </div>

              <div className="mt-0.5">
                {selectedCadence === "monthly" ? (
                  <div className="w-6 h-6 rounded-full bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-200/80 dark:bg-zinc-800" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature summary */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-xs text-muted-foreground mt-6 font-medium"
        >
          {currentTier.summary} · Grounded RAG Search
        </motion.div>

        {/* Payment note */}
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-xs text-muted-foreground max-w-lg mt-4 leading-relaxed"
        >
          {t("payment_note")}
        </motion.p>

        {/* Big Rounded Pill CTA Button */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="mt-6"
        >
          <Link
            href={authHref}
            className="inline-flex items-center justify-center rounded-full px-9 py-3.5 bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all shadow-md"
          >
            {userName ? tNav("dashboard") : t("cta")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
