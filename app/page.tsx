"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/lib/api/plans";
import {
  Bot,
  Zap,
  Shield,
  Sparkles,
  MessageSquare,
  Globe,
  ArrowRight,
  CheckCircle2,
  Database,
  Code2,
  Cpu,
  Layers,
  Users,
  Clock,
  FileText
} from "lucide-react";

export default function Home() {
  const { data: plans = [] } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPlans,
  });
  const orderedPlans = [...plans].sort((a, b) => {
    const order = { free: 0, standard: 1, pro: 2 } as const;
    return order[a.code] - order[b.code];
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#060708] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 -left-1/4 w-[70%] h-[50%] bg-primary/10 rounded-full blur-[160px] opacity-50" />
        <div
          className="absolute bottom-0 -right-1/4 w-[70%] h-[50%] bg-emerald-500/10 rounded-full blur-[160px] opacity-40"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-[28%] left-[18%] w-[1px] h-[420px] bg-gradient-to-b from-transparent via-primary/20 to-transparent rotate-45" />
      </div>

      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">KiboBot</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-black italic">
                Support Knowledge Base
              </span>
            </div>
          </motion.div>

          <nav className="hidden items-center gap-10 text-sm font-medium text-white/60 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
              { label: "Security", href: "#security" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-bold shadow-xl shadow-white/5">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative pt-32">
        <section className="px-6 py-20 md:py-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[11px] font-bold text-primary mb-10 tracking-widest uppercase"
          >
            <Sparkles className="w-3 h-3" />
            <span>Built for real support teams</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl text-5xl md:text-7xl font-black tracking-tight leading-[0.95] scroll-m-20"
          >
            Turn your docs into answers
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-emerald-200">
              customers actually trust.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 max-w-2xl text-lg md:text-xl text-white/50 font-medium leading-relaxed"
          >
            KiboBot learns only from the sources you choose and responds with clear citations.
            When it is unsure, it hands off to a human with the full context.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
          >
            <Button
              size="lg"
              className="h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/30 group"
            >
              <Link href="/register" className="flex items-center gap-2">
                Create My Workspace
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-16 px-10 text-white/70 hover:text-white rounded-2xl font-bold bg-white/5 border border-white/5"
            >
              View the Demo
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-30 hover:opacity-100 transition-opacity"
          >
            {["Citations", "Role-based access", "Embeddable widget", "Versioned sources"].map(
              (feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {feat}
                </div>
              )
            )}
          </motion.div>
        </section>

        <section className="px-6 py-20 relative" id="demo">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-y-20 scale-75" />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-6xl p-4 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl shadow-black ring-1 ring-white/10 overflow-hidden"
          >
            <div className="aspect-[16/10] w-full bg-[#0b0d0f] rounded-[1.8rem] border border-white/5 overflow-hidden flex relative">
              <div className="w-20 border-r border-white/5 p-4 flex flex-col items-center gap-6 bg-white/[0.01]">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                {[Cpu, Database, MessageSquare, Shield].map((Icon, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center opacity-40"
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
              <div className="flex-1 p-8 space-y-8 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Help Center Bot</h3>
                    <p className="text-xs text-white/40">Workspace: Atlas Docs</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
                      Online
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                      Updated 2h ago
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Sources",
                      val: "128",
                      className: "text-emerald-300"
                    },
                    {
                      label: "Resolved by Bot",
                      val: "61%",
                      className: "text-sky-300"
                    },
                    {
                      label: "Avg Reply",
                      val: "1.8s",
                      className: "text-white"
                    }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1"
                    >
                      <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">
                        {stat.label}
                      </span>
                      <p className={`text-xl font-black ${stat.className}`}>{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity group-hover:opacity-100 opacity-0" />
                  <div className="relative space-y-4">
                    <div className="flex justify-start">
                      <div className="max-w-[70%] bg-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-white/70 border border-white/5">
                        Do you offer annual billing for teams?
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <div className="max-w-[70%] bg-primary p-4 rounded-2xl rounded-tr-none text-sm font-medium border border-white/10 shadow-xl shadow-primary/20">
                        Yes. Annual plans include a discount and a single invoice.
                        I can send pricing details or connect you with sales.
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="how-it-works" className="px-6 py-16 md:py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              How It Works
            </h2>
            <h3 className="text-3xl md:text-5xl font-black">
              Three steps, then it is live.
            </h3>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Connect your sources",
                desc: "Add URLs, PDFs, and internal docs. You decide what gets indexed and when.",
                icon: FileText
              },
              {
                title: "Set the voice",
                desc: "Choose tone, handoff rules, and the confidence bar for responses.",
                icon: Users
              },
              {
                title: "Embed and monitor",
                desc: "Drop the widget into your app and track the questions your users ask.",
                icon: Clock
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={item}
                className="p-8 rounded-[1.8rem] bg-white/[0.02] border border-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              Features
            </h2>
            <h3 className="text-4xl md:text-6xl font-black">Built for real support work.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Controlled sources",
                desc: "Point the bot at exactly what you want: help center, docs, and release notes.",
                icon: Globe,
                boxClass: "bg-emerald-500/10 border-emerald-500/20",
                iconClass: "text-emerald-300"
              },
              {
                title: "Answer citations",
                desc: "Every response links back to its source so your team can verify fast.",
                icon: Layers,
                boxClass: "bg-primary/10 border-primary/20",
                iconClass: "text-primary"
              },
              {
                title: "Human handoff",
                desc: "Define confidence thresholds and route tricky questions to a person.",
                icon: Users,
                boxClass: "bg-sky-500/10 border-sky-500/20",
                iconClass: "text-sky-300"
              },
              {
                title: "Team roles",
                desc: "Invite teammates, set permissions, and track changes in one place.",
                icon: Shield,
                boxClass: "bg-amber-500/10 border-amber-500/20",
                iconClass: "text-amber-300"
              },
              {
                title: "Fast embed",
                desc: "Add the widget in minutes and match the look of your product.",
                icon: Code2,
                boxClass: "bg-rose-500/10 border-rose-500/20",
                iconClass: "text-rose-300"
              },
              {
                title: "Search analytics",
                desc: "See top questions, resolution rates, and what your docs are missing.",
                icon: Database,
                boxClass: "bg-cyan-500/10 border-cyan-500/20",
                iconClass: "text-cyan-300"
              }
            ].map((feat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all overflow-hidden relative group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 ${feat.boxClass}`}>
                  <feat.icon className={`w-7 h-7 ${feat.iconClass}`} />
                </div>
                <h4 className="text-xl font-bold mb-3">{feat.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="pricing" className="px-6 py-16 md:py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              Pricing
            </h2>
            <h3 className="text-3xl md:text-5xl font-black">Simple plans that scale with you.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {orderedPlans.length ? (
              orderedPlans.map((plan) => {
                const isHighlighted = plan.code === "standard";
                const priceLabel = plan.code === "free" || plan.price === "0" ? "Free" : `${plan.price} ETB`;
                return (
                  <div
                    key={plan.code}
                    className={`p-8 rounded-[2rem] border bg-white/[0.02] ${
                      isHighlighted
                        ? "border-primary/40 shadow-2xl shadow-primary/10"
                        : "border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold">{plan.name}</h4>
                      {isHighlighted ? (
                        <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-black">Popular</span>
                      ) : null}
                    </div>
                    <p className="text-sm text-white/50 mt-2">{plan.description}</p>
                    <div className="mt-5 text-3xl font-black text-white">{priceLabel}</div>
                    <div className="mt-4 space-y-2 text-sm text-white/60">
                      <div>LLM class: {plan.llm_class === "paid" ? "Paid LLMs" : "Free LLMs"}</div>
                      <div>Reasoning quality: {plan.reasoning_quality}</div>
                    </div>
                    <Link href="/register" className="w-full">
                      <Button
                        size="lg"
                        variant={isHighlighted ? "default" : "ghost"}
                        className={`mt-6 w-full h-12 rounded-xl font-bold ${
                          isHighlighted
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "bg-white/5 text-white/70 border border-white/10"
                        }`}
                      >
                        {plan.code === "free" ? "Start Free" : "Get Started"}
                      </Button>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 text-center text-white/60">
                Pricing is loading. Please refresh if it does not appear.
              </div>
            )}
          </div>
        </section>

        <section id="security" className="px-6 py-16 md:py-20 max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              Security
            </h2>
            <h3 className="text-3xl md:text-5xl font-black">Control what the bot can see.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Source permissions",
                desc: "Choose which docs are visible and exclude sensitive pages any time.",
                icon: Shield
              },
              {
                title: "Workspace access",
                desc: "Invite teammates, define roles, and keep audit-friendly change history.",
                icon: Users
              },
              {
                title: "Data hygiene",
                desc: "Remove sources and re-index quickly when your docs change.",
                icon: Zap
              }
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 pb-40 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[200px] opacity-30 select-none pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-8"
          >
            <h2 className="text-4xl md:text-7xl font-black tracking-tight">See it with your docs.</h2>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-white/50 font-medium">
              We can spin up a private workspace and show real answers in under a day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="h-16 px-12 bg-white text-black hover:bg-white/90 rounded-2xl font-black text-lg shadow-2xl transition-transform hover:scale-105"
              >
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="h-16 px-10 text-white font-bold bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl"
              >
                Book a Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 pt-10">
              {["Cloud", "Self-Host", "API-Only"].map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />
                  {tag}
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/80 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">KiboBot</span>
            </div>
            <p className="max-w-sm text-sm text-white/50 font-medium leading-relaxed">
              A focused knowledge layer for your support team. Built to be fast, clear, and
              easy to manage as your product changes.
            </p>
            <div className="flex gap-4">
              {[{ name: "Twitter" }, { name: "GitHub" }, { name: "LinkedIn" }].map((app) => (
                <div
                  key={app.name}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-white/40 hover:text-white"
                >
                  <span className="sr-only">{app.name}</span>
                  <Layers className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Product</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li className="hover:text-primary transition-colors cursor-pointer">Changelog</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-primary transition-colors cursor-pointer">SDKs</li>
              <li className="hover:text-primary transition-colors cursor-pointer">API Keys</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Company</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li className="hover:text-primary transition-colors cursor-pointer">Privacy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Terms</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Security</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Hiring</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter text-white/20">
          <span>(c) 2026 KiboBot Corp. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-500" /> All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
