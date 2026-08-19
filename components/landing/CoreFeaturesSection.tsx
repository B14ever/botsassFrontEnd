"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Brain,
  Globe2,
  MessageSquare,
  BarChart3,
  Palette,
  ShieldCheck,
} from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function CoreFeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "Connect Your Documents & Website",
      desc: "Upload PDFs, Word files, spreadsheets, or link your website. Redas reads, indexes, and keeps your information ready for action.",
      badge: "Knowledge Hub",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp, Telegram & Web Agents",
      desc: "Deploy your agent across your customer channels with one click. It automatically replies in 50+ languages with verified accuracy.",
      badge: "Multilingual Support",
    },
    {
      icon: BarChart3,
      title: "Instant Presentations & Reports",
      desc: "Ask your workspace for a PowerPoint deck, executive summary, or spreadsheet — generated in seconds directly from your data.",
      badge: "Automated Deliverables",
    },
    {
      icon: ShieldCheck,
      title: "Isolated Team Workspaces",
      desc: "Create separate workspaces for different teams or client accounts. Control team permissions and keep all data safe and private.",
      badge: "Workspaces & Security",
    },
  ];

  return (
    <section
      id="features"
      className="w-full min-h-screen flex flex-col justify-center items-center px-6 py-10 md:py-12 border-t border-border"
    >
      <div className="w-full max-w-5xl mx-auto my-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="mb-8 space-y-1.5 text-left"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground max-w-2xl">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Connect your data, deploy conversational agents across messaging apps, and generate boardroom deliverables.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-6 rounded-xl border border-border/80 bg-card/60 dark:bg-card/40 backdrop-blur-sm space-y-4 hover:border-foreground/20 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-secondary/80 border border-border flex items-center justify-center text-foreground">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/60 px-2.5 py-0.5 rounded-full border border-border/60">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
