"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  LayoutDashboard,
  Building2,
  Bot,
  Activity,
  User,
  Sparkles,
  CreditCard,
  Plus,
  Search,
  MessageSquare,
  ChevronDown,
  LineChart as LineIcon,
  Settings,
} from "lucide-react";
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

const SLIDE_DURATION_MS = 5000;

export default function HeroSection({ userName }: { userName?: string | null }) {
  const tLanding = useTranslations("landing.hero");
  const tNav = useTranslations("nav");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Continuous auto-sliding carousel (Dashboard -> Agents -> Workspaces)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(interval);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <section className="relative w-full flex flex-col justify-start items-center overflow-visible isolate">
      {/* DarkVeil Full Hero Canvas Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-25 dark:opacity-100 [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)]"
      >
        <DarkVeil
          speed={0.4}
          warpAmount={0.3}
          noiseIntensity={0.02}
          scanlineIntensity={isDark ? 0.06 : 0.01}
          scanlineFrequency={2.0}
          hueShift={0}
          invert={!isDark}
          resolutionScale={1}
        />
      </div>

      {/* Subtle Light Mode Ambient Radial Light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.06),_rgba(139,92,246,0.03),_transparent_70%)] opacity-100 dark:opacity-0 z-0"
      />

      {/* Smooth Multi-Stop Background Fade Transition into Features Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 sm:h-80 md:h-96 bg-gradient-to-b from-transparent via-[#fafafa]/80 dark:via-background/80 to-[#fafafa] dark:to-background z-10"
      />

      <div className="relative z-20 w-full px-4 sm:px-6 pt-32 pb-16 sm:pb-24 md:pb-32 md:pt-36 flex flex-col items-center text-center max-w-7xl mx-auto space-y-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="flex flex-col items-center w-full"
        >
          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] text-foreground max-w-4xl"
          >
            {tLanding("title_line1")}{" "}
            <br className="hidden sm:inline" />
            <span className="text-zinc-600 dark:text-zinc-400">
              {tLanding("title_gradient")} {tLanding("title_line2")}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed"
          >
            {tLanding("description")}
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
                href={userName ? "/dashboard" : "/signup"}
                className="flex items-center justify-center gap-2"
              >
                {userName ? tNav("dashboard") : tLanding("primary_cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 rounded-md font-semibold text-sm border-border text-foreground hover:bg-secondary/60 w-full sm:w-auto backdrop-blur-sm"
              asChild
            >
              <a href="#how-it-works">{tLanding("secondary_cta")}</a>
            </Button>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium"
          >
            <span>
              {tLanding("trust_bar")}
            </span>
          </motion.div>

          {/* Pure Seamless Glassmorphic Preview (Expanded Width) */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 w-full max-w-6xl min-h-125 sm:h-145 md:h-155 rounded-2xl bg-white/50 dark:bg-zinc-950/45 backdrop-blur-2xl backdrop-saturate-150 text-foreground overflow-hidden text-left flex flex-col relative z-30"
          >
            {/* Top Navigation Bar with Real Redas Logo & Slide Indicators */}
            <div className="h-11 px-3 sm:px-4 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl flex items-center justify-between text-xs shrink-0 select-none">
              {/* Real Redas Logo at Top Left Corner */}
              <div className="flex items-center gap-2">
                <img
                  src="/redas_icon.png"
                  alt="Redas"
                  className="w-5 h-5 object-contain shrink-0 rounded"
                />
                <span className="font-bold text-xs tracking-tight text-foreground font-outfit">
                  Redas
                </span>
              </div>

              {/* Slide Progress Indicators */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === 0 ? "w-4 sm:w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                    }`}
                  />
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === 1 ? "w-4 sm:w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                    }`}
                  />
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === 2 ? "w-4 sm:w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                    }`}
                  />
                </div>

                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-secondary/80 text-foreground flex items-center justify-center ml-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Application Shell (Exact Redas Sidebar + Live Content Canvas) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
              {/* Left Sidebar (Glassmorphic Navigation) */}
              <aside className="hidden md:flex md:col-span-3 lg:col-span-2 p-3 flex-col justify-between bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl h-full shrink-0 overflow-hidden select-none">
                <div className="space-y-4">
                  {/* Workspace Switcher */}
                  <div className="p-2 rounded-md bg-white/60 dark:bg-zinc-800/50 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-5 h-5 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-[10px] shrink-0">
                        W
                      </div>
                      <span className="text-xs font-semibold truncate text-foreground">{tLanding("preview.main_workspace")}</span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                  </div>

                  {/* Navigation Links */}
                  <nav className="space-y-0.5 text-xs">
                    <div
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                        activeSlide === 0
                          ? "font-semibold text-foreground bg-white/70 dark:bg-zinc-800/80"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>{tNav("dashboard")}</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                        activeSlide === 2
                          ? "font-semibold text-foreground bg-white/70 dark:bg-zinc-800/80"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{tNav("workspaces")}</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                        activeSlide === 1
                          ? "font-semibold text-foreground bg-white/70 dark:bg-zinc-800/80"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Bot className={`w-3.5 h-3.5 ${activeSlide === 1 ? "text-primary" : ""}`} />
                      <span>{tNav("bots")}</span>
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground">
                      <Activity className="w-3.5 h-3.5" />
                      <span>{tNav("usage")}</span>
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{tNav("billing")}</span>
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{tNav("pricing")}</span>
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      <span>{tNav("settings")}</span>
                    </div>
                  </nav>
                </div>

                {/* Plan Indicator */}
                <div className="p-2.5 rounded-md bg-white/60 dark:bg-zinc-800/50 backdrop-blur-md text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-muted-foreground">{tLanding("preview.standard_plan")}</span>
                    <span className="text-foreground font-semibold">3 / 3</span>
                  </div>
                  <div className="w-full h-1 bg-secondary/80 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-primary" />
                  </div>
                </div>
              </aside>

              {/* Main Stage: Glassmorphic Real Dashboard Content (Zero Borders) */}
              <main className="col-span-1 md:col-span-9 lg:col-span-10 p-3.5 sm:p-5 bg-white/20 dark:bg-black/20 backdrop-blur-xl h-full overflow-y-auto sm:overflow-hidden flex flex-col justify-between relative">
                <AnimatePresence mode="wait" initial={false}>
                  {/* SLIDE 0: EXACT REAL DASHBOARD PAGE (/dashboard) */}
                  {activeSlide === 0 && (
                    <motion.div
                      key="slide-real-dashboard"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="h-full flex flex-col justify-start space-y-3 sm:space-y-4"
                    >
                      {/* Exact PageHeader Component */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground font-outfit">
                            {tLanding("preview.dashboard_title")}
                          </h2>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                            {tLanding("preview.dashboard_desc")}
                          </p>
                        </div>
                        <div className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-md bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md text-foreground text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 shrink-0">
                          <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden sm:inline">{tLanding("preview.workspaces_overview")}</span>
                          <span className="sm:hidden">{tNav("workspaces")}</span>
                        </div>
                      </div>

                      {/* Exact 2-Card KPI Grid from UsageCharts.tsx */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-2.5 sm:p-3.5 rounded-lg flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                              {tLanding("preview.messages_this_month")}
                            </span>
                            <p className="text-[8px] sm:text-[9px] text-muted-foreground/70 mt-0.5">
                              Oct 1 - Oct 31, 2026
                            </p>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-foreground mt-1 sm:mt-2">
                            12,450
                            <span className="text-xs text-muted-foreground font-normal ml-1">
                              / 25,000
                            </span>
                          </div>
                        </div>

                        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-2.5 sm:p-3.5 rounded-lg flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                              {tLanding("preview.connected_channels")}
                            </span>
                            <p className="text-[8px] sm:text-[9px] text-muted-foreground/70 mt-0.5">
                              {tLanding("preview.channels_sub")}
                            </p>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-foreground mt-1 sm:mt-2">
                            3
                            <span className="text-xs text-muted-foreground font-normal ml-1">
                              / 5
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Exact Usage Chart Card from UsageCharts.tsx */}
                      <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-2.5 sm:p-3.5 rounded-lg flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-1 sm:pb-2">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            <LineIcon className="w-3.5 h-3.5 text-primary" />
                            {tLanding("preview.messages_chart_title")}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{tLanding("preview.daily_activity")}</span>
                        </div>

                        {/* High-Fidelity SVG Line Graph Visualization */}
                        <div className="h-24 sm:h-32 w-full flex items-end pt-1 sm:pt-2">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2a78d6" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#2a78d6" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M0,80 Q30,75 60,60 T120,45 T180,30 T240,50 T300,20 T360,15 T400,25 L400,100 L0,100 Z"
                              fill="url(#usageGradient)"
                            />
                            <path
                              d="M0,80 Q30,75 60,60 T120,45 T180,30 T240,50 T300,20 T360,15 T400,25"
                              fill="none"
                              stroke="#2a78d6"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            <circle cx="360" cy="15" r="4" fill="#2a78d6" className="animate-ping opacity-75" />
                            <circle cx="360" cy="15" r="3.5" fill="#2a78d6" stroke="#ffffff" strokeWidth="1" />
                          </svg>
                        </div>

                        {/* Graph Date Labels */}
                        <div className="flex justify-between text-[8px] sm:text-[9px] text-muted-foreground pt-1">
                          <span>Oct 10</span>
                          <span>Oct 14</span>
                          <span>Oct 18</span>
                          <span>Oct 22</span>
                          <span>{tLanding("preview.today")}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SLIDE 1: EXACT REAL AGENTS PAGE (/dashboard/agents) */}
                  {activeSlide === 1 && (
                    <motion.div
                      key="slide-real-agents"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="h-full flex flex-col justify-start space-y-2.5 sm:space-y-3.5"
                    >
                      {/* Exact Streamlined Header from /dashboard/agents */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground font-outfit">
                            {tLanding("preview.agents_title")}
                          </h2>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                            {tLanding("preview.agents_desc")}
                          </p>
                        </div>
                        <div className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 shrink-0">
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{tLanding("preview.new_agent")}</span>
                        </div>
                      </div>

                      {/* Exact Toolbar from /dashboard/agents */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] sm:text-xs font-semibold text-foreground">{tLanding("preview.agents_count")}</span>
                        <div className="relative w-36 sm:w-48">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/60" />
                          <div className="pl-7 pr-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] rounded-md bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md text-muted-foreground truncate">
                            {tLanding("preview.search_placeholder")}
                          </div>
                        </div>
                      </div>

                      {/* Exact Responsive BotCards Grid from BotCard Component */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                        {/* BotCard 1: Customer Support */}
                        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-2.5 sm:p-3 rounded-lg flex flex-col justify-between hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all h-36.25 sm:h-38.75">
                          <div className="space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-secondary/80 flex items-center justify-center text-primary">
                                <Bot className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[8px] sm:text-[9px] font-medium text-muted-foreground">Oct 14, 2026</span>
                            </div>
                            <h3 className="text-[11px] sm:text-xs font-semibold text-foreground">{tLanding("preview.support_bot_name")}</h3>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {tLanding("preview.support_bot_desc")}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1.5 sm:pt-2">
                            <div className="flex-1 h-6 sm:h-7 rounded bg-secondary/70 hover:bg-secondary text-foreground text-[9px] sm:text-[10px] font-medium flex items-center justify-center gap-1 transition-colors">
                              <MessageSquare className="w-3 h-3" />
                              {tLanding("preview.test_chat")}
                            </div>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-secondary/70 flex items-center justify-center text-muted-foreground">
                              <Settings className="w-3 h-3" />
                            </div>
                          </div>
                        </div>

                        {/* BotCard 2: Sales Assistant */}
                        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-2.5 sm:p-3 rounded-lg flex flex-col justify-between hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all h-36.25 sm:h-38.75">
                          <div className="space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-secondary/80 flex items-center justify-center text-primary">
                                <Bot className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[8px] sm:text-[9px] font-medium text-muted-foreground">Oct 18, 2026</span>
                            </div>
                            <h3 className="text-[11px] sm:text-xs font-semibold text-foreground">{tLanding("preview.sales_bot_name")}</h3>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {tLanding("preview.sales_bot_desc")}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1.5 sm:pt-2">
                            <div className="flex-1 h-6 sm:h-7 rounded bg-secondary/70 hover:bg-secondary text-foreground text-[9px] sm:text-[10px] font-medium flex items-center justify-center gap-1 transition-colors">
                              <MessageSquare className="w-3 h-3" />
                              {tLanding("preview.test_chat")}
                            </div>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-secondary/70 flex items-center justify-center text-muted-foreground">
                              <Settings className="w-3 h-3" />
                            </div>
                          </div>
                        </div>

                        {/* BotCard 3: DocGen Assistant */}
                        <div className="hidden lg:flex bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-2.5 sm:p-3 rounded-lg flex-col justify-between hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all h-36.25 sm:h-38.75">
                          <div className="space-y-1 sm:space-y-1.5">
                            <div className="flex items-center justify-between">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-secondary/80 flex items-center justify-center text-primary">
                                <Bot className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[8px] sm:text-[9px] font-medium text-muted-foreground">Oct 22, 2026</span>
                            </div>
                            <h3 className="text-[11px] sm:text-xs font-semibold text-foreground">{tLanding("preview.docgen_bot_name")}</h3>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {tLanding("preview.docgen_bot_desc")}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1.5 sm:pt-2">
                            <div className="flex-1 h-6 sm:h-7 rounded bg-secondary/70 hover:bg-secondary text-foreground text-[9px] sm:text-[10px] font-medium flex items-center justify-center gap-1 transition-colors">
                              <MessageSquare className="w-3 h-3" />
                              {tLanding("preview.test_chat")}
                            </div>
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-secondary/70 flex items-center justify-center text-muted-foreground">
                              <Settings className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SLIDE 2: EXACT REAL WORKSPACES PAGE (/dashboard/workspaces) */}
                  {activeSlide === 2 && (
                    <motion.div
                      key="slide-real-workspaces"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="h-full flex flex-col justify-start space-y-3 sm:space-y-4"
                    >
                      {/* Exact PageHeader Component from /dashboard/workspaces */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground font-outfit">
                            {tLanding("preview.workspaces_title")}
                          </h2>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                            {tLanding("preview.workspaces_desc")}
                          </p>
                        </div>
                        <div className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md bg-primary text-primary-foreground text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 shrink-0">
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>{tLanding("preview.add_workspace")}</span>
                        </div>
                      </div>

                      {/* Exact Section Header */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        <span>{tLanding("preview.your_workspaces")}</span>
                      </div>

                      {/* Exact Workspaces Cards Grid from /dashboard/workspaces */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {/* Workspace 1: Main Workspace */}
                        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-3 sm:p-3.5 rounded-lg flex flex-col justify-between hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all h-38.75 sm:h-41.25">
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-secondary/80 flex items-center justify-center text-primary">
                                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">
                                Oct 14, 2026
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-xs sm:text-sm font-semibold text-foreground leading-tight truncate">
                                  {tLanding("preview.main_workspace")}
                                </h3>
                                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                                  {tLanding("preview.owner")}
                                </span>
                              </div>
                              <p className="text-[9px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {tLanding("preview.workspace_card_desc")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-2">
                            <div className="flex-1 h-7 sm:h-8 rounded bg-secondary/70 hover:bg-secondary text-foreground text-[10px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                              <Building2 className="w-3.5 h-3.5" />
                              {tLanding("preview.open_workspace")}
                            </div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-secondary/70 flex items-center justify-center text-muted-foreground">
                              <Settings className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Workspace 2: Support & Operations */}
                        <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-3 sm:p-3.5 rounded-lg flex flex-col justify-between hover:bg-white/80 dark:hover:bg-zinc-900/80 transition-all h-38.75 sm:h-41.25">
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-secondary/80 flex items-center justify-center text-primary">
                                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground">
                                Oct 20, 2026
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="text-xs sm:text-sm font-semibold text-foreground leading-tight truncate">
                                  {tLanding("preview.support_ops_workspace")}
                                </h3>
                                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">
                                  {tLanding("preview.member")}
                                </span>
                              </div>
                              <p className="text-[9px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                {tLanding("preview.workspace_card_desc")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 pt-2">
                            <div className="flex-1 h-7 sm:h-8 rounded bg-secondary/70 hover:bg-secondary text-foreground text-[10px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                              <Building2 className="w-3.5 h-3.5" />
                              {tLanding("preview.open_workspace")}
                            </div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-secondary/70 flex items-center justify-center text-muted-foreground">
                              <Settings className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
