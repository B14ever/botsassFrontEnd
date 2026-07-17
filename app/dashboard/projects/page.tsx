"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Folder, FolderPlus, Plus, Search, Trash2, Loader2, Calendar } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { fetchProjects, createProject, deleteProject } from "@/lib/api/projects";
import { fetchUsage } from "@/lib/api/usage";

export default function ProjectsListPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: projectsData = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetchProjects();
      return res || [];
    },
  });
  const projects = projectsData || [];

  const { data: usage } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage,
  });

  const createMutation = useMutation({
    mutationFn: () => createProject(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      toast.success("Project created successfully!");
      setIsCreating(false);
      setName("");
      setDescription("");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || "Failed to create project";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
      toast.success("Project deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete project");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate();
  };

  const filteredProjects = (projects || []).filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-primary font-black">
              <Folder className="w-3 h-3" />
              AI Workspace
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-foreground font-sans tracking-tight">
              Projects
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-base">
              Manage your private document collections and chat with your uploads.
            </p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 h-12 rounded-md text-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Modal for project creation */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-card border-border rounded-lg shadow-none border border-border p-8 w-full max-w-md space-y-6 animate-in zoom-in-95 duration-200">
              <div>
                <h3 className="text-xl font-bold font-sans text-foreground">Create New Project</h3>
                <p className="text-muted-foreground text-xs mt-1">
                  Once created, you can upload PDFs and links to build its private knowledge base.
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Name</label>
                  <Input
                    required
                    placeholder="e.g. Finance Audits 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border text-foreground rounded-xl h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">Description</label>
                  <Input
                    placeholder="e.g. Legal documents and earnings reports"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-secondary border-border text-foreground rounded-xl h-11"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="border-border text-foreground hover:bg-secondary rounded-xl h-11 px-5"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl h-11 px-5"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Create
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground focus:border-border/80 placeholder:text-muted-foreground/50 rounded-xl"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Usage: <span className="text-foreground font-bold">{usage?.used.projects ?? 0}</span> / {usage?.limits.projects ?? 0} projects
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 rounded-lg bg-secondary animate-pulse border border-border"
              />
            ))
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((p) => (
              <Card key={p.id} className="bg-card border-border rounded-lg shadow-none border-border overflow-hidden group hover:border-border/80 transition-all">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Folder className="w-5 h-5" />
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this project?")) {
                          deleteMutation.mutate(p.id);
                        }
                      }}
                      className="text-muted-foreground/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl p-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-foreground text-lg font-bold font-sans truncate">{p.name}</h3>
                    <p className="text-muted-foreground text-xs mt-1 truncate min-h-[1rem]">
                      {p.description || "No description provided."}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-2 border-t border-border bg-secondary/20 text-xs px-6 py-4">
                  <span className="text-muted-foreground/60 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/dashboard/projects/${p.id}`}>
                    <Button variant="link" className="text-primary hover:text-foreground p-0 h-auto font-bold">
                      Open Workspace →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg bg-secondary">
              <FolderPlus className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-foreground font-semibold text-lg">No projects yet</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                Create a project to bundle custom research folders and execute workspace tools.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsCreating(true)}
                className="mt-8 border-border text-foreground hover:bg-secondary h-12 px-8 rounded-md"
              >
                Create Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
