"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Check, X, Zap, Star, Crown, Users,
  TrendingUp, MessageSquare, Bot,
  Globe, FileText, BarChart3, Radio, FolderOpen,
} from "lucide-react";
import RoleGuard from "@/components/shared/RoleGuard";
import PageHeader from "@/components/shared/PageHeader";
import { PaymentButton } from "@/components/pricing/PaymentButton";
import { fetchPlans, type Plan } from "@/lib/api/plans";
import { fetchSubscription } from "@/lib/api/subscription";
import { useTranslations } from "next-intl";

const TIER_ORDER = ["free", "standard", "pro"] as const;
type TierCode = (typeof TIER_ORDER)[number];

function tierIndex(code: string) {
  return TIER_ORDER.indexOf(code as TierCode);
}

const PLAN_META: Record<string, {
  icon: React.ReactNode;
  accent: string;
  accentBg: string;
  accentBorder: string;
  popular?: boolean;
  badge?: string;
}> = {
  free: {
    icon: <Zap className="w-5 h-5" />,
    accent: "text-slate-600 dark:text-slate-400",
    accentBg: "bg-slate-100 dark:bg-slate-800",
    accentBorder: "border-slate-200 dark:border-slate-700",
  },
  standard: {
    icon: <Star className="w-5 h-5" />,
    accent: "text-blue-600 dark:text-blue-400",
    accentBg: "bg-blue-50 dark:bg-blue-950",
    accentBorder: "border-blue-200 dark:border-blue-800",
  },
  pro: {
    icon: <Crown className="w-5 h-5" />,
    accent: "text-violet-600 dark:text-violet-400",
    accentBg: "bg-violet-50 dark:bg-violet-950",
    accentBorder: "border-violet-200 dark:border-violet-800",
    popular: true,
    badge: "Most Popular",
  },
};

type RowDef = {
  key: string;
  labelKey: string;
  icon: React.ReactNode;
  getValue: (p: Plan) => string | boolean;
  isBoolean?: boolean;
};

const ROW_GROUPS: { headingKey: string; rows: RowDef[] }[] = [
  {
    headingKey: "usage_limits_heading",
    rows: [
      { key: "bots",     labelKey: "row_bots",              icon: <Bot className="w-3.5 h-3.5" />,          getValue: (p) => p.limits.bots.toLocaleString() },
      { key: "sources",  labelKey: "row_sources",           icon: <Globe className="w-3.5 h-3.5" />,        getValue: (p) => p.limits.sources.toLocaleString() },
      { key: "chat",     labelKey: "row_chats",             icon: <MessageSquare className="w-3.5 h-3.5" />, getValue: (p) => p.limits.chat_messages_per_month.toLocaleString() },
      { key: "website",  labelKey: "row_website",           icon: <Globe className="w-3.5 h-3.5" />,        getValue: (p) => p.limits.website_pages_per_month.toLocaleString() },
      { key: "pdf",      labelKey: "row_pdf",               icon: <FileText className="w-3.5 h-3.5" />,     getValue: (p) => p.limits.pdf_pages_per_month.toLocaleString() },
      { key: "projects", labelKey: "row_workspaces",        icon: <FolderOpen className="w-3.5 h-3.5" />,   getValue: (p) => p.limits.projects.toLocaleString() },
      { key: "projmsgs", labelKey: "row_projmsgs",          icon: <MessageSquare className="w-3.5 h-3.5" />, getValue: (p) => p.limits.project_messages.toLocaleString() },
      { key: "reports",  labelKey: "row_reports",           icon: <BarChart3 className="w-3.5 h-3.5" />,    getValue: (p) => p.limits.reports_generated.toLocaleString() },
      { key: "channels", labelKey: "row_channels",          icon: <Radio className="w-3.5 h-3.5" />,        getValue: (p) => p.limits.channels_connected.toLocaleString() },
    ],
  },
  {
    headingKey: "team_collab_heading",
    rows: [
      {
        key: "invite_members",
        labelKey: "row_invite",
        icon: <Users className="w-3.5 h-3.5" />,
        getValue: (p) => p.code === "pro",
        isBoolean: true,
      },
    ],
  },
  {
    headingKey: "ai_quality_heading",
    rows: [
      { key: "reasoning", labelKey: "row_reasoning", icon: <TrendingUp className="w-3.5 h-3.5" />, getValue: (p) => p.reasoning_quality },
      {
        key: "paid_llm", labelKey: "row_paid_llm", icon: <Zap className="w-3.5 h-3.5" />,
        getValue: (p) => p.llm_class === "paid",
        isBoolean: true,
      },
      {
        key: "premium_reasoning", labelKey: "row_premium_reasoning", icon: <Crown className="w-3.5 h-3.5" />,
        getValue: (p) => p.reasoning_quality === "premium",
        isBoolean: true,
      },
    ],
  },
];

export default function PlansPage() {
  const t = useTranslations("plans");
  const tCommon = useTranslations("common");
  const { data: allPlans = [] } = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });
  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription });

  // Filter out the Team plan — only show Free, Standard, Pro
  const plans = allPlans.filter((p) => p.code !== "team");

  const currentCode = subscription?.plan_code ?? "free";
  const currentTierIndex = tierIndex(currentCode);

  return (
    <RoleGuard requiredPermission="manage_billing" requiredPermissionLabel="Manage Billing">
      <div className="space-y-10 pb-20 animate-in fade-in duration-300">
        <PageHeader
          title={t("title")}
          description={t("subtitle")}
        />

        {/* Pro invite callout */}
        <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 px-5 py-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900 border border-violet-200 dark:border-violet-700 flex items-center justify-center shrink-0">
            <Users className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-violet-900 dark:text-violet-100">{t("team_collab_heading")}</p>
            <p className="text-xs text-violet-700 dark:text-violet-300 mt-0.5">
              {t("pro_desc")}
            </p>
          </div>
        </div>

        {/* Plan cards — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.code}
              plan={plan}
              currentTierIndex={currentTierIndex}
              thisTierIndex={tierIndex(plan.code)}
            />
          ))}
        </div>

        {/* Full comparison table */}
        {plans.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="px-6 py-4 border-b border-border bg-secondary/20">
              <h2 className="text-xs font-bold font-sans text-foreground uppercase tracking-widest">
                {t("title")}
              </h2>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-muted-foreground font-semibold text-xs uppercase tracking-wider w-1/3">
                      {t("usage_limits_heading")}
                    </th>
                    {plans.map((p) => {
                      const meta = PLAN_META[p.code] ?? PLAN_META.free;
                      return (
                        <th
                          key={p.code}
                          className={`text-center px-4 py-3 font-bold font-sans capitalize text-xs ${
                            meta.popular
                              ? "text-violet-600 dark:text-violet-400"
                              : "text-foreground"
                          }`}
                        >
                          {p.name}
                          {meta.popular && (
                            <span className="ml-2 text-[9px] font-black uppercase tracking-widest bg-violet-500 text-white px-1.5 py-0.5 rounded-full align-middle">
                              ★
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ROW_GROUPS.map((group) => (
                    <Fragment key={group.headingKey}>
                      <tr className="bg-secondary/30">
                        <td
                          colSpan={plans.length + 1}
                          className="px-6 py-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground"
                        >
                          {t(group.headingKey as any)}
                        </td>
                      </tr>

                      {group.rows.map((row, idx) => (
                        <tr
                          key={row.key}
                          className={`border-b border-border/50 transition-colors hover:bg-secondary/10 ${
                            idx % 2 === 0 ? "bg-transparent" : "bg-secondary/10"
                          }`}
                        >
                          <td className="px-6 py-3">
                            <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                              {row.icon}
                              {t(row.labelKey as any)}
                            </span>
                          </td>
                          {plans.map((p) => {
                            const val = row.getValue(p);
                            return (
                              <td key={p.code} className="px-4 py-3 text-center">
                                {row.isBoolean ? (
                                  val === true ? (
                                    <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                                  ) : (
                                    <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-xs font-bold text-foreground tabular-nums">
                                    {String(val)}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

function PlanCard({
  plan,
  currentTierIndex,
  thisTierIndex,
}: {
  plan: Plan;
  currentTierIndex: number;
  thisTierIndex: number;
}) {
  const t = useTranslations("plans");
  const isCurrent    = currentTierIndex === thisTierIndex;
  const canUpgrade   = thisTierIndex > currentTierIndex;
  const canDowngrade = thisTierIndex < currentTierIndex && plan.code !== "free";
  const meta         = PLAN_META[plan.code] ?? PLAN_META.free;

  return (
    <div
      className={`relative rounded-xl border flex flex-col overflow-hidden transition-all duration-200 ${
        meta.popular
          ? "border-violet-300 dark:border-violet-700 shadow-md shadow-violet-100 dark:shadow-violet-950 ring-1 ring-violet-200 dark:ring-violet-800"
          : isCurrent
          ? "border-primary/40 bg-primary/[0.03] shadow-sm"
          : "border-border bg-card hover:border-border-hover"
      }`}
    >
      {meta.badge && (
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-b-lg bg-violet-500 text-white">
            {t("most_popular")}
          </span>
        </div>
      )}

      <div className={`p-6 pb-5 space-y-4 ${meta.badge ? "pt-8" : ""}`}>
        <div className={`w-10 h-10 rounded-lg ${meta.accentBg} ${meta.accentBorder} border flex items-center justify-center ${meta.accent}`}>
          {meta.icon}
        </div>

        <div>
          <h3 className={`text-lg font-black font-outfit ${meta.accent}`}>{plan.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{plan.description}</p>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black font-outfit text-foreground">
            {plan.code === "free" ? t("free_tier") : Number(plan.price).toLocaleString()}
          </span>
          {plan.code !== "free" && (
            <span className="text-xs text-muted-foreground font-semibold">{t("per_month")}</span>
          )}
        </div>
      </div>

      <div className="mx-6 border-t border-border/60" />

      <div className="p-6 space-y-2.5 flex-1">
        {[
          { label: t("row_bots"),          value: plan.limits.bots.toLocaleString() },
          { label: t("row_chats"),         value: plan.limits.chat_messages_per_month.toLocaleString() },
          { label: t("row_sources"),       value: plan.limits.sources.toLocaleString() },
          { label: t("row_paid_llm"),      value: plan.llm_class === "paid" ? "Paid LLMs" : "Free LLMs" },
          { label: t("row_reasoning"),     value: plan.reasoning_quality },
          { label: t("row_invite"),        value: plan.code === "pro" ? "Up to 10" : "Solo only" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={`text-xs font-bold tabular-nums ${
              label === t("row_invite") && plan.code === "pro"
                ? "text-violet-600 dark:text-violet-400"
                : "text-foreground"
            }`}>{value}</span>
          </div>
        ))}
      </div>

      <div className="px-6 pb-6 space-y-2">
        {isCurrent ? (
          <div className="w-full rounded-lg border border-border bg-secondary/80 px-4 py-2 text-xs text-muted-foreground font-semibold text-center">
            ✓ {t("current_active")}
          </div>
        ) : plan.code === "free" ? (
          <div className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2 text-xs text-muted-foreground font-semibold text-center">
            {t("free_desc")}
          </div>
        ) : canUpgrade ? (
          <PaymentButton
            planCode={plan.code as "standard" | "pro"}
            label={`${t("upgrade_now")} (${plan.name})`}
          />
        ) : canDowngrade ? (
          <PaymentButton
            planCode={plan.code as "standard" | "pro"}
            label={`${t("upgrade_now")} (${plan.name})`}
          />
        ) : null}
      </div>
    </div>
  );
}
