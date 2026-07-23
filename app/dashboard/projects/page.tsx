"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Folder, FolderPlus, Plus, Search, Trash2, Calendar, MoreHorizontal, ArrowRight, AlertCircle } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { fetchProjects, createProject, deleteProject } from "@/lib/api/projects";
import { fetchUsage } from "@/lib/api/usage";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { listMembers, type WorkspaceMember } from "@/lib/api/workspace";
import { useAuthStore } from "@/store/authStore";

function getHumanErrorMessage(e: any): string {
  const msg = e?.message || e?.response?.data?.error || "";
  if (msg.includes("404") || msg.includes("not found")) {
    return "We couldn't process that request. Please try again or contact support.";
  }
  if (msg.includes("403") || msg.includes("forbidden") || msg.includes("permission")) {
    return "You don't have permission to create or delete projects in this workspace.";
  }
  if (msg.includes("limit") || msg.includes("quota")) {
    return "Workspace project limit reached. Upgrade your subscription to create more projects.";
  }
  return "We couldn't create the project. Please check the details and try again.";
}

export default function ProjectsListPage() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingModalOpen, setIsCreatingModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", activeWorkspaceId],
    queryFn: () => listMembers(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const currentMember = members.find((m) => m.user_id === currentUser?.id);
  const isViewer = currentMember?.role_id === "viewer";

  const { data: projectsData = [], isLoading } = useQuery({
    queryKey: ["projects", activeWorkspaceId],
    queryFn: async () => {
      const res = await fetchProjects();
      return res || [];
    },
    enabled: !!activeWorkspaceId,
  });
  const projects = Array.isArray(projectsData) ? projectsData : [];

  const { data: usage } = useQuery({
    queryKey: ["usage", activeWorkspaceId],
    queryFn: fetchUsage,
    enabled: !!activeWorkspaceId,
  });

  const createMutation = useMutation({
    mutationFn: () => createProject(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ["usage", activeWorkspaceId] });
      toast.success("Project created successfully");
      setIsCreatingModalOpen(false);
      setName("");
      setDescription("");
      setCreateError(null);
    },
    onError: (err: any) => {
      setCreateError(getHumanErrorMessage(err));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ["usage", activeWorkspaceId] });
      toast.success("Project deleted successfully");
      setConfirmDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(getHumanErrorMessage(err));
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreateError(null);
    createMutation.mutate();
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Streamlined Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
              Projects
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organize custom knowledge collections and documents across your workspace.
            </p>
          </div>

          {!isViewer && (
            <Button
              onClick={() => {
                setCreateError(null);
                setIsCreatingModalOpen(true);
              }}
              size="sm"
              className="gap-2 h-9"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          )}
        </div>

        {/* Toolbar & Stats */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-xs bg-background"
            />
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Projects: <span className="text-foreground font-semibold">{usage?.used?.projects ?? projects.length}</span> / {usage?.limits?.projects ?? 10}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-44 rounded-lg bg-secondary/30 animate-pulse border border-border/50" />
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((p) => (
              <div
                key={p.id}
                className="border border-border/80 bg-card rounded-lg p-4 shadow-xs flex flex-col justify-between hover:border-border transition-all space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-md bg-secondary border border-border/50 flex items-center justify-center text-primary">
                      <Folder className="w-4 h-4" />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 bg-popover border border-border">
                        <DropdownMenuItem asChild className="text-xs cursor-pointer">
                          <Link href={`/dashboard/projects/${p.id}`}>Open Workspace</Link>
                        </DropdownMenuItem>
                        {!isViewer && (
                          <DropdownMenuItem
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="text-xs text-destructive focus:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight truncate">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 min-h-[2rem] line-clamp-2 leading-relaxed">
                      {p.description || "Custom workspace project collection."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/dashboard/projects/${p.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary font-medium gap-1">
                      Open <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/70 rounded-lg bg-card">
              <FolderPlus className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <h3 className="text-foreground font-semibold text-sm">No projects yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-1 text-xs">
                Create your first project to organize custom knowledge bases and documents.
              </p>
              {!isViewer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingModalOpen(true)}
                  className="mt-4 h-8 text-xs gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Project
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Focused Create Project Dialog */}
        <Dialog open={isCreatingModalOpen} onOpenChange={setIsCreatingModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Bundle custom knowledge collections, PDFs, and website sources.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Project Name</label>
                <Input
                  required
                  placeholder="e.g. Q3 Legal & Compliance Docs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description (Optional)</label>
                <Input
                  placeholder="e.g. Audit contracts and privacy compliance records"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              {createError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreatingModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete AlertDialog */}
        <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this project? All associated knowledge base sources will be permanently unlinked.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  if (confirmDeleteId) deleteMutation.mutate(confirmDeleteId);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Sidebar>
  );
}
