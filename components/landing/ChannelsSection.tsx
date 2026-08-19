"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Globe, MessageSquare, FileText, Users, Send, Presentation, Shield } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function ChannelsSection() {
  const features = [
    {
      icon: Globe,
      badge: "Instant Embed",
      title: "Website Chat Widget",
      desc: "Drop a lightweight, responsive chat widget into your site in minutes. Fully customizable to match your brand colors and welcome messaging.",
    },
    {
      icon: MessageSquare,
      badge: "Omnichannel",
      title: "WhatsApp & Telegram",
      desc: "Connect your WhatsApp Business number or Telegram bot. One unified knowledge base powers instant replies everywhere your customers text you.",
    },
    {
      icon: Presentation,
      badge: "DocGen Engine",
      title: "Reports & Presentations",
      desc: "Turn your uploaded knowledge into formatted PDF reports, Word documents, spreadsheets, and slide decks — grounded accurately in your own data.",
    },
    {
      icon: Users,
      badge: "Multi-Tenant",
      title: "Team Workspaces & Roles",
      desc: "Invite teammates, assign granular roles (Bot Manager, Knowledge Editor, Support Agent), and keep projects isolated with complete audit logs.",
    },
  ];

  return (
    <section id="channels" className="px-6 py-16 max-w-5xl mx-auto border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="mb-10 space-y-2 text-left"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Channels &amp; Tools
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Meet customers wherever they already are.
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
          Unified support across messaging channels, paired with automated internal report and deck
          generation for your team.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="p-6 rounded-xl border border-border bg-card space-y-4 card-hover flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-secondary px-2.5 py-0.5 rounded-full border border-border">
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
    </section>
  );
}
