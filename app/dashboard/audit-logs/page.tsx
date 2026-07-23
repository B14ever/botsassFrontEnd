'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '@/components/shared/Sidebar';
import RoleGuard from '@/components/shared/RoleGuard';
import { Button } from '@/components/ui/button';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { listAuditLogs, getWorkspace } from '@/lib/api/workspace';
import { cleanWorkspaceName } from '@/lib/utils';

export default function AuditLogsPage() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const { data: workspace } = useQuery({
    queryKey: ['workspace', activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: auditLogsData, isLoading, isError } = useQuery({
    queryKey: ['audit-logs', activeWorkspaceId, page],
    queryFn: () => listAuditLogs(activeWorkspaceId!, page, pageSize),
    enabled: !!activeWorkspaceId,
  });

  const logs = auditLogsData?.logs || [];
  const total = auditLogsData?.total || 0;
  const totalPages = Math.ceil(total / pageSize) || 1;

  const actionBadgeColor = (action: string) => {
    if (action.includes('created') || action.includes('accepted')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (action.includes('deleted') || action.includes('removed') || action.includes('cancelled')) return 'bg-destructive/10 text-destructive border-destructive/20';
    if (action.includes('updated') || action.includes('role')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-secondary text-muted-foreground border-border';
  };

  return (
    <RoleGuard requiredPermission="view_analytics" requiredPermissionLabel="View Analytics">
      <Sidebar>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Streamlined Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
              Security & Audit Logs
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Immutable security activity trail for {workspace ? cleanWorkspaceName(workspace.name) : 'workspace'}.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50 text-xs font-medium text-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>{total} Logged Events</span>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="border border-border/80 rounded-lg overflow-hidden bg-card shadow-xs">
          {isLoading && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Loading security audit records...
            </div>
          )}

          {isError && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Viewing security audit logs requires Admin permissions in this workspace.
            </div>
          )}

          {!isLoading && !isError && logs.length === 0 && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No audit activity recorded yet for this workspace.
            </div>
          )}

          {!isLoading && !isError && logs.length > 0 && (
            <div className="divide-y divide-border/50">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {log.actor_name || log.actor_email || 'Actor'}
                      </span>
                      <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded border ${actionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Target: {log.target_id || 'workspace'} {log.metadata ? `· ${JSON.stringify(log.metadata)}` : ''}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-2.5 border-t border-border/40 bg-secondary/10 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="gap-1 text-xs h-7"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="gap-1 text-xs h-7"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>
        </div>
      </Sidebar>
    </RoleGuard>
  );
}
