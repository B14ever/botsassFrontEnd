import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface WorkspaceState {
  activeWorkspaceId: string | null;
  workspaces: Workspace[];
  setActiveWorkspaceId: (id: string) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  resetWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      activeWorkspaceId: null,
      workspaces: [],
      setActiveWorkspaceId: (id: string) => set({ activeWorkspaceId: id }),
      setWorkspaces: (workspaces: Workspace[]) => {
        const currentActive = get().activeWorkspaceId;
        const validActive =
          currentActive && workspaces.some((w) => w.id === currentActive)
            ? currentActive
            : workspaces[0]?.id || null;
        set({ workspaces, activeWorkspaceId: validActive });
      },
      resetWorkspace: () => set({ activeWorkspaceId: null, workspaces: [] }),
    }),
    {
      name: 'workspace-storage',
    }
  )
);
