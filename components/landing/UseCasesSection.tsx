"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Headphones, TrendingUp, Layers, Building2 } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function UseCasesSection() {
  const useCases = [
    {
      icon: Headphones,
      title: "Customer Support Teams",
      desc: "Deflect repetitive tickets with a multilingual agent trained on your help docs, providing 24/7 resolution across Web, Telegram, and WhatsApp.",
      tag: "Support & Deflection",
    },
    {
      icon: TrendingUp,
      title: "Sales & Client Success",
      desc: "Auto-generate client-ready decks, executive summaries, and performance reports directly from your internal workspace knowledge.",
      tag: "Sales Enablement",
    },
    {
      icon: Layers,
      title: "Operations & Internal Teams",
      desc: "Turn internal drives, wikis, and SOPs into a searchable, conversational assistant so teammates find accurate answers in seconds.",
      tag: "Internal Knowledge",
    },
    {
      icon: Building2,
      title: "Agencies & Consultancies",
      desc: "Serve multiple client accounts with completely isolated, branded workspaces and custom-trained agents without data leakage.",
      tag: "Multi-Tenant Workspaces",
    },
  ];

  return (
    <section id="use-cases" className="px-6 py-20 max-w-5xl mx-auto border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mb-12 space-y-3 text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Use Cases
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Built for teams that rely on accurate knowledge.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Whether you&apos;re automating frontline support or generating client deliverables, Redas adapts to your workflow.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {useCases.map((uc, idx) => {
          const Icon = uc.icon;
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
                    {uc.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{uc.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
