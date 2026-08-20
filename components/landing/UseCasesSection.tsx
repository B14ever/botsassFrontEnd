"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

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
      title: "Customer Support",
      desc: "Answer questions instantly and reduce repetitive support work.",
    },
    {
      title: "Sales",
      desc: "Qualify leads and answer product questions around the clock.",
    },
    {
      title: "Internal Knowledge",
      desc: "Give your team instant access to company knowledge.",
    },
    {
      title: "Operations",
      desc: "Automate repetitive tasks and turn business processes into AI-powered workflows.",
    },
  ];

  return (
    <section
      id="use-cases"
      className="w-full flex flex-col justify-center items-center px-4 sm:px-6 py-20 md:py-28 border-t border-border/25 relative z-10"
    >
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            How teams use Redas.
          </h2>
        </motion.div>

        {/* 4 Clean Typography Outcome Cards (No Icons, No Numbers) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {useCases.map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-secondary/30 dark:bg-zinc-900/40 hover:bg-secondary/50 dark:hover:bg-zinc-900/60 transition-colors flex flex-col justify-start space-y-3 text-left h-full"
            >
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
