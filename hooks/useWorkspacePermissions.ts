"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
  getWorkspace, listMembers, listRoles,
  type WorkspaceMember, type Role, type PermissionKey
} from "@/lib/api/workspace";

const ALL_PERMISSIONS: PermissionKey[] = [
  "manage_workspace", "manage_billing", "manage_settings",
  "manage_members", "invite_members", "remove_members", "change_roles",
  "create_projects", "edit_projects", "delete_projects",
  "create_bots", "edit_bots", "deploy_bots", "publish_bots", "delete_bots",
  "create_knowledge", "edit_knowledge", "delete_knowledge", "upload_documents", "retrain_knowledge",
  "manage_channels", "manage_integrations", "manage_api_keys",
  "view_conversations", "reply_conversations", "takeover_conversations", "export_conversations",
  "view_analytics", "export_analytics",
];

export function useWorkspacePermissions() {
  const { data: session } = useSession();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const storedWorkspaces = useWorkspaceStore((s) => s.workspaces);

  const currentUserId = (session?.user as any)?.id as string | undefined;
  const storedWorkspace = storedWorkspaces.find((w) => w.id === activeWorkspaceId);

  const { data: workspace, isLoading: isWorkspaceLoading } = useQuery({
    queryKey: ["workspace", activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: members = [], isLoading: isMembersLoading } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", activeWorkspaceId],
    queryFn: () => listMembers(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: roles = [], isLoading: isRolesLoading } = useQuery<Role[]>({
    queryKey: ["workspace-roles", activeWorkspaceId],
    queryFn: () => listRoles(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const currentMember = members.find((m) => m.user_id === currentUserId);
  const isOwner =
    (storedWorkspace && storedWorkspace.owner_id === currentUserId) ||
    workspace?.owner_id === currentUserId ||
    currentMember?.role_id === "owner";

  const userRoleId = isOwner ? "owner" : currentMember?.role_id || "viewer";
  const userRoleObject = roles.find((r) => r.id === userRoleId);

  // Permission-Based Access Control (PBAC)
  const permissions: PermissionKey[] = isOwner
    ? ALL_PERMISSIONS
    : (userRoleObject?.permissions as PermissionKey[]) || [];

  const hasPermission = (permission: PermissionKey): boolean => {
    if (isOwner) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: PermissionKey[]): boolean => {
    if (isOwner) return true;
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: PermissionKey[]): boolean => {
    if (isOwner) return true;
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  // Fine-grained permission flags
  const canManageWorkspace = hasPermission("manage_workspace");
  const canManageBilling = hasPermission("manage_billing");
  const canManageSettings = hasPermission("manage_settings");
  const canManageMembers = hasPermission("manage_members") || hasPermission("invite_members");
  const canInviteMembers = hasPermission("invite_members");
  const canRemoveMembers = hasPermission("remove_members");
  const canChangeRoles = hasPermission("change_roles");

  const canCreateProjects = hasPermission("create_projects");
  const canEditProjects = hasPermission("edit_projects");
  const canDeleteProjects = hasPermission("delete_projects");

  const canCreateBots = hasPermission("create_bots");
  const canEditBots = hasPermission("edit_bots");
  const canDeployBots = hasPermission("deploy_bots");
  const canDeleteBots = hasPermission("delete_bots");

  const canCreateKnowledge = hasPermission("create_knowledge");
  const canUploadDocuments = hasPermission("upload_documents");
  const canViewAnalytics = hasPermission("view_analytics");
  const canViewAuditLogs = hasPermission("view_analytics") && (isOwner || userRoleId === "admin");

  return {
    currentUserId,
    userRoleId,
    userRoleName: userRoleObject?.name || userRoleId,
    isOwner,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canManageWorkspace,
    canManageBilling,
    canManageSettings,
    canManageMembers,
    canInviteMembers,
    canRemoveMembers,
    canChangeRoles,
    canCreateProjects,
    canEditProjects,
    canDeleteProjects,
    canCreateBots,
    canEditBots,
    canDeployBots,
    canDeleteBots,
    canCreateKnowledge,
    canUploadDocuments,
    canViewAnalytics,
    canViewAuditLogs,
    isLoading: isWorkspaceLoading || isMembersLoading || isRolesLoading,
  };
}
