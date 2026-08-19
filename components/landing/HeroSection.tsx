"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import DarkVeil from "@/components/ui/DarkVeil";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function DotGridBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(circle, color-mix(in srgb, var(--foreground) 15%, transparent) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black, transparent 75%)",
      }}
    />
  );
}

export default function HeroSection({ userName }: { userName?: string | null }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden isolate">
      {/* DarkVeil Full Hero Canvas Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-100"
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

      <div className="relative z-10 w-full px-6 py-12 flex flex-col items-center text-center max-w-5xl mx-auto my-auto">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] text-foreground max-w-4xl"
          >
            The AI Operating System{" "}
            <br className="hidden sm:inline" />
            <span className="text-zinc-600 dark:text-zinc-400">
              for Your Workspace.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed"
          >
            Deploy conversational AI agents across your website and messaging apps. Automate customer
            support and generate business deliverables in seconds.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={fadeInUp}
            className="mt-6 flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="h-11 px-6 rounded-md font-semibold text-sm group w-full sm:w-auto shadow-sm"
              asChild
            >
              <Link
                href={userName ? "/dashboard" : "/register"}
                className="flex items-center justify-center gap-2"
              >
                {userName ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 rounded-md font-semibold text-sm border-border text-foreground hover:bg-secondary/60 w-full sm:w-auto backdrop-blur-sm"
              asChild
            >
              <a href="#how-it-works">Book a Demo</a>
            </Button>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium"
          >
            <span>
              Trusted by teams managing support, sales, and internal knowledge across 50+ organizations
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
