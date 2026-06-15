"use client";

import { useQuery } from "@tanstack/react-query";
import { Gem, Globe2, MessageSquare, Sparkles } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { PaymentButton } from "@/components/pricing/PaymentButton";
import { fetchPlans, type Plan } from "@/lib/api/plans";
import { fetchSubscription } from "@/lib/api/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  const { data: plans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
  });

  return (
    <Sidebar>
      <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Gem className="w-3 h-3" />
            Plans & Limits
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent font-outfit tracking-tight">
            Choose the right plan
          </h1>
          <p className="text-white/40 font-medium max-w-3xl">
            Plans differ by usage limits, LLM class (free vs paid), and reasoning quality. Upgrades take effect after payment verification.
          </p>
        </div>

        {subscription ? (
          <Card className="glass-dark border-white/10 rounded-[2.5rem]">
            <CardHeader>
              <CardTitle className="text-white font-outfit text-lg">Current subscription</CardTitle>
              <CardDescription className="text-white/40">
                {subscription.plan_code.toUpperCase()} plan active through {new Date(subscription.current_period_end).toLocaleDateString()}.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <span className="bg-primary/15 text-white border border-primary/20 rounded-full px-4 py-1.5 text-sm">
                {subscription.plan_code.toUpperCase()}
              </span>
              <span className="bg-white/5 text-white/70 border border-white/10 rounded-full px-4 py-1.5 text-sm">
                Status: {subscription.status}
              </span>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.code} plan={plan} currentPlan={subscription?.plan_code} />
          ))}
        </div>
      </div>
    </Sidebar>
  );
}

function PlanCard({ plan, currentPlan }: { plan: Plan; currentPlan?: string }) {
  const isCurrent = currentPlan === plan.code;
  const canUpgrade = !isCurrent && plan.code !== "free";

  return (
    <Card className={`rounded-[2.5rem] overflow-hidden border ${isCurrent ? "border-primary/30 bg-primary/5" : "glass-dark border-white/10"}`}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white font-black text-lg font-outfit">{plan.name}</CardTitle>
          {isCurrent ? <span className="bg-white text-black rounded-full px-3 py-1 text-sm font-semibold">Current</span> : null}
        </div>
        <CardDescription className="text-white/50 min-h-[3rem]">{plan.description}</CardDescription>
        <div className="text-2xl font-black text-white">{plan.code === "free" ? "Free" : `${plan.price} ETB`}</div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <LimitStat label="Bots" value={String(plan.limits.bots)} />
          <LimitStat label="Sources" value={String(plan.limits.sources)} />
          <LimitStat label="Website pages" value={String(plan.limits.website_pages_per_month)} />
          <LimitStat label="PDF pages" value={String(plan.limits.pdf_pages_per_month)} />
          <LimitStat label="Monthly chat" value={String(plan.limits.chat_messages_per_month)} />
          <LimitStat label="Projects Workspace" value={String(plan.limits.projects)} />
          <LimitStat label="Project Messages" value={String(plan.limits.project_messages)} />
          <LimitStat label="Reports & PPTX Gen" value={String(plan.limits.reports_generated)} />
          <LimitStat label="Social Channels" value={String(plan.limits.channels_connected)} />
          <LimitStat label="Reasoning quality" value={plan.reasoning_quality} />
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <Feature icon={<MessageSquare className="w-4 h-4" />} text="Grounded chat responses with explicit uncertainty handling" />
          <Feature icon={<Globe2 className="w-4 h-4" />} text={`LLM class: ${plan.llm_class === "paid" ? "Paid LLMs" : "Free LLMs"}`} />
          <Feature icon={<Sparkles className="w-4 h-4" />} text={`Reasoning tier: ${plan.reasoning_quality}`} />
        </div>

        {isCurrent ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
            You are already on this plan.
          </div>
        ) : canUpgrade ? (
          <PaymentButton planCode={plan.code as "standard" | "pro"} label={`Upgrade to ${plan.name}`} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
            Free is always available for new workspaces.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LimitStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">{label}</div>
      <div className="mt-1 text-base font-bold text-white">{value}</div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="leading-relaxed">{text}</div>
    </div>
  );
}
