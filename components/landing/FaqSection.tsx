"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FaqSection() {
  const faqs = [
    {
      q: "What file types can I upload?",
      a: "Redas supports PDFs, Microsoft Word (.docx), Excel spreadsheets (.xlsx), plain text (.txt), Markdown (.md), and live website URLs. Our ingestion engine automatically parses, cleans, and indexes content into your workspace knowledge base.",
    },
    {
      q: "How many languages does Redas support?",
      a: "Redas natively understands and responds in over 50 languages (including English, Amharic, Oromo, Tigrinya, French, Arabic, Spanish, and more). The agent automatically detects the incoming message's language and replies accurately without requiring separate setup.",
    },
    {
      q: "Can I connect Telegram and WhatsApp at the same time?",
      a: "Yes. You can deploy the same trained agent to your Web Widget, WhatsApp Business number, and Telegram bot simultaneously. All channels share one central brain and unified knowledge base.",
    },
    {
      q: "Is my organization's data isolated from other tenants?",
      a: "Yes, completely. Redas is built on a multi-tenant architecture with strict tenant-level row isolation and encrypted vector stores. Your documents, chat histories, and configurations are accessible only to authorized members of your organization.",
    },
    {
      q: "Can I customize the generated PowerPoint/Word templates?",
      a: "Yes. The DocGen engine allows you to specify custom presentation structures, executive summary formats, spreadsheet schemas, and brand styling so your generated artifacts are client- and board-ready.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="w-full min-h-screen flex flex-col justify-center items-center px-6 py-10 md:py-12 border-t border-border"
    >
      <div className="w-full max-w-4xl mx-auto my-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="mb-8 space-y-1.5 text-left"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Frequently asked questions.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Everything you need to know about setting up your workspace, connecting channels, and managing your data.
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
                className="border border-border/80 rounded-xl bg-card/60 dark:bg-card/40 backdrop-blur-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left gap-4 hover:bg-secondary/40 transition-colors focus:outline-none"
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
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
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
