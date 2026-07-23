"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Crown, UserCheck, ArrowRight, Loader2, Plus } from "lucide-react";
import { listWorkspaces, Workspace, createWorkspace } from "@/lib/api/workspace";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { toast } from "sonner";
import { cleanWorkspaceName } from "@/lib/utils";

export default function SelectWorkspacePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id ?? "";

  const { setActiveWorkspaceId } = useWorkspaceStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: workspaces = [], isLoading, refetch } = useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: listWorkspaces,
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    // If user has only 1 workspace, automatically enter it
    if (workspaces.length === 1) {
      setActiveWorkspaceId(workspaces[0].id);
      router.push("/dashboard");
    }
  }, [workspaces, setActiveWorkspaceId, router]);

  const handleSelect = (ws: Workspace) => {
    setActiveWorkspaceId(ws.id);
    toast.success(`Switched to ${ws.name}`);
    router.push("/dashboard");
  };

  const handleCreate = async () => {
    if (!newWsName.trim()) return;
    setCreating(true);
    try {
      const ws = await createWorkspace(newWsName.trim());
      toast.success(`Workspace "${ws.name}" created!`);
      setNewWsName("");
      setIsCreateOpen(false);
      await refetch();
      setActiveWorkspaceId(ws.id);
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || "Failed to create workspace");
    } finally {
      setCreating(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm text-muted-foreground font-medium">Loading your workspaces...</p>
      </div>
    );
  }

  const ownedWorkspaces = workspaces.filter((w) => w.owner_id === currentUserId);
  const invitedWorkspaces = workspaces.filter((w) => w.owner_id !== currentUserId);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <img src="/redas_logo.png" className="h-14 object-contain" alt="Logo" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-outfit">
            Select an Account
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            You belong to multiple workspaces. Choose which account to continue with.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          {/* Personal / Owned Workspaces */}
          {ownedWorkspaces.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                Personal & Owned Workspaces
              </h2>
              <div className="grid gap-2.5">
                {ownedWorkspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => handleSelect(ws)}
                    className="group w-full flex items-center justify-between p-4 rounded-lg border border-border/80 bg-secondary/30 hover:bg-primary/5 hover:border-primary/40 transition-all text-left"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {ws.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground truncate">
                            {cleanWorkspaceName(ws.name)}
                          </p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-bold border border-amber-500/20 shrink-0">
                            Personal
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Owner</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invited / Member Workspaces */}
          {invitedWorkspaces.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                Joined Workspaces
              </h2>
              <div className="grid gap-2.5">
                {invitedWorkspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => handleSelect(ws)}
                    className="group w-full flex items-center justify-between p-4 rounded-lg border border-border/80 bg-secondary/30 hover:bg-primary/5 hover:border-primary/40 transition-all text-left"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-md bg-secondary text-muted-foreground border border-border flex items-center justify-center font-bold text-sm shrink-0 group-hover:border-primary/40 group-hover:text-primary transition-colors">
                        {ws.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground truncate">
                            {cleanWorkspaceName(ws.name)}
                          </p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold border border-blue-500/20 shrink-0">
                            Invited Member
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Member</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Need another workspace?</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="gap-1.5 h-9 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Personal Workspace
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Create Workspace Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-primary" />
              Create Personal Workspace
            </DialogTitle>
            <DialogDescription>
              Enter a name for your new personal workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
              Workspace Name
            </label>
            <Input
              placeholder="e.g. Acme Corp"
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating || !newWsName.trim()}>
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Workspace"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
