"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import DarkVeil from "@/components/ui/DarkVeil";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function CtaSection({ userName }: { userName?: string | null }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden isolate border-t border-border">
      {/* Reverted / Flipped DarkVeil Background to Mirror & Close the Hero Section */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-100 scale-y-[-1]"
      >
        <DarkVeil
          speed={0.4}
          warpAmount={0.3}
          noiseIntensity={0.02}
          scanlineIntensity={isDark ? 0.06 : 0.02}
          scanlineFrequency={2.0}
          hueShift={0}
          invert={!isDark}
          resolutionScale={1}
        />
      </div>

      {/* Main Closing Call to Action (Vertically Centered) */}
      <div className="relative z-10 w-full px-6 pt-24 pb-12 flex flex-col items-center text-center max-w-4xl mx-auto my-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="space-y-5 max-w-2xl mx-auto flex flex-col items-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/80 backdrop-blur-sm px-3.5 py-1 text-[11px] font-semibold text-muted-foreground"
          >
            <Sparkles className="w-3 h-3 text-foreground" />
            <span>Get Started in 5 Minutes</span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]"
          >
            Your Knowledge Is Already There.{" "}
            <span className="text-zinc-600 dark:text-zinc-400">Let Redas Put It to Work.</span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl font-normal"
          >
            Create your workspace in minutes, connect your first document, and deploy intelligent agents across all your customer and operational channels.
          </motion.p>

          <motion.div variants={fadeInUp} className="pt-2">
            <Button size="lg" className="h-11 px-7 rounded-md font-semibold text-sm group shadow-sm" asChild>
              <Link
                href={userName ? "/dashboard" : "/register"}
                className="flex items-center gap-2"
              >
                <span>{userName ? "Go to Dashboard" : "Start Free Trial"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Seamless Integrated Closing Footer without dividing box or border */}
      <footer className="relative z-10 w-full bg-transparent pt-6 pb-6 text-xs mt-auto">
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
              AI agents trained on your business documents — deployed to your website, WhatsApp, and
              Telegram, billed in Birr.
            </p>
          </div>

          <nav className="flex flex-wrap gap-5 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>
        </div>

        <div className="max-w-5xl mx-auto px-6 mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-medium text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Redas. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}
