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
  Sparkles,
  MessageSquare,
  Globe,
  Send,
  Users,
  FileText,
  Shield,
  History,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
} as const;

const cardHover =
  "transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5 hover:border-foreground/25";

function FadeIn({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Wraps a card grid so children (given `variants={fadeInUp}`) cascade in
// one after another on scroll, instead of all fading in at once.
function StaggerGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Subtle monochrome dot-grid backdrop, faded via a radial mask — adds
// depth behind the hero without introducing any new color.
function DotGridBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 pointer-events-none opacity-60 dark:opacity-40"
      style={{
        backgroundImage:
          "radial-gradient(circle, color-mix(in srgb, var(--foreground) 18%, transparent) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black, transparent 75%)",
      }}
    />
  );
}

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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 border-b border-border bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <img src="/redas_icon.png" className="w-8 h-8 object-contain shrink-0" alt="Redas logo" />
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground">Redas</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                AI Agents for Business
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-xs font-semibold text-muted-foreground md:flex">
            {[
              { label: "How It Works", href: "#how-it-works" },
              { label: "Channels", href: "#channels" },
              { label: "Pricing", href: "#pricing" },
              { label: "Security", href: "#security" },
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
                  className="flex items-center gap-2 text-xs font-semibold text-foreground hover:text-primary transition-colors  truncate"
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
        <section className="relative px-6 py-16 md:py-24 flex flex-col items-center text-center max-w-4xl mx-auto overflow-hidden">
          <DotGridBackdrop />
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1 text-[10px] font-semibold text-muted-foreground mb-8 uppercase tracking-wider"
            >
              <Sparkles className="w-3 h-3" />
              <span>Built for Ethiopian businesses</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-foreground"
            >
              Your business knowledge,
              <br />
              <span className="text-muted-foreground">answering customers everywhere.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-xl text-sm md:text-base text-muted-foreground font-medium leading-relaxed"
            >
              Redas turns your documents into an AI agent that responds on your website,
              WhatsApp, and Telegram — and helps your team turn the same knowledge into
              reports and presentations. Billed in Birr, no international card required.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
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
                asChild
              >
                <a href="#how-it-works">See how it works</a>
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 flex flex-wrap justify-center gap-6 opacity-60">
              {["Website, WhatsApp & Telegram", "Trained on your documents", "Team workspaces", "Billed in Birr"].map(
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
            </motion.div>
          </motion.div>
        </section>

        {/* Demo mockup - plain layout */}
        <FadeIn className="px-6 py-12 relative max-w-5xl mx-auto" id="demo">
          <div className={`p-1 rounded-lg border border-border bg-card overflow-hidden ${cardHover}`}>
            <div className="w-full bg-background rounded-md border border-border overflow-hidden flex relative">
              <div className="w-16 border-r border-border p-3 flex flex-col items-center gap-5 bg-card">
                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                  <Bot className="w-4 h-4 text-foreground" />
                </div>
                {[Globe, Send, MessageSquare].map((Icon, idx) => (
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
                    <h3 className="text-sm font-bold text-foreground">Business Support Agent</h3>
                    <p className="text-[10px] text-muted-foreground">Workspace: Awash Textiles</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border text-[9px] font-semibold text-muted-foreground">
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-foreground/40 animate-ping" />
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-foreground" />
                      </span>
                      Online
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Live Channels", val: "3" },
                    { label: "Sources Indexed", val: "42" },
                    { label: "Answered Instantly", val: "68%" },
                  ].map((stat, i) => (
                    <div key={i} className="p-3 rounded-lg border border-border bg-card space-y-0.5">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </span>
                      <p className="text-lg font-semibold text-foreground">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg border border-border bg-card flex-1  flex flex-col justify-end space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-[75%] bg-secondary p-2.5 rounded-lg text-xs text-foreground border border-border">
                      Do you accept payment in Birr?
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <div className="max-w-[75%] bg-primary text-primary-foreground p-2.5 rounded-lg text-xs font-medium">
                      Yes — all plans are billed in Birr through Chapa. No international card needed.
                    </div>
                    <div className="w-6 h-6 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <section id="how-it-works" className="px-6 py-12 max-w-5xl mx-auto">
          <FadeIn className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              How It Works
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Live in a day, not a quarter.
            </h3>
          </FadeIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Upload what you already have",
                desc: "PDFs, policies, and website content — Redas indexes it automatically.",
              },
              {
                title: "Review, then go live",
                desc: "Test the agent yourself, then publish it to your website and connect WhatsApp or Telegram.",
              },
              {
                title: "Put your team to work",
                desc: "Ask the same agent to draft reports, decks, and spreadsheets from your own data.",
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`p-5 rounded-lg border border-border bg-card space-y-3 ${cardHover}`}
              >
                <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-[11px] font-bold text-foreground">
                  {i + 1}
                </div>
                <h4 className="text-sm font-bold text-foreground">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </section>

        <section id="channels" className="px-6 py-12 max-w-5xl mx-auto border-t border-border">
          <FadeIn className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Channels
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Meet customers wherever they already are.
            </h3>
          </FadeIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Globe,
                title: "Website widget",
                desc: "Drop a chat widget into your site in minutes. No engineering required.",
              },
              {
                icon: MessageSquare,
                title: "WhatsApp & Telegram",
                desc: "Connect your existing WhatsApp Business number or Telegram bot. Same agent, same knowledge, everywhere your customers message you.",
              },
              {
                icon: Users,
                title: "Team workspaces",
                desc: "Invite your team, assign roles, and keep every conversation and source organized by workspace.",
              },
              {
                icon: FileText,
                title: "Reports & presentations",
                desc: "Ask your agent to turn your own knowledge into a report, a slide deck, or a spreadsheet — grounded in your documents.",
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`p-5 rounded-lg border border-border bg-card space-y-3 ${cardHover}`}
              >
                <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
                  <feat.icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-foreground">{feat.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </section>

        <section id="pricing" className="px-6 py-12 max-w-5xl mx-auto border-t border-border">
          <FadeIn className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Pricing
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Simple pricing that scales.
            </h3>
            <p className="text-xs text-muted-foreground font-medium pt-1">
              Billed in Birr through Chapa — no international card needed.
            </p>
          </FadeIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {orderedPlans.length ? (
              orderedPlans.map((plan) => {
                const isHighlighted = plan.code === "standard";
                const priceLabel = plan.code === "free" || plan.price === "0" ? "Free" : `${plan.price} ETB`;
                const bullets = [
                  `${plan.limits.bots} AI agent${plan.limits.bots === 1 ? "" : "s"}`,
                  `${plan.limits.channels_connected} channel connection${plan.limits.channels_connected === 1 ? "" : "s"}`,
                  `${plan.limits.chat_messages_per_month.toLocaleString()} conversations / month`,
                  `${plan.limits.reports_generated} reports & presentations / month`,
                  `${plan.limits.projects} team project${plan.limits.projects === 1 ? "" : "s"}`,
                ];
                return (
                  <motion.div
                    key={plan.code}
                    variants={fadeInUp}
                    className={`p-6 rounded-lg border bg-card flex flex-col justify-between ${cardHover} ${
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
                      <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        {bullets.map((b, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-foreground shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
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
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full rounded-lg border border-border bg-card p-8 text-center text-muted-foreground text-xs">
                Pricing is loading. Please refresh if it does not appear.
              </div>
            )}
          </StaggerGrid>
        </section>

        <section id="security" className="px-6 py-12 max-w-5xl mx-auto border-t border-border">
          <FadeIn className="mb-8 space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Security
            </h2>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Your data stays yours.
            </h3>
          </FadeIn>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: "Source control",
                desc: "Choose exactly which documents and pages your agent can see. Remove a source and it forgets it immediately.",
              },
              {
                icon: Users,
                title: "Workspace roles",
                desc: "Bot Manager, Knowledge Manager, Support Agent, Viewer — give each teammate exactly the access they need.",
              },
              {
                icon: History,
                title: "Full audit trail",
                desc: "Every source change and team action is logged, so you always know who did what.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`p-5 rounded-lg border border-border bg-card space-y-3 ${cardHover}`}
              >
                <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
                  <item.icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </StaggerGrid>
        </section>

        <FadeIn className="px-6 py-16 text-center max-w-xl mx-auto border-t border-border">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to put an agent to work?</h2>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              Create a free workspace, connect a document, and see your agent answer in minutes.
            </p>
            <div className="flex justify-center pt-2">
              <Button size="sm" className="h-9 px-5 rounded-md font-semibold text-xs" asChild>
                <Link href="/register">Create My Workspace</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </main>

      <footer className="border-t border-border bg-card py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/redas_logo.png" className="w-6 h-6 object-contain shrink-0" alt="Redas logo" />
              <span className="text-sm font-bold tracking-tight text-foreground">Redas</span>
            </div>
            <p className="max-w-sm text-xs text-muted-foreground font-medium leading-relaxed">
              AI agents trained on your business — deployed to your website, WhatsApp, and
              Telegram, billed in Birr.
            </p>
          </div>

          <nav className="flex flex-wrap gap-5 text-xs font-semibold text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#channels" className="hover:text-foreground transition-colors">Channels</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          </nav>
        </div>
        <div className="max-w-5xl mx-auto px-6 mt-8 pt-6 border-t border-border flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
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
