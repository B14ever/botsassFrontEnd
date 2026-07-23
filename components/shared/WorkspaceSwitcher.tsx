'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { listWorkspaces, createWorkspace, Workspace } from '@/lib/api/workspace';
import { ChevronDown, Plus, Building2, Check, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cleanWorkspaceName } from '@/lib/utils';

interface WorkspaceSwitcherProps {
  dropDirection?: 'up' | 'down';
  fullWidth?: boolean;
}

export default function WorkspaceSwitcher({
  dropDirection = 'up',
  fullWidth = true,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id ?? '';

  const { activeWorkspaceId, workspaces, setActiveWorkspaceId, setWorkspaces } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWsName, setNewWsName] = useState('');
  const [creating, setCreating] = useState(false);

  const { data: fetchedWorkspaces, refetch } = useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: listWorkspaces,
    retry: false,
  });

  useEffect(() => {
    if (fetchedWorkspaces) {
      setWorkspaces(fetchedWorkspaces);
    }
  }, [fetchedWorkspaces, setWorkspaces]);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  // Separate personal (owned) vs invited workspaces
  const ownedWorkspaces = workspaces.filter((w) => w.owner_id === currentUserId);
  const invitedWorkspaces = workspaces.filter((w) => w.owner_id !== currentUserId);

  const handleCreate = async () => {
    if (!newWsName.trim()) return;
    setCreating(true);
    try {
      const ws = await createWorkspace(newWsName.trim());
      toast.success(`Workspace "${ws.name}" created!`);
      setNewWsName('');
      setIsCreateOpen(false);
      refetch();
      setActiveWorkspaceId(ws.id);
      router.push(`/dashboard/workspaces/${ws.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  const handleSelectWorkspace = (ws: Workspace) => {
    setActiveWorkspaceId(ws.id);
    setIsOpen(false);
    toast.success(`Switched to ${ws.name}`);

    // If it's an invited workspace or specific workspace, navigate directly to that workspace page
    router.push(`/dashboard/workspaces/${ws.id}`);
  };

  const WorkspaceButton = ({ ws }: { ws: Workspace }) => {
    const isSelected = ws.id === activeWorkspaceId;
    const isOwned = ws.owner_id === currentUserId;
    return (
      <button
        key={ws.id}
        onClick={() => handleSelectWorkspace(ws)}
        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
          isSelected
            ? 'bg-primary/10 text-primary font-bold'
            : 'text-foreground hover:bg-muted/40'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="min-w-0 text-left">
            <p className="truncate leading-none">{cleanWorkspaceName(ws.name)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {isOwned ? 'Personal' : 'Invited workspace'}
            </p>
          </div>
        </div>
      </button>
    );
  };

  const dropdownPosClass = dropDirection === 'up'
    ? 'bottom-full mb-2 left-0'
    : 'top-full mt-2 left-0';

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 gap-2 border-border/60 bg-muted/20 hover:bg-muted/40 text-left text-xs font-semibold shrink-0 ${
          fullWidth ? 'w-full justify-between' : ''
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-foreground font-semibold max-w-[140px]">
            {activeWorkspace ? cleanWorkspaceName(activeWorkspace.name) : 'Workspace'}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute w-full min-w-[240px] max-w-[280px] rounded-xl border border-border bg-card p-1.5 shadow-xl z-50 animate-in fade-in duration-150 ${dropdownPosClass}`}
          >
            <div className="space-y-0.5 max-h-48 overflow-y-auto">
              {workspaces.map((ws) => <WorkspaceButton key={ws.id} ws={ws} />)}
            </div>

          </div>
        </>
      )}

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold font-outfit">
              <Building2 className="w-5 h-5 text-primary" />
              Create new workspace
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Workspaces are isolated environments for your team's bots, projects, and knowledge sources.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-semibold text-muted-foreground">Workspace Name</label>
            <Input
              placeholder="e.g. Acme Corp or Client Project"
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newWsName.trim()) handleCreate(); }}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newWsName.trim() || creating} className="gap-2">
              {creating ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
