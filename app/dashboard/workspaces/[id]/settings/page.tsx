"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft, Users, UserPlus, Trash2, Crown, Shield, User,
  Mail, Clock, XCircle, AlertTriangle, Settings2,
  RefreshCw, LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  getWorkspace, listMembers, listInvitations,
  inviteMember, removeMember, cancelInvitation, softDeleteWorkspace,
} from "@/lib/api/workspace";
import { toast } from "sonner";
import { cleanWorkspaceName } from "@/lib/utils";
import { useTranslations } from "next-intl";

function getAxiosMsg(err: unknown, fallback = "Something went wrong") {
  const e = err as { response?: { data?: { error?: string } }; message?: string };
  return e?.response?.data?.error || e?.message || fallback;
}

function RoleIcon({ roleName }: { roleName?: string }) {
  const n = roleName?.toLowerCase() ?? "";
  if (n.includes("owner")) return <Crown className="w-3.5 h-3.5 text-amber-400" />;
  if (n.includes("admin")) return <Shield className="w-3.5 h-3.5 text-violet-400" />;
  return <User className="w-3.5 h-3.5 text-slate-400" />;
}

function MemberAvatar({ name }: { name?: string }) {
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = (name?.charCodeAt(0) ?? 0) * 47;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: `hsl(${hue % 360},60%,45%)` }}
    >
      {initials}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending:   "bg-amber-500/10  text-amber-400  border-amber-500/20",
    suspended: "bg-red-500/10    text-red-400    border-red-500/20",
    removed:   "bg-slate-500/10  text-slate-400  border-slate-500/20",
    expired:   "bg-orange-500/10 text-orange-400 border-orange-500/20",
    accepted:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    revoked:   "bg-red-500/10    text-red-400    border-red-500/20",
    cancelled: "bg-slate-500/10  text-slate-400  border-slate-500/20",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide ${map[status] ?? map["pending"]}`}>
      {status}
    </span>
  );
}

export default function WorkspaceSettingsPage() {
  const t = useTranslations("workspace_settings");
  const tWs = useTranslations("workspaces");
  const tCommon = useTranslations("common");
  const { id: workspaceId } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentUserId = (session?.user as { id?: string })?.id ?? "";

  const [isInviteOpen, setIsInviteOpen]         = useState(false);
  const [inviteEmail, setInviteEmail]             = useState("");
  const [inviteRoleId, setInviteRoleId]           = useState("member");
  const [isDeleteOpen, setIsDeleteOpen]           = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [removingUserId, setRemovingUserId]       = useState<string | null>(null);
  const [cancellingToken, setCancellingToken]     = useState<string | null>(null);

  const { data: workspace } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn:  () => getWorkspace(workspaceId!),
    enabled:  !!workspaceId,
  });

  const { data: members = [], refetch: refetchMembers } = useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn:  () => listMembers(workspaceId!),
    enabled:  !!workspaceId,
  });

  const { data: invitations = [], refetch: refetchInvitations } = useQuery({
    queryKey: ["workspace-invitations", workspaceId],
    queryFn:  () => listInvitations(workspaceId!),
    enabled:  !!workspaceId,
  });

  const isOwner = workspace?.owner_id === currentUserId;

  const inviteMut = useMutation({
    mutationFn: () => inviteMember(workspaceId!, inviteEmail.trim(), inviteRoleId),
    onSuccess: () => {
      toast.success(tCommon("success"));
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteRoleId("member");
      refetchInvitations();
    },
    onError: (err) => toast.error(getAxiosMsg(err, tCommon("error"))),
  });

  const removeMemberMut = useMutation({
    mutationFn: (userId: string) => removeMember(workspaceId!, userId),
    onSuccess: () => {
      toast.success(tCommon("success"));
      setRemovingUserId(null);
      refetchMembers();
    },
    onError: (err) => toast.error(getAxiosMsg(err, tCommon("error"))),
  });

  const cancelInviteMut = useMutation({
    mutationFn: (token: string) => cancelInvitation(workspaceId!, token),
    onSuccess: () => {
      toast.success(tCommon("success"));
      setCancellingToken(null);
      refetchInvitations();
    },
    onError: (err) => toast.error(getAxiosMsg(err, tCommon("error"))),
  });

  const deleteWorkspaceMut = useMutation({
    mutationFn: () => softDeleteWorkspace(workspaceId!),
    onSuccess: () => {
      toast.success(tCommon("success"));
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.push("/dashboard/workspaces");
    },
    onError: (err) => toast.error(getAxiosMsg(err, tCommon("error"))),
  });

  const pendingInvitations = invitations.filter((i) => i.status === "pending");
  const activeMembers      = members.filter((m) => m.status === "active");

  return (
    <>
      <div className="flex flex-col min-h-full">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div>
            <h1 className="text-lg font-bold leading-none text-foreground">
              {t("title")}
            </h1>
            {workspace && (
              <p className="text-xs text-muted-foreground mt-0.5">{cleanWorkspaceName(workspace.name)}</p>
            )}
          </div>
        </div>

        <div className="max-w-2xl space-y-10">
          {/* MEMBERS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-500" />
                <h2 className="text-sm font-semibold text-foreground">{t("active_members")}</h2>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {activeMembers.length}
                </span>
              </div>
              <Button
                size="sm"
                className="gap-1.5 h-8 text-xs"
                onClick={() => { setInviteEmail(""); setInviteRoleId("member"); setIsInviteOpen(true); }}
              >
                <UserPlus className="w-3.5 h-3.5" />
                {t("invite_member")}
              </Button>
            </div>

            <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
              {activeMembers.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {tCommon("no_data")}
                </div>
              )}
              {activeMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                >
                  <MemberAvatar name={member.user_name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {member.user_name ?? "Unknown"}
                      </span>
                      {workspace?.owner_id === member.user_id && (
                        <span title={tWs("owner")}><Crown className="w-3 h-3 text-amber-400 shrink-0" /></span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {member.user_email ?? "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {workspace?.owner_id === member.user_id && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-semibold">
                        <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                        {tWs("owner")}
                      </span>
                    )}
                    {isOwner && member.user_id !== currentUserId && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => setRemovingUserId(member.user_id)}
                        title={t("remove_member")}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PENDING INVITATIONS */}
          {pendingInvitations.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-foreground">{t("pending_invites")}</h2>
                <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {pendingInvitations.length}
                </span>
              </div>

              <div className="rounded-xl border border-border divide-y divide-border overflow-hidden">
                {pendingInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full border-2 border-dashed border-amber-400/40 flex items-center justify-center bg-amber-50 dark:bg-amber-900/10 shrink-0">
                      <Mail className="w-3.5 h-3.5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{inv.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Expires {new Date(inv.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusPill status={inv.status} />
                      {isOwner && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setCancellingToken(inv.token)}
                          title={t("cancel_invite")}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DANGER ZONE */}
          {isOwner && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h2 className="text-sm font-semibold text-destructive">{t("danger_title")}</h2>
              </div>

              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t("delete_btn")}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {t("danger_desc")}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="shrink-0 gap-1.5"
                    onClick={() => { setDeleteConfirmText(""); setIsDeleteOpen(true); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t("delete_btn")}
                  </Button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* INVITE MODAL */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-violet-500" />
              {t("invite_member")}
            </DialogTitle>
            <DialogDescription>
              {t("members_desc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{t("email_placeholder")}</label>
              <Input
                type="email"
                placeholder={t("email_placeholder")}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && inviteEmail) inviteMut.mutate(); }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>{tCommon("cancel")}</Button>
            <Button
              onClick={() => inviteMut.mutate()}
              disabled={!inviteEmail || inviteMut.isPending}
              className="gap-1.5"
            >
              {inviteMut.isPending
                ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                : <Mail className="w-3.5 h-3.5" />}
              {t("send_invite")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REMOVE MEMBER CONFIRM */}
      <Dialog open={!!removingUserId} onOpenChange={() => setRemovingUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <LogOut className="w-4 h-4" /> {t("remove_member")}
            </DialogTitle>
            <DialogDescription>
              {tCommon("confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemovingUserId(null)}>{tCommon("cancel")}</Button>
            <Button
              variant="destructive"
              disabled={removeMemberMut.isPending}
              onClick={() => removingUserId && removeMemberMut.mutate(removingUserId)}
            >
              {removeMemberMut.isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              {t("remove_member")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CANCEL INVITE CONFIRM */}
      <Dialog open={!!cancellingToken} onOpenChange={() => setCancellingToken(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-500">
              <XCircle className="w-4 h-4" /> {t("cancel_invite")}
            </DialogTitle>
            <DialogDescription>
              {tCommon("confirm")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancellingToken(null)}>{tCommon("cancel")}</Button>
            <Button
              variant="destructive"
              disabled={cancelInviteMut.isPending}
              onClick={() => cancellingToken && cancelInviteMut.mutate(cancellingToken)}
            >
              {cancelInviteMut.isPending && <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              {t("cancel_invite")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE WORKSPACE CONFIRM */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" /> {t("delete_modal_title")}
            </DialogTitle>
            <DialogDescription>
              {t("delete_modal_desc", { name: workspace?.name || "" })}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder={workspace?.name ?? "Type workspace name"}
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>{tCommon("cancel")}</Button>
            <Button
              variant="destructive"
              className="gap-1.5"
              disabled={deleteConfirmText !== workspace?.name || deleteWorkspaceMut.isPending}
              onClick={() => deleteWorkspaceMut.mutate()}
            >
              {deleteWorkspaceMut.isPending
                ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                : <Trash2 className="w-3.5 h-3.5" />}
              {t("delete_btn")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
