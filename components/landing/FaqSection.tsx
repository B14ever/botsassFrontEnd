"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FaqSection() {
  const t = useTranslations("landing.faq");

  const faqs = [
    {
      q: t("q1"),
      a: t("a1"),
    },
    {
      q: t("q2"),
      a: t("a2"),
    },
    {
      q: t("q3"),
      a: t("a3"),
    },
    {
      q: t("q4"),
      a: t("a4"),
    },
    {
      q: t("q5"),
      a: t("a5"),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="w-full flex flex-col justify-center items-center px-4 sm:px-6 pt-10 pb-16 sm:pb-24 relative z-10"
    >
      <div className="w-full max-w-4xl mx-auto relative z-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="mb-8 space-y-1.5 text-left"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="space-y-3"
        >
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-zinc-200/80 dark:border-border/80 rounded-xl bg-white/85 dark:bg-card/40 backdrop-blur-sm overflow-hidden transition-colors shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left gap-4 hover:bg-zinc-50/80 dark:hover:bg-secondary/40 transition-colors focus:outline-none"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-foreground" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-zinc-100 dark:border-border/40">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
