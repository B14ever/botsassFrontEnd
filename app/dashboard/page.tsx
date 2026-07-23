"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Building2, Folder, MessageSquare, ArrowRight, ShieldCheck, Sparkles, Activity } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { fetchUsage, fetchUsageAnalytics } from "@/lib/api/usage";
import UsageCharts from "@/components/dashboard/UsageCharts";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { getWorkspace, listWorkspaces } from "@/lib/api/workspace";
import { fetchProjects } from "@/lib/api/projects";
import { useWorkspacePermissions } from "@/hooks/useWorkspacePermissions";
import { cleanWorkspaceName } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const { isOwner } = useWorkspacePermissions();

  const { data: workspace } = useQuery({
    queryKey: ["workspace", activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: listWorkspaces,
  });

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

  const { data: projectsData = [] } = useQuery({
    queryKey: ["projects", activeWorkspaceId],
    queryFn: async () => {
      const res = await fetchProjects();
      return res || [];
    },
    enabled: !!activeWorkspaceId,
  });

  const projects = Array.isArray(projectsData) ? projectsData : [];

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Main Welcome Header */}
        <PageHeader
          title={`Welcome back, ${session?.user?.name || "there"}`}
          description={`Overview of workspace usage analytics, interactive graphs, and active projects for ${workspace ? cleanWorkspaceName(workspace.name) : "your workspace"}.`}
          actions={
            <Link href="/dashboard/workspaces">
              <Button size="sm" className="gap-2 h-9 text-xs font-semibold">
                <Building2 className="w-4 h-4" />
                Workspaces Overview
              </Button>
            </Link>
          }
        />

        {/* Analytics & Graphs Section */}
        {isUsageLoading || isAnalyticsLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-24 bg-secondary/30 rounded-lg border border-border/50" />
              <div className="h-24 bg-secondary/30 rounded-lg border border-border/50" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-secondary/30 rounded-lg border border-border/50" />
              <div className="h-64 bg-secondary/30 rounded-lg border border-border/50" />
            </div>
          </div>
        ) : usageError || analyticsError ? (
          <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-xs text-destructive">
            <p className="font-semibold">Unable to load workspace analytics</p>
            <p className="mt-0.5 text-[11px] opacity-80">Please ensure the backend service is running and active.</p>
          </div>
        ) : analytics && usage ? (
          <div className="space-y-6">
            <UsageCharts analytics={analytics} usage={usage} />
          </div>
        ) : null}
      </div>
    </Sidebar>
  );
}
