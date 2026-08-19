"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Quote } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SocialProofSection() {
  const stats = [
    { value: "50+", label: "Active Organizations" },
    { value: "100k+", label: "Documents Indexed" },
    { value: "500k+", label: "Conversations Resolved" },
    { value: "70%", label: "Faster Response Times" },
  ];

  return (
    <section className="px-6 py-20 max-w-5xl mx-auto border-t border-border">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeInUp}
        className="space-y-12"
      >
        {/* Testimonial Quote */}
        <div className="p-8 md:p-10 rounded-2xl border border-border/80 bg-card/60 dark:bg-card/40 backdrop-blur-sm relative overflow-hidden text-left">
          <Quote className="w-8 h-8 text-muted-foreground/30 mb-4" />
          <blockquote className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground tracking-tight leading-snug">
            &ldquo;Redas cut our average response time by 70% across WhatsApp and web support. It turns our static documentation into active answers without adding headcount.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              MH
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Michael H.</div>
              <div className="text-[11px] text-muted-foreground">Head of Customer Operations &amp; Strategy</div>
            </div>
          </div>
        </div>

        {/* Stat Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-border/60">
          {stats.map((st, idx) => (
            <div key={idx} className="space-y-1 text-left">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {st.value}
              </div>
              <div className="text-xs text-muted-foreground font-medium">{st.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
