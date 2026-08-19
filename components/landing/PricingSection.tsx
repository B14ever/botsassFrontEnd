"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans, Plan } from "@/lib/api/plans";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const DEFAULT_PLANS = [
  {
    code: "free",
    name: "Starter",
    description: "For individuals testing AI bots on their documents.",
    price: "0",
    limits: {
      bots: 1,
      channels_connected: 1,
      chat_messages_per_month: 250,
      reports_generated: 5,
      projects: 1,
    },
  },
  {
    code: "standard",
    name: "Business Standard",
    description: "For growing businesses deploying agents on web and messaging channels.",
    price: "1,500",
    limits: {
      bots: 3,
      channels_connected: 3,
      chat_messages_per_month: 5000,
      reports_generated: 30,
      projects: 3,
    },
  },
  {
    code: "pro",
    name: "Enterprise Pro",
    description: "For scaling teams requiring higher capacity, custom bots, and advanced reports.",
    price: "3,800",
    limits: {
      bots: 10,
      channels_connected: 10,
      chat_messages_per_month: 25000,
      reports_generated: 150,
      projects: 10,
    },
  },
];

export default function PricingSection({ userName }: { userName?: string | null }) {
  const { data: serverPlans = [] } = useQuery<Plan[]>({
    queryKey: ["public-plans"],
    queryFn: fetchPlans,
  });

  const displayPlans = serverPlans.length > 0
    ? [...serverPlans]
        .filter((plan) => plan.code !== "team")
        .sort((a, b) => {
          const order = { free: 0, standard: 1, pro: 2 } as const;
          return (order[a.code as keyof typeof order] ?? 99) - (order[b.code as keyof typeof order] ?? 99);
        })
    : DEFAULT_PLANS;

  return (
    <section
      id="pricing"
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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Simple Plans That Scale With Your Team
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Start for free, test with your own documents, and scale smoothly as your agent channels and report needs grow. Billed in Birr via Chapa.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch"
        >
          {displayPlans.map((plan) => {
            const isHighlighted = plan.code === "standard";
            const priceLabel =
              plan.code === "free" || plan.price === "0" ? "Free" : `${plan.price} ETB`;

            const bullets = [
              `${plan.limits.bots} AI agent${plan.limits.bots === 1 ? "" : "s"}`,
              `${plan.limits.channels_connected} channel connection${plan.limits.channels_connected === 1 ? "" : "s"}`,
              `${plan.limits.chat_messages_per_month.toLocaleString()} conversations / month`,
              `${plan.limits.reports_generated} reports & decks / month`,
              `${plan.limits.projects} team project${plan.limits.projects === 1 ? "" : "s"}`,
            ];

            return (
              <motion.div
                key={plan.code}
                variants={fadeInUp}
                className={`p-6 rounded-xl border bg-card flex flex-col justify-between card-hover relative ${
                  isHighlighted ? "border-primary shadow-md" : "border-border"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">{plan.name}</h3>
                    {isHighlighted && (
                      <span className="text-[9px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed min-h-[32px]">
                    {plan.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-2xl font-bold tracking-tight text-foreground">
                      {priceLabel}
                    </div>
                    {plan.code !== "free" && plan.price !== "0" && (
                      <span className="text-[10px] text-muted-foreground">per workspace / month</span>
                    )}
                  </div>

                  <ul className="pt-3 space-y-2 text-xs text-muted-foreground">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Button
                    size="sm"
                    variant={isHighlighted ? "default" : "outline"}
                    className="w-full rounded-md font-semibold h-9 text-xs"
                    asChild
                  >
                    <Link href={userName ? "/dashboard" : "/register"}>
                      {plan.code === "free" ? "Start Free" : "Get Started"}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
