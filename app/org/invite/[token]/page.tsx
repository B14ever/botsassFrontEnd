"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Users, CheckCircle, XCircle, Loader2, User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInvitationInfo, acceptInvitation } from "@/lib/api/workspace";
import { useAuthStore } from "@/store/authStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import api from "@/lib/api";
import { getAxiosErrorMessage } from "@/lib/api/errors";

export default function InviteAcceptPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const { user, token: authToken, setAuth } = useAuthStore();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" || (!!user && !!authToken);
  const currentUserEmail = session?.user?.email || user?.email;

  // Form states for unauthenticated users
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [forceSignup, setForceSignup] = useState(false);

  const { data: invite, isLoading, isError } = useQuery({
    queryKey: ["workspace-invite", token],
    queryFn: () => getInvitationInfo(token),
    retry: false,
  });

  const acceptMutation = useMutation({
    mutationFn: () => acceptInvitation(token),
    onSuccess: (workspace) => {
      setAccepted(true);
      if (workspace && workspace.id) {
        useWorkspaceStore.getState().setActiveWorkspaceId(workspace.id);
      }
      toast.success(`You've joined ${workspace.name || "the workspace"}!`);
      setTimeout(() => router.push("/dashboard"), 1500);
    },
    onError: (e: unknown) => {
      const msg = getAxiosErrorMessage(e, "Failed to accept invitation");
      toast.error(msg);
      if (msg.toLowerCase().includes("user not found") || msg.toLowerCase().includes("sign up") || msg.toLowerCase().includes("log in")) {
        useAuthStore.getState().logout();
        setForceSignup(true);
      }
    },
  });

  const handleAccountAndAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invite) return;

    if (!fullName.trim()) return toast.error("Please enter your full name");
    if (!password) return toast.error("Please enter a password");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setAuthLoading(true);
    try {
      // Purge any stale tokens before signing up
      useAuthStore.getState().logout();

      // Create account for the invited email
      const res = await api.post("/auth/signup", {
        name: fullName.trim(),
        email: invite.email,
        password: password,
      });

      const authRes = res.data;
      if (authRes?.token && authRes?.user) {
        setAuth(authRes.user, authRes.token);
      }

      // Automatically accept the invite with new session
      await acceptMutation.mutateAsync();
    } catch (err: unknown) {
      toast.error(getAxiosErrorMessage(err, "Account creation failed"));
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <img src="/redas_logo.png" className="h-10 object-contain mx-auto" alt="Redas" />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">Loading invitation details...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="space-y-4 bg-card border border-border rounded-2xl p-6">
            <div className="w-14 h-14 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-black font-outfit text-foreground">Invite not found</h1>
              <p className="text-sm text-muted-foreground mt-1">This invite link has expired, been revoked, or already used.</p>
            </div>
            <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </div>
        )}

        {/* Valid invite */}
        {invite && !accepted && (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6 text-left shadow-xl">
            {invite.status === "accepted" ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-black font-outfit text-foreground tracking-tight">Already Accepted</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    You're already a member of <strong className="text-foreground">{invite.workspace_name || "this workspace"}</strong>.
                  </p>
                </div>
                <Button className="w-full h-11 text-base font-semibold gap-2" onClick={() => router.push("/dashboard/team")}>
                  Go to Workspace <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-2xl font-black font-outfit text-foreground tracking-tight">You're invited!</h1>
                  <p className="text-sm text-muted-foreground">
                    Join <strong className="text-foreground">{invite.workspace_name || "Workspace"}</strong> as a <span className="capitalize text-primary font-semibold">{invite.role_name || invite.role_id}</span>.
                  </p>
                </div>

                {/* Invite Info Badge */}
                <div className="rounded-xl border border-border bg-secondary/30 p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invited Email</span>
                    <span className="font-semibold text-foreground">{invite.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="font-semibold text-foreground">
                      {invite.expires_at ? new Date(invite.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "7 days"}
                    </span>
                  </div>
                </div>

                {/* If Already Logged In */}
                {isAuthenticated && !forceSignup ? (
                  <div className="space-y-3 pt-2">
                    <Button
                      className="w-full h-11 text-base font-semibold gap-2"
                      onClick={() => acceptMutation.mutate()}
                      disabled={acceptMutation.isPending}
                    >
                      {acceptMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Accepting...</>
                      ) : (
                        <>Accept invitation <ArrowRight className="w-4 h-4" /></>
                      )}
                    </Button>
                    <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2 pt-1">
                      <span>Signed in as <strong className="text-foreground">{currentUserEmail}</strong></span>
                      {currentUserEmail !== invite.email && (
                        <button
                          type="button"
                          onClick={() => setForceSignup(true)}
                          className="text-primary hover:underline font-semibold cursor-pointer"
                        >
                          Sign up as {invite.email}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Direct Inline Registration Form */
                  <form onSubmit={handleAccountAndAccept} className="space-y-4 pt-1">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            type="text"
                            required
                            placeholder="Enter full name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10 h-11 bg-secondary/50 border-border text-foreground"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground ml-1">Create Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-11 bg-secondary/50 border-border text-foreground"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground ml-1">Confirm Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 pr-10 h-11 bg-secondary/50 border-border text-foreground"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={authLoading || acceptMutation.isPending}
                      className="w-full h-11 text-base font-semibold gap-2 bg-primary hover:bg-primary/90 text-white transition-all"
                    >
                      {authLoading || acceptMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                      ) : (
                        <>Create Account & Join <ArrowRight className="w-4 h-4" /></>
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}
          </div>
        )}

        {/* Success */}
        {accepted && (
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black font-outfit text-foreground">Welcome to the team!</h1>
              <p className="text-sm text-muted-foreground mt-1">Your account is ready and you've joined the team. Redirecting...</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
