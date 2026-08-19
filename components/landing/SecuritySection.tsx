"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Shield, Users, History, Lock, CheckCircle2 } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function SecuritySection() {
  const items = [
    {
      icon: Shield,
      title: "Granular Source Control",
      desc: "Choose exactly which documents, FAQs, and web URLs your agent is permitted to read. Delete or update a document, and the bot forgets the old data instantly.",
    },
    {
      icon: Users,
      title: "Workspace Roles & RBAC",
      desc: "Assign distinct roles — Bot Manager, Knowledge Manager, Support Agent, Viewer — so teammates only access what their job requires.",
    },
    {
      icon: History,
      title: "Complete Audit Logging",
      desc: "Every document upload, permission change, and customer conversation is logged with timestamps, giving your leadership complete visibility.",
    },
  ];

  return (
    <section id="security" className="px-6 py-16 max-w-5xl mx-auto border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mb-10 space-y-2 text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Enterprise Security
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Your company data stays strictly yours.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Isolated workspaces, role-based controls, and zero training on your proprietary data.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="p-6 rounded-xl border border-border bg-card space-y-4 card-hover flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
