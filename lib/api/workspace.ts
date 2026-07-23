import api from '@/lib/api';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  avatar_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  role_id: string;
  role_name?: string;
  status: 'pending' | 'active' | 'suspended' | 'removed';
  invited_by?: string;
  joined_at: string;
  last_seen_at: string;
}

export interface WorkspaceInvitation {
  id: string;
  workspace_id: string;
  workspace_name?: string;
  email: string;
  role_id: string;
  role_name?: string;
  invited_by: string;
  invited_by_name?: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked' | 'cancelled';
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

export type PermissionKey =
  | "manage_workspace" | "manage_billing" | "manage_settings"
  | "manage_members" | "invite_members" | "remove_members" | "change_roles"
  | "create_projects" | "edit_projects" | "delete_projects"
  | "create_bots" | "edit_bots" | "deploy_bots" | "publish_bots" | "delete_bots"
  | "create_knowledge" | "edit_knowledge" | "delete_knowledge" | "upload_documents" | "retrain_knowledge"
  | "manage_channels" | "manage_integrations" | "manage_api_keys"
  | "view_conversations" | "reply_conversations" | "takeover_conversations" | "export_conversations"
  | "view_analytics" | "export_analytics";

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  is_custom: boolean;
  permissions: string[];
}

export interface AuditLog {
  id: string;
  workspace_id: string;
  actor_id: string;
  actor_name?: string;
  actor_email?: string;
  target_id?: string;
  action: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface WorkspaceUsage {
  workspace_id: string;
  plan_code: string;
  max_seats: number;
  used_seats: number;
  pending_invites: number;
  bots_limit: number;
  bots_used: number;
  projects_limit: number;
  projects_used: number;
  sources_limit: number;
  sources_used: number;
}

export async function listWorkspaces(): Promise<Workspace[]> {
  const res = await api.get('/workspaces');
  return res.data.workspaces || [];
}

export async function createWorkspace(name: string): Promise<Workspace> {
  const res = await api.post('/workspaces', { name });
  return res.data;
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const res = await api.get(`/workspaces/${id}`);
  return res.data;
}

export async function updateWorkspace(id: string, name?: string, avatar_url?: string): Promise<Workspace> {
  const res = await api.patch(`/workspaces/${id}`, { name, avatar_url });
  return res.data;
}

export async function transferWorkspaceOwnership(id: string, newOwnerId: string): Promise<void> {
  await api.post(`/workspaces/${id}/transfer-ownership`, { new_owner_id: newOwnerId });
}

export async function softDeleteWorkspace(id: string): Promise<void> {
  await api.delete(`/workspaces/${id}`);
}

export async function listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
  const res = await api.get(`/workspaces/${workspaceId}/members`);
  return res.data.members || [];
}

export async function updateMemberRole(workspaceId: string, userId: string, roleId: string): Promise<void> {
  await api.patch(`/workspaces/${workspaceId}/members/${userId}/role`, { role_id: roleId });
}

export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
}

export async function listInvitations(workspaceId: string): Promise<WorkspaceInvitation[]> {
  const res = await api.get(`/workspaces/${workspaceId}/invitations`);
  return res.data.invitations || [];
}

export async function inviteMember(workspaceId: string, email: string, roleId: string): Promise<WorkspaceInvitation> {
  const res = await api.post(`/workspaces/${workspaceId}/invitations`, { email, role_id: roleId });
  return res.data;
}

export async function getInvitationInfo(token: string): Promise<WorkspaceInvitation> {
  const res = await api.get(`/workspaces/invitations/${token}`);
  return res.data;
}

export async function acceptInvitation(token: string): Promise<Workspace> {
  const res = await api.post(`/workspaces/invitations/${token}/accept`);
  return res.data;
}

export async function resendInvitation(workspaceId: string, token: string): Promise<WorkspaceInvitation> {
  const res = await api.post(`/workspaces/${workspaceId}/invitations/${token}/resend`);
  return res.data;
}

export async function cancelInvitation(workspaceId: string, token: string): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/invitations/${token}`);
}

export async function listRoles(workspaceId: string): Promise<Role[]> {
  const res = await api.get(`/workspaces/${workspaceId}/roles`);
  return res.data.roles || [];
}

export async function getWorkspaceUsage(workspaceId: string): Promise<WorkspaceUsage> {
  const res = await api.get(`/workspaces/${workspaceId}/usage`);
  return res.data;
}

export async function listAuditLogs(
  workspaceId: string,
  page = 1,
  pageSize = 20
): Promise<{ logs: AuditLog[]; total: number }> {
  const res = await api.get(`/workspaces/${workspaceId}/audit-logs`, {
    params: { page, page_size: pageSize },
  });
  return res.data;
}
