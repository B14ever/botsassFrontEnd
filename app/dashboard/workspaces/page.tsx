"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Building2, Plus, ArrowRight, CheckCircle2, Users, Settings } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { listWorkspaces, createWorkspace, type Workspace } from "@/lib/api/workspace";
import { cleanWorkspaceName } from "@/lib/utils";
import { format } from "date-fns";

export default function WorkspacesListPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspaceId = useWorkspaceStore((s) => s.setActiveWorkspaceId);
  const currentUserId = (session?.user as any)?.id;

  // Create Workspace State
  const [isAddWorkspaceModalOpen, setIsAddWorkspaceModalOpen] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [addWsError, setAddWsError] = useState<string | null>(null);

  // Fetch Available Workspaces
  const { data: workspaces = [], isLoading: isWorkspacesLoading } = useQuery({
    queryKey: ["workspaces"],
    queryFn: listWorkspaces,
  });

  // Create Workspace Mutation
  const addWorkspaceMutation = useMutation({
    mutationFn: () => createWorkspace(newWsName.trim()),
    onSuccess: (ws) => {
      toast.success(`Workspace "${ws.name}" created!`);
      setNewWsName("");
      setIsAddWorkspaceModalOpen(false);
      setAddWsError(null);
      if (ws.id) {
        setActiveWorkspaceId(ws.id);
      }
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (e: any) => {
      setAddWsError(e?.response?.data?.error || e?.message || "Failed to create workspace");
    },
  });

  function handleAddWorkspaceSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setAddWsError(null);
    addWorkspaceMutation.mutate();
  }

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* Workspaces List Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
              Workspaces
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select a workspace to open its chat, upload documents, and manage team invitations.
            </p>
          </div>

          <Button
            size="sm"
            className="gap-1.5 h-9 text-xs font-semibold"
            onClick={() => {
              setNewWsName("");
              setAddWsError(null);
              setIsAddWorkspaceModalOpen(true);
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Workspace
          </Button>
        </div>

        {/* Workspaces Cards Grid */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Your Workspaces ({workspaces.length})
          </h2>

          {isWorkspacesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-44 bg-secondary/30 rounded-lg animate-pulse border border-border/50" />
              ))}
            </div>
          ) : workspaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((ws) => {
                const isActive = ws.id === activeWorkspaceId;
                const isWsOwner = ws.owner_id === currentUserId;

                return (
                  <div
                    key={ws.id}
                    className="border border-border/80 bg-card rounded-lg p-4 shadow-xs flex flex-col justify-between hover:border-border transition-all space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-md bg-secondary border border-border/50 flex items-center justify-center text-primary">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {format(new Date(ws.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground leading-tight truncate">
                            {cleanWorkspaceName(ws.name)}
                          </h3>
                          <span
                            className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0 ${
                              isWsOwner
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            }`}
                          >
                            {isWsOwner ? "Owner" : "Member"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 min-h-[2.5rem] line-clamp-2 leading-relaxed">
                          Workspace environment for agents, projects, and custom knowledge.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                      <Link
                        href={`/dashboard/workspaces/${ws.id}`}
                        className="flex-1"
                        onClick={() => {
                          setActiveWorkspaceId(ws.id);
                        }}
                      >
                        <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-medium gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          Open Workspace
                        </Button>
                      </Link>
                      {isWsOwner && (
                        <Link href={`/dashboard/workspaces/${ws.id}/settings`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                            <Settings className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-border/70 rounded-lg bg-card p-6">
              <Building2 className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs font-semibold text-foreground">No workspaces available</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">Create a workspace to start collaborating and chatting with AI.</p>
              <Button
                size="sm"
                className="mt-3 h-8 text-xs gap-1.5 font-semibold"
                onClick={() => setIsAddWorkspaceModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Workspace
              </Button>
            </div>
          )}
        </div>

        {/* Add Workspace Modal */}
        <Dialog open={isAddWorkspaceModalOpen} onOpenChange={setIsAddWorkspaceModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-outfit text-lg">Add New Workspace</DialogTitle>
              <DialogDescription className="text-xs">
                Create a new multi-tenant workspace to separate projects and invite team members.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddWorkspaceSubmit} className="space-y-4 py-2">
              {addWsError && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  {addWsError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Workspace Name</label>
                <Input
                  placeholder="e.g. Acme Corp, Client Portal, Marketing Team"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  className="text-xs h-9"
                  autoFocus
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddWorkspaceModalOpen(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newWsName.trim() || addWorkspaceMutation.isPending}
                  className="text-xs h-8 font-semibold"
                >
                  {addWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Sidebar>
  );
}
