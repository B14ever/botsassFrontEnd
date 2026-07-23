"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users, UserPlus, Clock, X, AlertCircle, Check, Copy, RotateCw,
  Trash2, Search, Filter, ShieldCheck, CheckCircle2, MoreHorizontal,
  UserCheck, ChevronRight, Sparkles, Lock
} from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/shared/Sidebar";
import RoleGuard from "@/components/shared/RoleGuard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenuSeparator,
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
import Link from "next/link";
import { fetchSubscription } from "@/lib/api/subscription";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
  listMembers, inviteMember, removeMember, updateMemberRole,
  listInvitations, resendInvitation, cancelInvitation,
  listRoles, getWorkspaceUsage, getWorkspace,
  type WorkspaceMember, type WorkspaceInvitation, type Role, type WorkspaceUsage
} from "@/lib/api/workspace";
import { cleanWorkspaceName } from "@/lib/utils";

function getInitials(name: string, email: string) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (email || "U").slice(0, 2).toUpperCase();
}

function getHumanErrorMessage(e: any): string {
  const msg = e?.message || "";
  if (msg.includes("404") || msg.includes("not found")) {
    return "We couldn't process that request. Please try again or contact support.";
  }
  if (msg.includes("403") || msg.includes("forbidden") || msg.includes("permission")) {
    return "You don't have permission to perform this action in this workspace.";
  }
  if (msg.includes("seat") || msg.includes("limit")) {
    return "Workspace seat limit reached. Please upgrade your workspace plan to invite more members.";
  }
  if (msg.includes("already") || msg.includes("member")) {
    return "This user is already an active member of this workspace.";
  }
  return "We couldn't send that invitation. Please verify the email address or try again.";
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span>;
    case "pending":
      return <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Pending</span>;
    case "expired":
      return <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">Expired</span>;
    default:
      return <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">Inactive</span>;
  }
}

const defaultRoles: Role[] = [
  { id: "owner", name: "Owner", description: "Full workspace control & billing", is_custom: false, permissions: [] },
  { id: "admin", name: "Admin", description: "Manage members, bots & settings", is_custom: false, permissions: [] },
  { id: "bot_manager", name: "Bot Manager", description: "Manage bots & channels", is_custom: false, permissions: [] },
  { id: "knowledge_manager", name: "Knowledge Manager", description: "Manage training sources & PDFs", is_custom: false, permissions: [] },
  { id: "support_agent", name: "Support Agent", description: "Live chat support", is_custom: false, permissions: [] },
  { id: "viewer", name: "Viewer", description: "Read-only access", is_custom: false, permissions: [] },
];

const PERMISSION_MATRIX = [
  { category: "Workspace & Billing", items: [
    { label: "Manage Workspace Settings", key: "manage_workspace", roles: ["owner", "admin"] },
    { label: "Manage Billing & Subscriptions", key: "manage_billing", roles: ["owner"] },
  ]},
  { category: "Team & Roles", items: [
    { label: "Manage Team Members & Roles", key: "manage_members", roles: ["owner", "admin"] },
    { label: "Invite Team Members", key: "invite_members", roles: ["owner", "admin"] },
  ]},
  { category: "AI Agents & Bots", items: [
    { label: "Create & Edit AI Agents", key: "create_bots", roles: ["owner", "admin", "bot_manager"] },
    { label: "Deploy & Connect Channels", key: "deploy_bots", roles: ["owner", "admin", "bot_manager"] },
  ]},
  { category: "Knowledge Base & Data", items: [
    { label: "Upload PDFs & Web Ingestion", key: "upload_documents", roles: ["owner", "admin", "knowledge_manager"] },
    { label: "Retrain Vector Embeddings", key: "retrain_knowledge", roles: ["owner", "admin", "knowledge_manager"] },
  ]},
  { category: "Support & Live Chat", items: [
    { label: "Reply & Take Over Customer Chats", key: "reply_conversations", roles: ["owner", "admin", "support_agent"] },
  ]},
];

type UnifiedPerson = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  status: "active" | "pending" | "expired" | "cancelled";
  isInvite: boolean;
  token?: string;
  joinedOrExpires: string;
  userId?: string;
};

export default function WorkspaceTeamPage() {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const storedWorkspaces = useWorkspaceStore((s) => s.workspaces);
  const { data: session } = useSession();
  // Read current user ID from NextAuth session (authStore is never populated — app uses NextAuth)
  const currentUserId = (session?.user as any)?.id as string | undefined;

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState("member");
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Role Change Modal state
  const [changeRoleTarget, setChangeRoleTarget] = useState<UnifiedPerson | null>(null);
  const [selectedNewRoleId, setSelectedNewRoleId] = useState<string>("");

  // Revoke / Remove state
  const [confirmRevokeToken, setConfirmRevokeToken] = useState<string | null>(null);
  const [confirmRevokeEmail, setConfirmRevokeEmail] = useState<string>("");
  const [confirmRemoveUserId, setConfirmRemoveUserId] = useState<string | null>(null);
  const [confirmRemoveName, setConfirmRemoveName] = useState<string>("");

  // Toolbar state
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Derive owner from store immediately (no API wait needed)
  const storedWorkspace = storedWorkspaces.find((w) => w.id === activeWorkspaceId);
  const isOwnerFromStore = storedWorkspace?.owner_id === currentUserId;

  const { data: workspace } = useQuery({
    queryKey: ["workspace", activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: usage, isLoading: usageLoading } = useQuery<WorkspaceUsage>({
    queryKey: ["workspace-usage", activeWorkspaceId],
    queryFn: () => getWorkspaceUsage(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: members = [] } = useQuery<WorkspaceMember[]>({
    queryKey: ["workspace-members", activeWorkspaceId],
    queryFn: () => listMembers(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const { data: invites = [] } = useQuery<WorkspaceInvitation[]>({
    queryKey: ["workspace-invitations", activeWorkspaceId],
    queryFn: () => listInvitations(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
    refetchInterval: 30_000,
  });

  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ["workspace-roles", activeWorkspaceId],
    queryFn: () => listRoles(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  const availableRoles = roles && roles.length > 0 ? roles : defaultRoles;

  const inviteMutation = useMutation({
    mutationFn: () => inviteMember(activeWorkspaceId!, inviteEmail, inviteRoleId),
    onSuccess: (inv) => {
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setInviteError(null);
      setIsInviteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-usage", activeWorkspaceId] });
      const link = `${window.location.origin}/org/invite/${inv.token}`;
      void navigator.clipboard.writeText(link);
    },
    onError: (e: Error) => {
      setInviteError(getHumanErrorMessage(e));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      updateMemberRole(activeWorkspaceId!, userId, roleId),
    onSuccess: () => {
      toast.success("Role updated successfully");
      setChangeRoleTarget(null);
      queryClient.invalidateQueries({ queryKey: ["workspace-members", activeWorkspaceId] });
    },
    onError: (e: Error) => toast.error(getHumanErrorMessage(e)),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeMember(activeWorkspaceId!, userId),
    onSuccess: () => {
      toast.success("Member removed from workspace");
      setConfirmRemoveUserId(null);
      queryClient.invalidateQueries({ queryKey: ["workspace-members", activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-usage", activeWorkspaceId] });
    },
    onError: (e: Error) => toast.error(getHumanErrorMessage(e)),
  });

  const resendMutation = useMutation({
    mutationFn: (token: string) => resendInvitation(activeWorkspaceId!, token),
    onSuccess: (newInv) => {
      toast.success(`Invitation resent to ${newInv.email}`);
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", activeWorkspaceId] });
    },
    onError: (e: Error) => toast.error(getHumanErrorMessage(e)),
  });

  const cancelMutation = useMutation({
    mutationFn: (token: string) => cancelInvitation(activeWorkspaceId!, token),
    onSuccess: () => {
      toast.success("Invitation cancelled");
      setConfirmRevokeToken(null);
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", activeWorkspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-usage", activeWorkspaceId] });
    },
    onError: (e: Error) => toast.error(getHumanErrorMessage(e)),
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
  });

  const planCode = (usage?.plan_code || subscription?.plan_code || "free").toLowerCase();
  // Only gate on plan once usage has loaded; while loading, don't hide controls for known owners
  const isBelowTeamPlan = !usageLoading && planCode !== "team" && planCode !== "pro";

  const currentMember = members.find((m) => m.user_id === currentUserId);
  // Use store-derived ownership (instant) as primary, fall back to API data
  const isOwner = isOwnerFromStore || workspace?.owner_id === currentUserId || currentMember?.role_id === "owner";
  const isOwnerOrAdmin = isOwner || currentMember?.role_id === "admin";

  const maxSeats = usage?.max_seats || 10;
  const usedSeats = members.length;

  // Merge members and invitations into one unified People list
  const unifiedPeople: UnifiedPerson[] = [
    ...members.map((m) => ({
      id: `m-${m.id}`,
      name: m.user_name || "",
      email: m.user_email || "",
      roleId: m.role_id,
      roleName: m.role_name || m.role_id,
      status: "active" as "active" | "pending" | "expired" | "cancelled",
      isInvite: false,
      userId: m.user_id,
      joinedOrExpires: m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "",
    })),
    ...invites
      .filter((inv) => inv.status === "pending" || inv.status === "expired")
      .map((inv) => ({
        id: `i-${inv.id}`,
        name: "",
        email: inv.email,
        roleId: inv.role_id,
        roleName: inv.role_name || inv.role_id,
        status: (inv.status === "expired" ? "expired" : "pending") as "active" | "pending" | "expired" | "cancelled",
        isInvite: true,
        token: inv.token,
        joinedOrExpires: inv.expires_at ? `Expires ${new Date(inv.expires_at).toLocaleDateString()}` : "",
      })),
  ];

  const filteredPeople = unifiedPeople.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || p.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  function handleSendInvite() {
    if (!inviteEmail.trim()) return;
    setInviteError(null);
    inviteMutation.mutate();
  }

  function copyInviteLink(token: string) {
    const link = `${window.location.origin}/org/invite/${token}`;
    void navigator.clipboard.writeText(link);
    toast.success("Invite link copied");
  }

  return (
    <RoleGuard requiredPermission="manage_members" requiredPermissionLabel="Manage Members">
      <Sidebar>
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* Streamlined Header with Top-Right Action Button */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-outfit">
              {workspace ? cleanWorkspaceName(workspace.name) : "Workspace"} Team
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage workspace members, roles, and pending invitations.
            </p>
          </div>

          {!isBelowTeamPlan && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border/50 text-xs font-medium text-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{usedSeats} of {maxSeats} seats used</span>
              </div>

              {isOwnerOrAdmin && (
                <Button
                  onClick={() => {
                    setInviteError(null);
                    setIsInviteModalOpen(true);
                  }}
                  size="sm"
                  className="gap-2 h-9"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite Member
                </Button>
              )}
            </div>
          )}
        </div>

        {isBelowTeamPlan ? (
          /* Single Compact Callout Card */
          <div className="border border-border/80 bg-card rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Team Collaboration is a Team Plan feature</p>
                <p className="text-[11px] text-muted-foreground">Upgrade your workspace plan to invite members, assign custom roles, and collaborate together.</p>
              </div>
            </div>

            <Button asChild size="sm" className="gap-2 text-xs h-8">
              <Link href="/dashboard/plans">
                <Sparkles className="w-3.5 h-3.5" />
                Upgrade Plan
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Search & Filter Toolbar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-8 text-xs bg-background"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-8 px-2 text-xs font-medium w-[140px] bg-background">
                    <SelectValue placeholder="Filter role" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="all" className="text-xs cursor-pointer">All Roles</SelectItem>
                    {availableRoles.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="text-xs cursor-pointer">{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Flat Single People Table */}
            <div className="border border-border/80 rounded-lg overflow-hidden bg-card shadow-xs">
              {filteredPeople.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No team members or invitations found matching your search.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {filteredPeople.map((person) => (
                <div key={person.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    {getInitials(person.name, person.email)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {person.name || person.email}
                      </span>
                      {person.name && <span className="text-[11px] text-muted-foreground truncate">({person.email})</span>}
                    </div>
                  </div>

                  <StatusBadge status={person.status} />

                  <span className="text-xs font-medium text-muted-foreground capitalize px-2 py-0.5 rounded bg-secondary/60">
                    {person.roleName}
                  </span>

                  {/* Contextual Action Dropdown Menu (···) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-popover border border-border">
                      {!person.isInvite && isOwnerOrAdmin && person.roleId !== "owner" && (
                        <DropdownMenuItem
                          onClick={() => {
                            setChangeRoleTarget(person);
                            setSelectedNewRoleId(person.roleId);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                      )}

                      {person.isInvite && person.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => copyInviteLink(person.token!)} className="text-xs cursor-pointer">
                            <Copy className="w-3.5 h-3.5 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => resendMutation.mutate(person.token!)} className="text-xs cursor-pointer">
                            <RotateCw className="w-3.5 h-3.5 mr-2" />
                            Resend Email
                          </DropdownMenuItem>
                        </>
                      )}

                      {person.isInvite && (
                        <DropdownMenuItem
                          onClick={() => {
                            setConfirmRevokeToken(person.token!);
                            setConfirmRevokeEmail(person.email);
                          }}
                          className="text-xs text-destructive focus:bg-destructive/10 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5 mr-2" />
                          Revoke Invite
                        </DropdownMenuItem>
                      )}

                      {!person.isInvite && isOwnerOrAdmin && person.roleId !== "owner" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setConfirmRemoveUserId(person.userId!);
                              setConfirmRemoveName(person.name || person.email);
                            }}
                            className="text-xs text-destructive focus:bg-destructive/10 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Remove Member
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}

        {/* Quiet Permission Matrix Section */}
        <div className="pt-6 border-t border-border/40 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Role Permissions Reference</span>
          </div>

          <div className="border border-border/70 rounded-lg overflow-hidden bg-card text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-[10px] uppercase font-bold text-muted-foreground">
                  <th className="py-2 px-3">Permission</th>
                  <th className="py-2 px-2 text-center">Owner</th>
                  <th className="py-2 px-2 text-center">Admin</th>
                  <th className="py-2 px-2 text-center">Bot Mgr</th>
                  <th className="py-2 px-2 text-center">KB Mgr</th>
                  <th className="py-2 px-2 text-center">Support</th>
                  <th className="py-2 px-2 text-center">Viewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {PERMISSION_MATRIX.map((group) => (
                  <tr key={group.category}>
                    <td colSpan={7} className="bg-secondary/10 font-semibold px-3 py-1.5 text-[10px] uppercase text-muted-foreground">
                      {group.category}
                    </td>
                  </tr>
                )).flatMap((groupHeader, groupIdx) => [
                  groupHeader,
                  ...PERMISSION_MATRIX[groupIdx].items.map((item) => (
                    <tr key={item.key} className="hover:bg-secondary/10">
                      <td className="py-2 px-3 font-medium text-foreground">{item.label}</td>
                      {["owner", "admin", "bot_manager", "knowledge_manager", "support_agent", "viewer"].map((roleId) => {
                        const hasPerm = item.roles.includes(roleId);
                        return (
                          <td key={roleId} className="py-2 px-2 text-center">
                            {hasPerm ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline-block" />
                            ) : (
                              <span className="text-muted-foreground/30">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ])}
              </tbody>
            </table>
          </div>
        </div>

        {/* Focused Invite Member Modal (Dialog) */}
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogContent className="sm:max-w-md w-full overflow-hidden">
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>
                An invitation email will be dispatched with access credentials for this workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    if (inviteError) setInviteError(null);
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && inviteEmail.trim()) handleSendInvite(); }}
                  className="text-xs h-9 w-full"
                />
              </div>

              {/* Email address field is enough, role select is removed */}

              {inviteError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSendInvite}
                disabled={!inviteEmail.trim() || inviteMutation.isPending}
                className="gap-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Role Modal (Dialog) */}
        <Dialog open={!!changeRoleTarget} onOpenChange={(open) => { if (!open) setChangeRoleTarget(null); }}>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle>Change Role</DialogTitle>
              <DialogDescription>
                Update role for <strong className="text-foreground">{changeRoleTarget?.name || changeRoleTarget?.email}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2 space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Select New Role</label>
              <Select value={selectedNewRoleId} onValueChange={setSelectedNewRoleId}>
                <SelectTrigger className="h-9 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {availableRoles.map((r) => (
                    <SelectItem key={r.id} value={r.id} className="text-xs cursor-pointer">{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setChangeRoleTarget(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (changeRoleTarget) {
                    updateRoleMutation.mutate({ userId: changeRoleTarget.userId!, roleId: selectedNewRoleId });
                  }
                }}
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? "Updating..." : "Save Role"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Member Confirmation Modal */}
        <AlertDialog open={!!confirmRemoveUserId} onOpenChange={(open) => { if (!open) setConfirmRemoveUserId(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <strong className="text-foreground">{confirmRemoveName}</strong> from this workspace? They will lose access immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  if (confirmRemoveUserId) {
                    removeMutation.mutate(confirmRemoveUserId);
                  }
                }}
              >
                Remove Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Revoke Invitation Confirmation Modal */}
        <AlertDialog open={!!confirmRevokeToken} onOpenChange={(open) => { if (!open) setConfirmRevokeToken(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke the invitation for <strong className="text-foreground">{confirmRevokeEmail}</strong>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Active</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  if (confirmRevokeToken) {
                    cancelMutation.mutate(confirmRevokeToken);
                  }
                }}
              >
                Revoke
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </Sidebar>
    </RoleGuard>
  );
}
