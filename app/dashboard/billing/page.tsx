"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Check, MessageSquare, Bot, FolderOpen,
  BarChart3, Radio, Sparkles, ShieldAlert
} from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import RoleGuard from "@/components/shared/RoleGuard";
import PageHeader from "@/components/shared/PageHeader";
import { fetchSubscription } from "@/lib/api/subscription";
import { fetchUsage } from "@/lib/api/usage";
import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { listMembers, type WorkspaceMember } from "@/lib/api/workspace";
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
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.user);

  const { data: subscription } = useQuery({ queryKey: ["subscription", activeWorkspaceId], queryFn: fetchSubscription, enabled: !!activeWorkspaceId });
  const { data: usage }        = useQuery({ queryKey: ["usage", activeWorkspaceId],        queryFn: fetchUsage, enabled: !!activeWorkspaceId });

  const { data: members = [] } = useQuery<WorkspaceMember[]>({ queryKey: ["workspace-members", activeWorkspaceId], queryFn: () => listMembers(activeWorkspaceId!), enabled: !!activeWorkspaceId });

  const currentMember = members.find((m) => m.user_id === currentUser?.id);
  const isNotOwnerOrAdmin = currentMember && currentMember.role_id !== "owner" && currentMember.role_id !== "admin";

  return (
    <RoleGuard requiredPermission="manage_billing" requiredPermissionLabel="Manage Billing">
      <Sidebar>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <PageHeader
          title="Billing & Usage Limits"
          description="Manage workspace subscription plan, active quotas, and seat meters."
          actions={
            !isNotOwnerOrAdmin && (
              <Link href="/dashboard/plans">
                <Button size="sm" className="gap-2 h-9">
                  <Sparkles className="w-3.5 h-3.5" />
                  Upgrade Plan
                </Button>
              </Link>
            )
          }
        />

        {/* Non-Owner Notice (RBAC) */}
        {isNotOwnerOrAdmin && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3.5 flex items-center gap-3 text-xs text-amber-500 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Billing Management Restricted</p>
              <p className="text-muted-foreground mt-0.5">
                You belong to this workspace as a <span className="capitalize font-medium text-foreground">{currentMember.role_name || currentMember.role_id}</span>. Only Workspace Owners and Admins can modify subscription plans or billing details.
              </p>
            </div>
          </div>
        )}

        {/* Current Plan & Usage Meter Grid */}
        {subscription && (
          <div className="border border-border/80 bg-card rounded-lg overflow-hidden shadow-xs space-y-4">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-secondary/30">
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground capitalize">{subscription.plan_code} Plan</h3>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {subscription.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Plan billing is handled at the workspace owner level.
                </p>
              </div>
            </div>

            {/* Quota Metrics */}
            {usage && (
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {USAGE_METRICS.map((metric) => {
                  const used = metric.used(usage.used);
                  const limit = metric.limit(usage.limits);
                  const percentage = Math.min(100, Math.round((used / limit) * 100)) || 0;

                  return (
                    <div key={metric.key} className="p-3 rounded-lg border border-border/50 bg-secondary/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground flex items-center gap-1.5">
                          {metric.icon} {metric.label}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {used} / {limit}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full transition-all ${percentage > 90 ? "bg-destructive" : "bg-primary"}`}
                          style={{ width: `${percentage}%` }}
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
    </RoleGuard>
  );
}
