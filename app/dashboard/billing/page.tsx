"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check, MessageSquare, Bot, FolderOpen,
  BarChart3, Radio, CreditCard, Sparkles
} from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { fetchSubscription } from "@/lib/api/subscription";
import { fetchUsage } from "@/lib/api/usage";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const USAGE_METRICS = [
  { key: "bots",            label: "Bots",            icon: <Bot className="w-3.5 h-3.5" />,          used: (u: UsageUsed) => u.bots,             limit: (l: UsageLimits) => l.bots },
  { key: "chat",            label: "Monthly chats",   icon: <MessageSquare className="w-3.5 h-3.5" />, used: (u: UsageUsed) => u.chat_messages,    limit: (l: UsageLimits) => l.chat_messages_per_month },
  { key: "projects",        label: "Projects",         icon: <FolderOpen className="w-3.5 h-3.5" />,   used: (u: UsageUsed) => u.projects,         limit: (l: UsageLimits) => l.projects },
  { key: "reports",         label: "Reports",          icon: <BarChart3 className="w-3.5 h-3.5" />,    used: (u: UsageUsed) => u.reports_generated, limit: (l: UsageLimits) => l.reports_generated },
  { key: "project_messages",label: "Project msgs",    icon: <MessageSquare className="w-3.5 h-3.5" />, used: (u: UsageUsed) => u.project_messages, limit: (l: UsageLimits) => l.project_messages },
  { key: "channels",        label: "Channels",         icon: <Radio className="w-3.5 h-3.5" />,        used: (u: UsageUsed) => u.channels,         limit: (l: UsageLimits) => l.channels_connected },
];

type UsageUsed = {
  bots: number; sources: number; website_pages: number; pdf_pages: number;
  chat_messages: number; projects: number; project_messages: number;
  reports_generated: number; channels: number;
};

type UsageLimits = {
  bots: number; sources: number; website_pages_per_month: number;
  pdf_pages_per_month: number; chat_messages_per_month: number;
  projects: number; project_messages: number; reports_generated: number;
  channels_connected: number;
};

export default function BillingPage() {
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription });
  const { data: usage }        = useQuery({ queryKey: ["usage"],        queryFn: fetchUsage });

  return (
    <Sidebar>
      <div className="space-y-6 pb-10 animate-in fade-in duration-300">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              <CreditCard className="w-3 h-3" />
              Billing
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-sans">
              Billing &amp; Limits
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Manage your active plan, usage limits, and billing cycle.
            </p>
          </div>
          <Link href="/dashboard/plans">
            <Button size="sm" className="rounded-md font-semibold px-4 h-9">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Upgrade Plan
            </Button>
          </Link>
        </div>

        {/* Current plan banner + usage bars */}
        {subscription && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Banner row */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-border bg-secondary/40">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  You are on the{" "}
                  <span className="font-black uppercase">{subscription.plan_code}</span>{" "}
                  plan
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Active through{" "}
                  {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}{" "}
                  · Status: {subscription.status}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground px-3 py-1 rounded-full shrink-0">
                {subscription.plan_code}
              </span>
            </div>

            {/* Usage bars */}
            {usage && (
              <div className="px-5 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {USAGE_METRICS.map((m) => {
                  const used  = m.used(usage.used as UsageUsed);
                  const limit = m.limit(usage.limits as UsageLimits);
                  const pct   = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
                  const warn  = pct >= 80;
                  const crit  = pct >= 95;
                  return (
                    <div key={m.key} className="space-y-1.5 border border-border/40 p-4 rounded-xl bg-muted/10">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                          {m.icon}{m.label}
                        </span>
                        <span className={`text-xs font-bold tabular-nums ${crit ? "text-red-500" : warn ? "text-amber-500" : "text-foreground"}`}>
                          {used.toLocaleString()} / {limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            crit ? "bg-red-500" : warn ? "bg-amber-400" : "bg-primary"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
