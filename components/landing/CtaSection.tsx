"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import DarkVeil from "@/components/ui/DarkVeil";
import { useTranslations } from "next-intl";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function CtaSection({ userName }: { userName?: string | null }) {
  const t = useTranslations("landing.cta");
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("landing.footer");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";
  const authHref = userName ? "/dashboard" : "/signup";

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between items-center overflow-hidden isolate pt-12">
      {/* DarkVeil Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-100 scale-y-[-1] [mask-image:linear-gradient(to_top,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_85%,transparent_100%)]"
      >
        <DarkVeil
          speed={0.35}
          warpAmount={0.3}
          noiseIntensity={0.02}
          scanlineIntensity={isDark ? 0.06 : 0.01}
          scanlineFrequency={2.0}
          hueShift={0}
          invert={!isDark}
          resolutionScale={1}
        />
      </div>

      {/* Smooth Seamless Top Gradient Bridge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 sm:h-60 bg-gradient-to-b from-[#fafafa] dark:from-background via-[#fafafa]/80 dark:via-background/80 to-transparent z-10"
      />

      {/* Central Ambient Radial Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.08),_rgba(139,92,246,0.04),_transparent_70%)] opacity-100 dark:opacity-40 z-0"
      />

      {/* Main Closing Call to Action Container */}
      <div className="relative z-20 w-full px-6 pt-16 sm:pt-20 md:pt-24 pb-12 flex flex-col items-center text-center max-w-4xl mx-auto my-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="space-y-6 max-w-2xl mx-auto flex flex-col items-center"
        >
          {/* Top Pill Kicker */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 text-foreground select-none shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{t("kicker")}</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]"
          >
            {t("title_part1")}{" "}
            <span className="text-zinc-500 dark:text-zinc-400">{t("title_part2")}</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-normal"
          >
            {t("subtitle")}
          </motion.p>

          {/* Dual Action Buttons */}
          <motion.div
            variants={fadeInUp}
            className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <Link
              href={authHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all shadow-md group"
            >
              <span>{userName ? tNav("dashboard") : t("primary_btn")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#use-cases"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-7 py-3.5 bg-zinc-200/70 dark:bg-zinc-900 hover:bg-zinc-300/80 dark:hover:bg-zinc-800 text-foreground font-semibold text-sm transition-colors border-0"
            >
              <span>{t("secondary_btn")}</span>
            </Link>
          </motion.div>

          {/* Value Highlights */}
          <motion.div
            variants={fadeInUp}
            className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground font-medium"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>2-minute setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Multi-channel ready</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Seamless Integrated Closing Footer */}
      <footer className="relative z-20 w-full bg-transparent pt-8 pb-6 text-xs mt-auto">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/redas_icon.png"
                className="w-5 h-5 object-contain shrink-0 rounded"
                alt="Redas logo"
              />
              <span className="text-sm font-bold tracking-tight text-foreground">Redas</span>
            </div>
            <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
              {tFooter("desc")}
            </p>
          </div>

          <nav className="flex flex-wrap gap-5 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              {tNav("features")}
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              {tNav("how_it_works")}
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              {tNav("pricing")}
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-medium text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Redas. {tFooter("copyright")}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}
