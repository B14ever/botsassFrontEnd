'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Shield, Trash2, UserCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import RoleGuard from '@/components/shared/RoleGuard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import {
  getWorkspace, updateWorkspace, transferWorkspaceOwnership, softDeleteWorkspace,
  listMembers, type WorkspaceMember
} from '@/lib/api/workspace';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function WorkspaceSettingsPage() {
  const t = useTranslations('workspace_settings');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const currentUser = useAuthStore((s) => s.user);

  const [wsName, setWsName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedNewOwner, setSelectedNewOwner] = useState('');

  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: workspace } = useQuery({
    queryKey: ['workspace', activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ['workspace-members', activeWorkspaceId],
    queryFn: () => listMembers(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  useEffect(() => {
    if (workspace) {
      setWsName(workspace.name);
      setAvatarUrl(workspace.avatar_url || '');
    }
  }, [workspace]);

  const isOwner = workspace?.owner_id === currentUser?.id;

  const updateMutation = useMutation({
    mutationFn: () => updateWorkspace(activeWorkspaceId!, wsName.trim(), avatarUrl.trim()),
    onSuccess: () => {
      toast.success(tCommon('saved'));
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
    onError: (e: any) => toast.error(e?.message || tCommon('error')),
  });

  const transferMutation = useMutation({
    mutationFn: () => transferWorkspaceOwnership(activeWorkspaceId!, selectedNewOwner),
    onSuccess: () => {
      toast.success(tCommon('success'));
      setIsTransferOpen(false);
      queryClient.invalidateQueries({ queryKey: ['workspace', activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspace-members', activeWorkspaceId] });
    },
    onError: (e: any) => toast.error(e?.message || tCommon('error')),
  });

  const deleteMutation = useMutation({
    mutationFn: () => softDeleteWorkspace(activeWorkspaceId!),
    onSuccess: () => {
      toast.success(tCommon('success'));
      setIsDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      router.push('/dashboard');
    },
    onError: (e: any) => toast.error(e?.message || tCommon('error')),
  });

  const eligibleNewOwners = members.filter(m => m.user_id !== currentUser?.id && m.status === 'active');

  return (
    <RoleGuard requiredPermission="manage_workspace" requiredPermissionLabel="Manage Workspace">
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Streamlined Header */}
        <div className="pb-4 border-b border-border/40">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
            {t('title')}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t('subtitle')}
          </p>
        </div>

        {/* General Settings */}
        <div className="border border-border/80 bg-card rounded-lg p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-foreground">{t('general_config')}</h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{t('ws_name')}</label>
              <Input
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                placeholder={t('ws_name')}
                className="text-xs h-9 bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{t('ws_slug')}</label>
              <Input
                value={workspace?.slug || ''}
                disabled
                className="text-xs h-9 bg-secondary/40 text-muted-foreground"
              />
            </div>

            <Button
              onClick={() => updateMutation.mutate()}
              disabled={!wsName.trim() || updateMutation.isPending}
              size="sm"
              className="mt-2"
            >
              {updateMutation.isPending ? t('saving') : t('save_settings')}
            </Button>
          </div>
        </div>

        {/* Transfer Ownership */}
        {isOwner && (
          <div className="border border-border/80 bg-card rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span>{t('transfer_title')}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('transfer_desc')}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <Select value={selectedNewOwner} onValueChange={setSelectedNewOwner}>
                <SelectTrigger className="h-9 text-xs font-medium bg-background flex-1">
                  <SelectValue placeholder={t('select_new_owner')} />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {eligibleNewOwners.map((m) => (
                    <SelectItem key={m.user_id} value={m.user_id} className="text-xs cursor-pointer">
                      {m.user_name || m.user_email} ({m.role_name || m.role_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                disabled={!selectedNewOwner}
                onClick={() => setIsTransferOpen(true)}
                className="h-9"
              >
                {t('transfer_btn')}
              </Button>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        {isOwner && (
          <div className="border border-destructive/30 bg-destructive/5 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('danger_title')}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('danger_desc')}
            </p>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="gap-2 h-9"
            >
              <Trash2 className="w-3.5 h-3.5" /> {t('delete_btn')}
            </Button>
          </div>
        )}

        {/* Ownership Transfer Modal */}
        <AlertDialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('confirm_transfer_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('confirm_transfer_desc', { name: workspace?.name || '' })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => transferMutation.mutate()}
                disabled={transferMutation.isPending}
              >
                {t('confirm_transfer_btn')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Workspace Modal */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">{t('delete_modal_title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('delete_modal_desc', { name: workspace?.name || '' })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('keep_ws')}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {t('delete_btn')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RoleGuard>
  );
}
