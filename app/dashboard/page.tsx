"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { fetchUsage, fetchUsageAnalytics } from "@/lib/api/usage";
import UsageCharts from "@/components/dashboard/UsageCharts";

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: usage, isLoading: isUsageLoading, error: usageError } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage,
  });

  const { data: analytics, isLoading: isAnalyticsLoading, error: analyticsError } = useQuery({
    queryKey: ["usage-analytics"],
    queryFn: fetchUsageAnalytics,
  });

  return (
    <Sidebar>
      <div className="space-y-6 pb-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Workspace
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-sans">
              Welcome back, {session?.user?.name || "there"}
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Your agents, credits, and integrations in one place.
            </p>
          </div>
          <Link href="/dashboard/create">
            <Button size="sm" className="rounded-md font-semibold px-4 h-9">
              <Plus className="w-4 h-4 mr-1.5" />
              New Bot
            </Button>
          </Link>
        </div>

        {/* Full-width Analytics section */}
        {isUsageLoading || isAnalyticsLoading ? (
          <div className="space-y-4 pt-4 border-b border-border pb-6 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-secondary rounded-lg border border-border" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-secondary rounded-lg border border-border" />
              <div className="h-64 bg-secondary rounded-lg border border-border" />
            </div>
          </div>
        ) : usageError || analyticsError ? (
          <div className="pt-4 border-t border-border p-4 rounded-lg border border-dashed border-destructive/20 bg-destructive/5 text-xs text-destructive">
            <p className="font-bold">Failed to load analytics data</p>
            <p className="mt-0.5 text-[11px] opacity-80">Make sure the backend server has been restarted to apply the new database table schema and analytics endpoints.</p>
          </div>
        ) : analytics && usage ? (
          <div className="border-b border-border pb-6">
            <UsageCharts analytics={analytics} usage={usage} />
          </div>
        ) : null}
      </div>
    </Sidebar>
  );
}


