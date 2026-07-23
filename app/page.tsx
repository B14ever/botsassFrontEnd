"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { fetchPlans, Plan } from "@/lib/api/plans";
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
  Cpu,
  Layers,
  Users,
  User as UserIcon
} from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const authStoreUser = useAuthStore((s) => s.user);
  const user = session?.user || authStoreUser;
  const userName = (user as any)?.name || (user as any)?.email;

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["public-plans"],
    queryFn: fetchPlans,
  });
  const orderedPlans = [...plans]
    .filter((plan) => plan.code !== "team")
    .sort((a, b) => {
      const order = { free: 0, standard: 1, pro: 2 } as const;
      return (order[a.code as keyof typeof order] ?? 99) - (order[b.code as keyof typeof order] ?? 99);
    });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <img src="/redas_icon.png" className="w-8 h-8 object-contain shrink-0" alt="Redas logo" />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground">Redas</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                Knowledge Base
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-xs font-semibold text-muted-foreground md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
              { label: "Security", href: "#security" }
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-foreground transition-colors relative"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {userName ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-xs font-semibold text-foreground hover:text-primary transition-colors max-w-[160px] truncate"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate">{userName}</span>
                </Link>
                <Button size="sm" className="rounded-md font-semibold px-4 h-9 gap-1.5" asChild>
                  <Link href="/dashboard">
                    Dashboard
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Button size="sm" className="rounded-md font-semibold px-4 h-9" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative pt-24">
        <section className="px-6 py-16 md:py-24 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1 text-[10px] font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Built for support teams</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-foreground">
            Turn your docs into answers
            <br />
            <span className="text-muted-foreground">customers actually trust.</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            Redas learns only from the sources you choose and responds with clear citations.
            When it is unsure, it hands off to a human with the full context.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
            <Button
              size="lg"
              className="h-11 px-6 rounded-md font-semibold text-sm group"
              asChild
            >
              <Link href={userName ? "/dashboard" : "/register"} className="flex items-center gap-2">
                {userName ? "Go to Dashboard" : "Create My Workspace"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 px-6 rounded-md font-semibold text-sm border-border text-foreground hover:bg-secondary/40"
            >
              View the Demo
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 opacity-60">
            {["Citations", "Role-based access", "Embeddable widget", "Versioned sources"].map(
              (feat) => (
                <div
                  key={feat}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                  {feat}
                </div>
              )
            )}
          </div>
        </section>

        {/* Demo mockup - plain layout */}
        <section className="px-6 py-12 relative max-w-5xl mx-auto" id="demo">
          <div className="p-1 rounded-lg border border-border bg-card overflow-hidden">
            <div className="aspect-[16/9] w-full bg-background rounded-md border border-border overflow-hidden flex relative">
              <div className="w-16 border-r border-border p-3 flex flex-col items-center gap-5 bg-card">
                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                  <Bot className="w-4 h-4 text-foreground" />
                </div>
                {[Cpu, Database, MessageSquare, Shield].map((Icon, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground opacity-60"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-foreground">Help Center Bot</h3>
                    <p className="text-[10px] text-muted-foreground">Workspace: Atlas Docs</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2.5 py-0.5 rounded-full border border-border text-[9px] font-semibold text-muted-foreground">
                      Online
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Sources", val: "128" },
                    { label: "Resolved by Bot", val: "61%" },
                    { label: "Avg Reply", val: "1.8s" }
                  ].map((stat, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-card space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <p className="text-lg font-semibold text-foreground">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg border border-border bg-card flex-1 min-h-[100px] flex flex-col justify-end space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-secondary p-2.5 rounded-lg text-xs text-foreground border border-border">
                      Do you offer annual billing for teams?
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <div className="max-w-[75%] bg-primary text-primary-foreground p-2.5 rounded-lg text-xs font-medium">
                      Yes. Annual plans include a discount and a single invoice.
                    </div>
                    <div className="w-6 h-6 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-12 max-w-5xl mx-auto">
          <div className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              How It Works
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Three steps to go live.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "1. Connect your sources",
                desc: "Add URLs, PDFs, and internal docs. You decide what gets indexed and when."
              },
              {
                title: "2. Review and train",
                desc: "Check draft answers, add customs Q&As, and customize the tone of voice."
              },
              {
                title: "3. Embed widget",
                desc: "Paste a 1-line script onto your site or connect through Telegram/WhatsApp."
              }
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="px-6 py-12 max-w-5xl mx-auto border-t border-border">
          <div className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Features
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Everything you need to ground your answers.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Clean citations",
                desc: "Every answer links directly to the exact heading or PDF page used."
              },
              {
                title: "Structured sources",
                desc: "Add files and website links, and exclude paths dynamically."
              },
              {
                title: "Secure workspaces",
                desc: "Invite collaborators, verify access logs, and enforce constraints."
              }
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="px-6 py-12 max-w-5xl mx-auto border-t border-border">
          <div className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Pricing
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Simple pricing that scales.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {orderedPlans.length ? (
              orderedPlans.map((plan) => {
                const isHighlighted = plan.code === "standard";
                const priceLabel = plan.code === "free" || plan.price === "0" ? "Free" : `${plan.price} ETB`;
                return (
                  <div
                    key={plan.code}
                    className={`p-6 rounded-lg border bg-card flex flex-col justify-between ${
                      isHighlighted ? "border-primary" : "border-border"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground">{plan.name}</h4>
                        {isHighlighted ? (
                          <span className="text-[9px] uppercase tracking-wider text-primary font-bold">Popular</span>
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                      <div className="mt-3 text-2xl font-semibold text-foreground">{priceLabel}</div>
                      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                        <div>LLM class: {plan.llm_class === "paid" ? "Paid LLMs" : "Free LLMs"}</div>
                        <div>Reasoning quality: {plan.reasoning_quality}</div>
                      </div>
                    </div>
                    <Link href="/register" className="w-full mt-6">
                      <Button
                        size="sm"
                        variant={isHighlighted ? "default" : "outline"}
                        className="w-full rounded-md font-semibold h-9"
                      >
                        {plan.code === "free" ? "Start Free" : "Get Started"}
                      </Button>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-xs">
                Pricing is loading. Please refresh if it does not appear.
              </div>
            )}
          </div>
        </section>

        <section id="security" className="px-6 py-12 max-w-5xl mx-auto border-t border-border">
          <div className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Security
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Control what the bot sees.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Source permissions",
                desc: "Choose which docs are visible and exclude sensitive pages any time."
              },
              {
                title: "Workspace access",
                desc: "Invite teammates, define roles, and keep audit-friendly change history."
              },
              {
                title: "Data hygiene",
                desc: "Remove sources and re-index quickly when your docs change."
              }
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card space-y-2">
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16 text-center max-w-xl mx-auto border-t border-border">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to start?</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              We can spin up a private workspace and show real answers in under a day.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center pt-2">
              <Button size="sm" className="h-9 px-5 rounded-md font-semibold text-xs">
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button size="sm" variant="outline" className="h-9 px-5 rounded-md font-semibold text-xs border-border text-foreground hover:bg-secondary/40">
                Book a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/redas_logo.png" className="w-6 h-6 object-contain shrink-0" alt="Redas logo" />
              <span className="text-sm font-bold tracking-tight text-foreground">Redas</span>
            </div>
            <p className="max-w-xs text-xs text-muted-foreground font-medium leading-relaxed">
              A focused knowledge layer for your support team. Built to be fast, clear, and
              easy to manage as your product changes.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Changelog</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">SDKs</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">Privacy</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Terms</li>
              <li className="hover:text-foreground transition-colors cursor-pointer">Security</li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 mt-12 pt-6 border-t border-border flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>(c) 2026 Redas Corp. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
