"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { UploadCloud, MessageSquare, Presentation } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect Your Knowledge",
      desc: "Upload PDFs, Word docs, spreadsheets, or link your website. Redas parses and organizes your data automatically.",
      icon: UploadCloud,
    },
    {
      num: "02",
      title: "Deploy Your Agent",
      desc: "Launch your custom AI agent to your Web Widget, WhatsApp, and Telegram in one click — configured once, live everywhere.",
      icon: MessageSquare,
    },
    {
      num: "03",
      title: "Generate & Automate",
      desc: "Ask your workspace for a PowerPoint deck, executive summary report, or spreadsheet — created instantly from your data.",
      icon: Presentation,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full min-h-screen flex flex-col justify-center items-center px-6 py-10 md:py-12 border-t border-border"
    >
      <div className="w-full max-w-5xl mx-auto my-auto">
        {/* Clean Header without pill badge */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="mb-8 space-y-1.5 text-left"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Live in minutes, not months.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Three simple steps to transform your static documents into active customer agents and automated reports.
          </p>
        </motion.div>

        {/* Clean 3-Step Cards without fake UI boxes */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-6 rounded-xl border border-border/80 bg-card/60 dark:bg-card/40 backdrop-blur-sm space-y-4 hover:border-foreground/20 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-secondary/80 border border-border flex items-center justify-center font-mono text-xs font-bold text-foreground">
                      {step.num}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
