"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Users, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getInviteInfo, acceptInvite } from "@/lib/api/org";

export default function InviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  const { data: invite, isLoading, isError } = useQuery({
    queryKey: ["invite", token],
    queryFn: () => getInviteInfo(token),
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptInvite(token),
    onSuccess: (org) => {
      setAccepted(true);
      toast.success(`You've joined ${org.name}!`);
      setTimeout(() => router.push("/dashboard/team"), 1500);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Logo */}
        <img src="/redas_logo.png" className="h-10 object-contain mx-auto" alt="Redas" />

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Loading invite...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-black font-outfit text-foreground">Invite not found</h1>
              <p className="text-sm text-muted-foreground mt-1">This invite link has expired, been revoked, or already used.</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </div>
        )}

        {/* Valid invite */}
        {invite && !accepted && (
          <div className="space-y-5">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
              <Users className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-black font-outfit text-foreground">You've been invited</h1>
              <p className="text-sm text-muted-foreground">
                Join <span className="font-semibold text-foreground">{invite.org_name}</span> as a <span className="font-semibold text-foreground">{invite.role}</span>.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-left space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization</span>
                <span className="font-semibold text-foreground">{invite.org_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your role</span>
                <span className="font-semibold text-foreground capitalize">{invite.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires</span>
                <span className="font-semibold text-foreground">
                  {new Date(invite.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
            <Button
              className="w-full gap-2"
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending}
            >
              {acceptMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Joining...</>
              ) : (
                "Accept invitation"
              )}
            </Button>
            <p className="text-xs text-muted-foreground">You must be signed in to accept this invite.</p>
          </div>
        )}

        {/* Success */}
        {accepted && (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-black font-outfit text-foreground">Welcome to the team!</h1>
              <p className="text-sm text-muted-foreground mt-1">Redirecting you to the team dashboard...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
