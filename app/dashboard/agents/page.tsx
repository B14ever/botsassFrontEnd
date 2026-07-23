"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { Bot, Globe, LayoutGrid, MessageSquare, Plus, Search, Settings, ArrowRight } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import RoleGuard from "@/components/shared/RoleGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useAuthStore } from "@/store/authStore";
import { listMembers, getWorkspace, type WorkspaceMember } from "@/lib/api/workspace";
import { cleanWorkspaceName } from "@/lib/utils";

type BotRecord = {
  id: string;
  name: string;
  description: string;
  preferred_language: string;
  created_at: string;
};

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.user);

  const { data: workspace } = useQuery({
    queryKey: ["workspace", activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", activeWorkspaceId],
    queryFn: () => listMembers(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const currentMember = members.find((m) => m.user_id === currentUser?.id);
  const isViewer = currentMember?.role_id === "viewer";

  const { data: bots = [], isLoading } = useQuery({
    queryKey: ["bots", activeWorkspaceId],
    queryFn: async () => {
      const response = await api.get<BotRecord[]>("/bots/");
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!activeWorkspaceId,
  });

  const safeBots = Array.isArray(bots) ? bots : [];
  const filteredBots = safeBots.filter((bot) =>
    bot?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleGuard requireOwner requiredPermissionLabel="Workspace Owner">
      <Sidebar>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Streamlined Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
              AI Agents
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Configure, deploy, and train grounded support bots for {workspace ? cleanWorkspaceName(workspace.name) : "your workspace"}.
            </p>
          </div>

          {!isViewer && (
            <Link href="/dashboard/create">
              <Button size="sm" className="gap-2 h-9">
                <Plus className="w-4 h-4" />
                New AI Agent
              </Button>
            </Link>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs font-semibold text-foreground">
            {filteredBots.length} Agent{filteredBots.length !== 1 ? "s" : ""}
          </span>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-9 h-8 text-xs bg-background"
            />
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-44 rounded-lg bg-secondary/30 animate-pulse border border-border/50" />
            ))
          ) : filteredBots?.length > 0 ? (
            filteredBots.map((bot) => <BotCard key={bot.id} bot={bot} isViewer={isViewer} />)
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/70 rounded-lg bg-card">
              <Bot className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <h3 className="text-foreground font-semibold text-sm">No agents found</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-1 text-xs">
                Build your first grounded AI support agent to start handling customer inquiries.
              </p>
              {!isViewer && (
                <Link href="/dashboard/create" className="mt-4">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Create Agent
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
        </div>
      </Sidebar>
    </RoleGuard>
  );
}

function BotCard({ bot, isViewer }: { bot: BotRecord; isViewer: boolean }) {
  return (
    <div className="border border-border/80 bg-card rounded-lg p-4 shadow-xs flex flex-col justify-between hover:border-border transition-all space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-md bg-secondary border border-border/50 flex items-center justify-center text-primary">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">
            {format(new Date(bot.created_at), "MMM d, yyyy")}
          </span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-tight">{bot.name}</h3>
          <p className="text-xs text-muted-foreground mt-1 min-h-[2.5rem] line-clamp-2 leading-relaxed">
            {bot.description || "Custom AI support agent trained on workspace knowledge."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
        <Link href={`/dashboard/chat/${bot.id}`} className="flex-1">
          <Button size="sm" variant="secondary" className="w-full h-8 text-xs font-medium gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Test Chat
          </Button>
        </Link>
        <Link href={`/dashboard/integrate/${bot.id}`}>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Globe className="w-3.5 h-3.5" />
          </Button>
        </Link>
        {!isViewer && (
          <Link href={`/dashboard/settings/${bot.id}`}>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
