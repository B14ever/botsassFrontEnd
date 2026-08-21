"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function HowItWorksSection({ userName }: { userName?: string | null }) {
  const t = useTranslations("landing.how_it_works");
  const authHref = userName ? "/dashboard" : "/signup";

  const cards = [
    {
      step: 1,
      title: t("step1_title"),
      sublink: t("step1_sublink"),
      items: [
        t("step1_items.0"),
        t("step1_items.1"),
        t("step1_items.2"),
        t("step1_items.3"),
      ],
    },
    {
      step: 2,
      title: t("step2_title"),
      sublink: t("step2_sublink"),
      items: [
        t("step2_items.0"),
        t("step2_items.1"),
        t("step2_items.2"),
        t("step2_items.3"),
      ],
    },
    {
      step: 3,
      title: t("step3_title"),
      sublink: t("step3_sublink"),
      items: [
        t("step3_items.0"),
        t("step3_items.1"),
        t("step3_items.2"),
        t("step3_items.3"),
      ],
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full flex flex-col justify-center items-center px-4 sm:px-6 pt-20 pb-12 md:pt-28 md:pb-16 relative z-10"
    >
      <div className="w-full max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Centered Heading with Ultra-Light Typography */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground">
            {t("title")}
          </h2>
        </motion.div>

        {/* 3-Column Card Grid (Clean, Translucent Glass Surfaces to let Orb Shine Through) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map((card) => (
            <motion.div
              key={card.step}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-white/75 dark:bg-zinc-900/40 hover:bg-white/90 dark:hover:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/40 p-7 sm:p-8 flex flex-col justify-between h-[450px] sm:h-[470px] relative overflow-hidden group shadow-2xs hover:shadow-sm transition-all"
            >
              {/* Top Header Block */}
              <div className="space-y-5 relative z-10">
                {/* Step Number Badge */}
                <div className="w-7 h-7 rounded-full bg-foreground text-background font-normal text-xs flex items-center justify-center select-none shadow-2xs">
                  {card.step}
                </div>

                {/* Card Title (Ultra-Light Display Font) */}
                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground leading-tight">
                  {card.title}
                </h3>

                {/* Sublink with Arrow */}
                <div>
                  <Link
                    href={authHref}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-light text-muted-foreground group-hover:text-foreground transition-colors tracking-wide"
                  >
                    <span>{card.sublink}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Bottom Feature List (Ultra-Light Typography, No divider lines) */}
              <div className="relative z-10 space-y-2.5 pt-6">
                {card.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs sm:text-sm font-light text-muted-foreground leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
