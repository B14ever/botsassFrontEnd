import api from "@/lib/api";

export type OrgRole = "owner" | "member";

export type Organization = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type OrgMember = {
  org_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  role: OrgRole;
  joined_at: string;
};

export type OrgInvite = {
  id: string;
  org_id: string;
  org_name?: string;
  email: string;
  token: string;
  role: OrgRole;
  invited_by: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
};

export async function createOrg(name: string): Promise<Organization> {
  const res = await api.post<Organization>("/org", { name });
  return res.data;
}

export async function getOrg(): Promise<Organization> {
  const res = await api.get<Organization>("/org");
  return res.data;
}

export async function listMembers(): Promise<OrgMember[]> {
  const res = await api.get<{ members: OrgMember[] }>("/org/members");
  return res.data.members ?? [];
}

export async function inviteMember(email: string): Promise<OrgInvite> {
  const res = await api.post<OrgInvite>("/org/invite", { email });
  return res.data;
}

export async function removeMember(userID: string): Promise<void> {
  await api.delete(`/org/members/${userID}`);
}

export async function listPendingInvites(): Promise<OrgInvite[]> {
  const res = await api.get<{ invites: OrgInvite[] }>("/org/invites");
  return res.data.invites ?? [];
}

export async function revokeInvite(token: string): Promise<void> {
  await api.delete(`/org/invite/${token}`);
}

export async function getInviteInfo(token: string): Promise<OrgInvite> {
  const res = await api.get<OrgInvite>(`/org/invite/${token}`);
  return res.data;
}

export async function acceptInvite(token: string): Promise<Organization> {
  const res = await api.post<Organization>(`/org/invite/${token}/accept`);
  return res.data;
}
