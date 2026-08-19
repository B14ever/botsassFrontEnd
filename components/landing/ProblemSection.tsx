"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { FileQuestion, MessageCircleWarning, Clock, Globe2 } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function ProblemSection() {
  const problems = [
    {
      icon: FileQuestion,
      title: "Scattered & Unread Knowledge",
      desc: "Documents live in PDFs, drives, and wikis no one reads — leaving teams searching instead of acting.",
    },
    {
      icon: MessageCircleWarning,
      title: "Repetitive Inquiries",
      desc: "Customers ask the same questions across five different channels, overwhelming support staff.",
    },
    {
      icon: Clock,
      title: "Manual Document Requests",
      desc: "Every report, deck, or spreadsheet request pulls key teammates away from core strategic work.",
    },
    {
      icon: Globe2,
      title: "Multilingual Support Bottlenecks",
      desc: "Providing 24/7 multilingual support means expensive hiring — or losing valuable international customers.",
    },
  ];

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mb-12 space-y-3 text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          The Problem
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground max-w-2xl leading-snug">
          Your Knowledge Is Scattered. Your Support Is Slow. Your Team Is Stretched Thin.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Critical company information is locked inside static files and fragmented tools, slowing down execution and customer response times.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
      >
        {problems.map((prob, idx) => {
          const Icon = prob.icon;
          return (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="p-6 rounded-xl border border-border/80 bg-card/60 dark:bg-card/40 backdrop-blur-sm space-y-3 hover:border-foreground/20 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary/80 border border-border flex items-center justify-center text-foreground">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{prob.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{prob.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
