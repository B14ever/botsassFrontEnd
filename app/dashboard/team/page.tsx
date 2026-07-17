"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Crown, Mail, Trash2, Copy, Check, Plus, UserPlus, Clock } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/shared/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createOrg, getOrg, listMembers, inviteMember,
  removeMember, listPendingInvites, revokeInvite,
  type Organization, type OrgMember, type OrgInvite,
} from "@/lib/api/org";
import { fetchSubscription } from "@/lib/api/subscription";

const MAX_MEMBERS = 10;

function getInitials(name: string, email: string) {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return email.slice(0, 2).toUpperCase();
}

function AvatarCircle({ name, email, role }: { name: string; email: string; role: string }) {
  const colors: Record<string, string> = {
    owner: "bg-primary text-primary-foreground",
    member: "bg-secondary text-secondary-foreground border border-border",
  };
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${colors[role] ?? colors.member}`}>
      {getInitials(name, email)}
    </div>
  );
}

export default function TeamPage() {
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data: subscription } = useQuery({ queryKey: ["subscription"], queryFn: fetchSubscription });
  const isTeamPlan = subscription?.plan_code === "team";

  const { data: org, isLoading: orgLoading } = useQuery({
    queryKey: ["org"],
    queryFn: getOrg,
    enabled: isTeamPlan,
    retry: false,
  });

  const { data: members = [] } = useQuery<OrgMember[]>({
    queryKey: ["org-members"],
    queryFn: listMembers,
    enabled: !!org,
  });

  const { data: invites = [] } = useQuery<OrgInvite[]>({
    queryKey: ["org-invites"],
    queryFn: listPendingInvites,
    enabled: !!org,
  });

  const createOrgMutation = useMutation({
    mutationFn: () => createOrg(orgName),
    onSuccess: () => {
      toast.success("Organization created!");
      queryClient.invalidateQueries({ queryKey: ["org"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const inviteMutation = useMutation({
    mutationFn: () => inviteMember(inviteEmail),
    onSuccess: (invite) => {
      toast.success(`Invite sent! Share the link with ${inviteEmail}`);
      setInviteEmail("");
      queryClient.invalidateQueries({ queryKey: ["org-invites"] });
      // Auto-copy invite link
      const link = `${window.location.origin}/org/invite/${invite.token}`;
      void navigator.clipboard.writeText(link);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeMutation = useMutation({
    mutationFn: (userID: string) => removeMember(userID),
    onSuccess: () => {
      toast.success("Member removed");
      queryClient.invalidateQueries({ queryKey: ["org-members"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const revokeMutation = useMutation({
    mutationFn: (token: string) => revokeInvite(token),
    onSuccess: () => {
      toast.success("Invite revoked");
      queryClient.invalidateQueries({ queryKey: ["org-invites"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function copyInviteLink(token: string) {
    const link = `${window.location.origin}/org/invite/${token}`;
    void navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    toast.success("Invite link copied!");
  }

  const isOwner = org && members.find((m) => m.role === "owner")?.user_id === org.owner_id;
  const seatsFilled = members.length;
  const seatsLeft = MAX_MEMBERS - seatsFilled;

  // --- Not on Team Plan ---
  if (!isTeamPlan) {
    return (
      <Sidebar>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black font-outfit text-foreground">Team management</h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              Upgrade to the <span className="font-bold text-foreground">Team plan</span> to invite colleagues, share bots, and collaborate on projects.
            </p>
          </div>
          <a href="/dashboard/billing">
            <Button className="gap-2">
              <Crown className="w-4 h-4" /> View Team Plan
            </Button>
          </a>
        </div>
      </Sidebar>
    );
  }

  // --- No Org Yet ---
  if (!orgLoading && !org) {
    return (
      <Sidebar>
        <div className="max-w-md mx-auto mt-20 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Users className="w-7 h-7 text-emerald-600" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black font-outfit text-foreground">Create your team</h1>
            <p className="text-sm text-muted-foreground">Give your organization a name. You'll be the owner and can invite up to 9 more members.</p>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="e.g. Acme Corp"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && orgName.trim()) createOrgMutation.mutate(); }}
            />
            <Button
              className="w-full gap-2"
              disabled={!orgName.trim() || createOrgMutation.isPending}
              onClick={() => createOrgMutation.mutate()}
            >
              <Plus className="w-4 h-4" />
              {createOrgMutation.isPending ? "Creating..." : "Create organization"}
            </Button>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Users className="w-3 h-3" />
            Team
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-black text-foreground font-outfit tracking-tight">{org?.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {seatsFilled} of {MAX_MEMBERS} seats used · {seatsLeft} seat{seatsLeft !== 1 ? "s" : ""} remaining
              </p>
            </div>
            {/* Seat bar */}
            <div className="flex items-center gap-2 mt-1">
              {Array.from({ length: MAX_MEMBERS }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border ${i < seatsFilled ? "bg-primary border-primary" : "bg-secondary border-border"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Invite section — owner only */}
        {isOwner && seatsLeft > 0 && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Invite a member</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && inviteEmail.trim()) inviteMutation.mutate(); }}
                className="flex-1"
              />
              <Button
                onClick={() => inviteMutation.mutate()}
                disabled={!inviteEmail.trim() || inviteMutation.isPending}
                className="gap-2 shrink-0"
              >
                <Mail className="w-4 h-4" />
                {inviteMutation.isPending ? "Sending..." : "Send invite"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">An invite link will be generated. Share it with your teammate.</p>
          </div>
        )}

        {isOwner && seatsLeft === 0 && (
          <div className="rounded-xl border border-border bg-secondary/40 px-5 py-4 text-sm text-muted-foreground">
            🚫 Seat limit reached ({MAX_MEMBERS}/{MAX_MEMBERS}). Remove a member to invite someone new.
          </div>
        )}

        {/* Members table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-secondary/30 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Members</span>
            <span className="text-xs text-muted-foreground">{seatsFilled}/{MAX_MEMBERS}</span>
          </div>
          <div className="divide-y divide-border/60">
            {members.map((m) => (
              <div key={m.user_id} className="flex items-center gap-3 px-5 py-3.5">
                <AvatarCircle name={m.user_name} email={m.user_email} role={m.role} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{m.user_name || "—"}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.user_email}</p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  m.role === "owner"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-secondary text-muted-foreground border-border"
                }`}>
                  {m.role}
                </span>
                {isOwner && m.role !== "owner" && (
                  <button
                    onClick={() => removeMutation.mutate(m.user_id)}
                    className="w-7 h-7 rounded-lg border border-border hover:border-destructive hover:text-destructive text-muted-foreground flex items-center justify-center transition-colors ml-1"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Invites — owner only */}
        {isOwner && invites.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border bg-secondary/30">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Pending invites
              </span>
            </div>
            <div className="divide-y divide-border/60">
              {invites.map((inv) => (
                <div key={inv.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Expires {new Date(inv.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={() => copyInviteLink(inv.token)}
                    className="w-7 h-7 rounded-lg border border-border hover:border-primary text-muted-foreground hover:text-primary flex items-center justify-center transition-colors"
                    title="Copy invite link"
                  >
                    {copiedToken === inv.token ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => revokeMutation.mutate(inv.token)}
                    className="w-7 h-7 rounded-lg border border-border hover:border-destructive hover:text-destructive text-muted-foreground flex items-center justify-center transition-colors"
                    title="Revoke invite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
