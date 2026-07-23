"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Bot, Globe, FileText, BarChart3, FolderOpen, MessageSquare, Radio, HelpCircle } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import PageHeader from "@/components/shared/PageHeader";
import UsageCharts from "@/components/dashboard/UsageCharts";
import { fetchUsage, fetchUsageAnalytics } from "@/lib/api/usage";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsagePage() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  const { data: usage, isLoading: isUsageLoading, error: usageError } = useQuery({
    queryKey: ["usage", activeWorkspaceId],
    queryFn: fetchUsage,
    enabled: !!activeWorkspaceId,
  });

  const { data: analytics, isLoading: isAnalyticsLoading, error: analyticsError } = useQuery({
    queryKey: ["usage-analytics", activeWorkspaceId],
    queryFn: fetchUsageAnalytics,
    enabled: !!activeWorkspaceId,
  });

  const isLoading = isUsageLoading || isAnalyticsLoading;
  const hasError = usageError || analyticsError;

  const getRemainingDays = (endString?: string) => {
    if (!endString) return "Resets soon";
    const end = new Date(endString);
    const today = new Date();
    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Resets today";
    return `Resets in ${days} ${days === 1 ? 'day' : 'days'}`;
  };

  const getPercent = (used: number, limit: number) => {
    if (!limit) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <PageHeader
          title="Resource Usage"
          description="Detailed overview of plan limits, active bots, and platform usage metrics."
        />

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-secondary/30 rounded-lg border border-border/50" />
              ))}
            </div>
            <div className="h-64 bg-secondary/30 rounded-lg border border-border/50" />
          </div>
        ) : hasError ? (
          <div className="p-5 rounded-lg border border-destructive/20 bg-destructive/5 text-sm text-destructive">
            <p className="font-semibold">Unable to load usage data</p>
            <p className="mt-1 text-xs opacity-80">Please verify that the backend services are active and reachable.</p>
          </div>
        ) : usage ? (
          <div className="space-y-8">
            {/* Top Period Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-border bg-card gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Billing Period</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {new Date(usage.period_start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  <span className="mx-2 text-muted-foreground/40 font-light">to</span>
                  {new Date(usage.period_end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-semibold text-xs shrink-0 w-fit">
                {getRemainingDays(usage.period_end)}
              </div>
            </div>

            {/* Grid of Resource Progress cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Bots card */}
              <Card className="border border-border/60 bg-card rounded-xl shadow-none">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">AI Bots</p>
                        <p className="text-[10px] text-muted-foreground">Active agents</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {usage.used.bots} <span className="text-muted-foreground font-normal">/ {usage.limits.bots}</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Progress value={getPercent(usage.used.bots, usage.limits.bots)} className="h-2" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Usage</span>
                      <span>{getPercent(usage.used.bots, usage.limits.bots)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sources card */}
              <Card className="border border-border/60 bg-card rounded-xl shadow-none">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Knowledge Sources</p>
                        <p className="text-[10px] text-muted-foreground">Uploads & web scrapers</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {usage.used.sources} <span className="text-muted-foreground font-normal">/ {usage.limits.sources}</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Progress value={getPercent(usage.used.sources, usage.limits.sources)} className="h-2" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Usage</span>
                      <span>{getPercent(usage.used.sources, usage.limits.sources)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workspaces card */}
              <Card className="border border-border/60 bg-card rounded-xl shadow-none">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center">
                        <FolderOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Workspaces</p>
                        <p className="text-[10px] text-muted-foreground">Isolated team spaces</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {usage.used.projects} <span className="text-muted-foreground font-normal">/ {usage.limits.projects}</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Progress value={getPercent(usage.used.projects, usage.limits.projects)} className="h-2" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Usage</span>
                      <span>{getPercent(usage.used.projects, usage.limits.projects)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Website pages card */}
              <Card className="border border-border/60 bg-card rounded-xl shadow-none">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Scraped Pages</p>
                        <p className="text-[10px] text-muted-foreground">Web links crawled</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {usage.used.website_pages} <span className="text-muted-foreground font-normal">/ {usage.limits.website_pages_per_month}</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Progress value={getPercent(usage.used.website_pages, usage.limits.website_pages_per_month)} className="h-2" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Usage</span>
                      <span>{getPercent(usage.used.website_pages, usage.limits.website_pages_per_month)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PDF pages card */}
              <Card className="border border-border/60 bg-card rounded-xl shadow-none">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">PDF Document Pages</p>
                        <p className="text-[10px] text-muted-foreground">Processed file pages</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {usage.used.pdf_pages} <span className="text-muted-foreground font-normal">/ {usage.limits.pdf_pages_per_month}</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Progress value={getPercent(usage.used.pdf_pages, usage.limits.pdf_pages_per_month)} className="h-2" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Usage</span>
                      <span>{getPercent(usage.used.pdf_pages, usage.limits.pdf_pages_per_month)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reports Generated */}
              <Card className="border border-border/60 bg-card rounded-xl shadow-none">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Reports Generated</p>
                        <p className="text-[10px] text-muted-foreground">Exports & analytics files</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">
                      {usage.used.reports_generated} <span className="text-muted-foreground font-normal">/ {usage.limits.reports_generated}</span>
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Progress value={getPercent(usage.used.reports_generated, usage.limits.reports_generated)} className="h-2" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Usage</span>
                      <span>{getPercent(usage.used.reports_generated, usage.limits.reports_generated)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visual usage graphs section */}
            {analytics && <UsageCharts analytics={analytics} usage={usage} />}
          </div>
        ) : null}
      </div>
    </Sidebar>
  );
}
