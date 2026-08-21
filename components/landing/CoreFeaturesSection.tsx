"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PixelBlast from "@/components/ui/PixelBlast";
import { useTranslations } from "next-intl";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Vector 1: Build Agents (Agent Orchestration & Roles)
function BuildAgentsVector() {
  return (
    <div className="w-full h-full p-6 flex items-center justify-center relative overflow-hidden select-none">
      {/* Ambient Glow */}
      <div className="absolute w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <svg className="w-full h-full max-w-[340px] max-h-[240px]" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Grid Pattern */}
        <defs>
          <pattern id="grid-pattern-1" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-border/50" />
          </pattern>
        </defs>
        <rect width="340" height="240" fill="url(#grid-pattern-1)" opacity="0.6" />

        {/* Orbit Rings */}
        <circle cx="170" cy="120" r="75" className="stroke-border/70" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="170" cy="120" r="42" className="stroke-primary/30" strokeWidth="1.5" />

        {/* Connector Lines */}
        <line x1="170" y1="120" x2="85" y2="65" className="stroke-primary/40" strokeWidth="1.5" />
        <line x1="170" y1="120" x2="255" y2="65" className="stroke-primary/40" strokeWidth="1.5" />
        <line x1="170" y1="120" x2="170" y2="195" className="stroke-primary/40" strokeWidth="1.5" />

        {/* Central Core Agent Node */}
        <circle cx="170" cy="120" r="26" className="fill-background stroke-primary" strokeWidth="2" />
        <circle cx="170" cy="120" r="14" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
        <circle cx="170" cy="120" r="5" className="fill-primary" />

        {/* Role Node 1: Support (Top Left) */}
        <g>
          <rect x="35" y="45" width="100" height="36" rx="18" className="fill-card stroke-border shadow-sm" strokeWidth="1.5" />
          <circle cx="53" cy="63" r="6" className="fill-emerald-500" />
          <text x="67" y="67" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">Support Bot</text>
        </g>

        {/* Role Node 2: Sales (Top Right) */}
        <g>
          <rect x="205" y="45" width="100" height="36" rx="18" className="fill-card stroke-border shadow-sm" strokeWidth="1.5" />
          <circle cx="223" cy="63" r="6" className="fill-blue-500" />
          <text x="237" y="67" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">Sales Bot</text>
        </g>

        {/* Role Node 3: Operations (Bottom) */}
        <g>
          <rect x="120" y="175" width="100" height="36" rx="18" className="fill-card stroke-border shadow-sm" strokeWidth="1.5" />
          <circle cx="138" cy="193" r="6" className="fill-amber-500" />
          <text x="152" y="197" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">Ops Bot</text>
        </g>
      </svg>
    </div>
  );
}

// Vector 2: Connect Knowledge (Multi-Source Vector Ingestion)
function ConnectKnowledgeVector() {
  return (
    <div className="w-full h-full p-6 flex items-center justify-center relative overflow-hidden select-none">
      {/* Ambient Glow */}
      <div className="absolute w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <svg className="w-full h-full max-w-[340px] max-h-[240px]" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Source Badges (Left Column) */}
        <g>
          {/* PDF Source */}
          <rect x="25" y="40" width="85" height="32" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
          <text x="40" y="60" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">PDF Docs</text>

          {/* Sheets Source */}
          <rect x="25" y="104" width="85" height="32" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
          <text x="36" y="124" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">Sheets / CSV</text>

          {/* Web Source */}
          <rect x="25" y="168" width="85" height="32" rx="8" className="fill-card stroke-border" strokeWidth="1.5" />
          <text x="35" y="188" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">Web URLs</text>
        </g>

        {/* Vector Flow Streams into Vault */}
        <path d="M110 56 C 160 56, 170 120, 210 120" className="stroke-primary/60" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M110 120 L 210 120" className="stroke-primary/60" strokeWidth="1.5" />
        <path d="M110 184 C 160 184, 170 120, 210 120" className="stroke-primary/60" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Central Vector Database / Knowledge Vault */}
        <g>
          <rect x="210" y="70" width="105" height="100" rx="16" className="fill-card stroke-primary/50 shadow-md" strokeWidth="2" />
          
          {/* Vault Layers */}
          <rect x="225" y="88" width="75" height="16" rx="4" className="fill-secondary stroke-border" strokeWidth="1" />
          <rect x="225" y="112" width="75" height="16" rx="4" className="fill-secondary stroke-border" strokeWidth="1" />
          <rect x="225" y="136" width="75" height="16" rx="4" className="fill-primary/20 stroke-primary/40" strokeWidth="1" />

          {/* Vector Status Tag */}
          <circle cx="290" cy="80" r="4" className="fill-emerald-500" />
        </g>
      </svg>
    </div>
  );
}

// Vector 3: Deploy Anywhere (Omnichannel Broadcast Gateway)
function DeployAnywhereVector() {
  return (
    <div className="w-full h-full p-6 flex items-center justify-center relative overflow-hidden select-none">
      {/* Ambient Glow */}
      <div className="absolute w-40 h-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <svg className="w-full h-full max-w-[340px] max-h-[240px]" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Core Dispatcher Node (Left) */}
        <g>
          <circle cx="70" cy="120" r="32" className="fill-card stroke-primary" strokeWidth="2" />
          <circle cx="70" cy="120" r="18" className="fill-primary/20" />
          <circle cx="70" cy="120" r="6" className="fill-primary" />
        </g>

        {/* Radiating Signal Waves */}
        <path d="M110 95 C 130 100, 130 140, 110 145" className="stroke-primary/50" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M125 80 C 150 90, 150 150, 125 160" className="stroke-primary/30" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Branch Lines to Channels */}
        <line x1="102" y1="120" x2="200" y2="55" className="stroke-border" strokeWidth="1.5" />
        <line x1="102" y1="120" x2="200" y2="120" className="stroke-border" strokeWidth="1.5" />
        <line x1="102" y1="120" x2="200" y2="185" className="stroke-border" strokeWidth="1.5" />

        {/* Channel 1: WhatsApp (Top Right) */}
        <g>
          <rect x="200" y="38" width="115" height="34" rx="17" className="fill-card stroke-border" strokeWidth="1.5" />
          <circle cx="218" cy="55" r="5" className="fill-emerald-500" />
          <text x="232" y="59" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">WhatsApp</text>
        </g>

        {/* Channel 2: Telegram (Middle Right) */}
        <g>
          <rect x="200" y="103" width="115" height="34" rx="17" className="fill-card stroke-border" strokeWidth="1.5" />
          <circle cx="218" cy="120" r="5" className="fill-blue-500" />
          <text x="232" y="124" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">Telegram</text>
        </g>

        {/* Channel 3: Web Widget (Bottom Right) */}
        <g>
          <rect x="200" y="168" width="115" height="34" rx="17" className="fill-card stroke-border" strokeWidth="1.5" />
          <circle cx="218" cy="185" r="5" className="fill-primary" />
          <text x="232" y="189" className="fill-foreground text-[11px] font-semibold" fontFamily="inherit">Web Widget</text>
        </g>
      </svg>
    </div>
  );
}

// Vector 4: Automate Workflows (Execution Pipeline)
function AutomateWorkflowsVector() {
  return (
    <div className="w-full h-full p-6 flex items-center justify-center relative overflow-hidden select-none">
      {/* Ambient Glow */}
      <div className="absolute w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <svg className="w-full h-full max-w-[340px] max-h-[240px]" viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Step 1: Trigger Event */}
        <g>
          <rect x="20" y="90" width="80" height="60" rx="12" className="fill-card stroke-border" strokeWidth="1.5" />
          <text x="36" y="115" className="fill-muted-foreground text-[9px] font-mono uppercase" fontFamily="inherit">Trigger</text>
          <text x="33" y="133" className="fill-foreground text-[10px] font-bold" fontFamily="inherit">New Query</text>
        </g>

        {/* Step 1 to 2 Arrow */}
        <path d="M100 120 L 135 120" className="stroke-primary" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

        {/* Step 2: Agent Reasoning / Decision */}
        <g>
          <rect x="135" y="80" width="85" height="80" rx="14" className="fill-card stroke-primary/60 shadow-sm" strokeWidth="2" />
          <circle cx="177" cy="108" r="12" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
          <circle cx="177" cy="108" r="4" className="fill-primary" />
          <text x="146" y="142" className="fill-foreground text-[10px] font-semibold" fontFamily="inherit">Action Logic</text>
        </g>

        {/* Step 2 to 3 Arrow */}
        <path d="M220 120 L 250 120" className="stroke-primary" strokeWidth="1.5" />

        {/* Step 3: Executed Action Output */}
        <g>
          <rect x="250" y="90" width="75" height="60" rx="12" className="fill-card stroke-emerald-500/50" strokeWidth="1.5" />
          <circle cx="287" cy="110" r="7" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="1.5" />
          <path d="M284 110 L 286 112 L 291 107" className="stroke-emerald-500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="260" y="134" className="fill-foreground text-[9px] font-bold" fontFamily="inherit">Auto Result</text>
        </g>
      </svg>
    </div>
  );
}

export default function CoreFeaturesSection() {
  const t = useTranslations("landing.core_features");
  const tCommon = useTranslations("common");
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  const features = [
    {
      id: "build-agents",
      title: t("f1_title"),
      desc: t("f1_desc"),
      href: "/signup",
      vector: <BuildAgentsVector />,
    },
    {
      id: "connect-knowledge",
      title: t("f2_title"),
      desc: t("f2_desc"),
      href: "/signup",
      vector: <ConnectKnowledgeVector />,
    },
    {
      id: "deploy-anywhere",
      title: t("f3_title"),
      desc: t("f3_desc"),
      href: "/signup",
      vector: <DeployAnywhereVector />,
    },
    {
      id: "automate-workflows",
      title: t("f4_title"),
      desc: t("f4_desc"),
      href: "/signup",
      vector: <AutomateWorkflowsVector />,
    },
  ];

  return (
    <section
      id="features"
      className="w-full flex flex-col justify-center items-center px-4 sm:px-6 pt-24 pb-20 md:pt-32 md:pb-32 relative z-10 overflow-hidden isolate"
    >
      {/* PixelBlast Full Section Animated Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40 overflow-hidden select-none z-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]"
      >
        <PixelBlast
          variant="circle"
          pixelSize={5}
          color={isDark ? "#8b5cf6" : "#7c3aed"}
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>

      {/* Seamless Multi-Stop Top Gradient Bridge from Hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 sm:h-64 bg-gradient-to-b from-[#fafafa] dark:from-background via-[#fafafa]/85 dark:via-background/85 to-transparent z-10"
      />

      {/* Seamless Multi-Stop Bottom Gradient Bridge to How It Works / Use Cases */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 sm:h-64 bg-gradient-to-b from-transparent via-[#fafafa]/85 dark:via-background/85 to-[#fafafa] dark:to-background z-10"
      />

      <div className="w-full max-w-6xl mx-auto space-y-12 md:space-y-20 relative z-20">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto space-y-3 relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
        </motion.div>

        {/* Alternating Zig-Zag Feature Rows with Connecting Line */}
        <div className="relative space-y-24 md:space-y-36">
          {/* Continuous Center Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-border/80 to-transparent pointer-events-none z-0" />

          {/* Continuous Left Track Line (Mobile) */}
          <div className="md:hidden absolute left-4 top-8 bottom-8 w-[2px] bg-gradient-to-b from-transparent via-border/60 to-transparent pointer-events-none z-0" />

          {features.map((feature, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div key={feature.id} className="relative z-10">
                {/* Connecting Step Node on the Line (Desktop) */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background border-2 border-primary/50 shadow-sm items-center justify-center z-20"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </motion.div>

                {/* 2-Column Zig-Zag Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 lg:gap-24 items-center">
                  {/* Visual Vector Container with Slide + Scale Transition */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.015, y: -4 }}
                    className={`w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] rounded-2xl md:rounded-3xl bg-white/90 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-none overflow-hidden flex items-center justify-center transition-all ${
                      isEven ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    {feature.vector}
                  </motion.div>

                  {/* Text Content Block with Staggered Slide Transition */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={`space-y-5 flex flex-col items-start ${
                      isEven ? "md:order-2 md:pl-6" : "md:order-1 md:pr-6"
                    }`}
                  >
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                        {feature.desc}
                      </p>
                    </div>

                    {/* Rounded Pill Learn More Button with Hover Animation */}
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        asChild
                        className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium text-xs sm:text-sm px-5 py-2 h-9 sm:h-10 inline-flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Link href={feature.href} aria-label={`Learn more about ${feature.title}`}>
                          <span>{tCommon("learn_more")}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
