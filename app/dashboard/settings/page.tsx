"use client";

import { useAuthStore } from "@/store/authStore";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscription } from "@/lib/api/subscription";
import { getOrg } from "@/lib/api/org";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building, Shield, Sparkles, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function GeneralSettingsPage() {
  const { user } = useAuthStore();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all password fields");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
  });

  const { data: org } = useQuery({
    queryKey: ["org"],
    queryFn: getOrg,
    enabled: subscription?.plan_code === "team",
    retry: false,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile settings updated!");
  };

  return (
    <Sidebar>
      <div className="space-y-6 pb-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              Account
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-sans">
              General Settings
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Manage your personal account settings and profile details.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          <Card className="border-border bg-card rounded-xl shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-sm font-bold">Profile Information</CardTitle>
                  <CardDescription className="text-[10px] mt-0.5">Update your display name and view account details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session?.user?.email || user?.email || ""}
                    disabled
                    className="bg-secondary/50 border-border text-muted-foreground cursor-not-allowed rounded-md h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <p className="text-[10px] text-muted-foreground/80">Your email address cannot be changed.</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Display Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border text-foreground rounded-md h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <Button type="submit" size="sm" className="rounded-md font-semibold px-4 h-9">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Org details Card */}
          <Card className="border-border bg-card rounded-xl shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-sm font-bold">Organization Settings</CardTitle>
                  <CardDescription className="text-[10px] mt-0.5">View your workspace and team affiliation.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {subscription?.plan_code === "team" ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Organization Workspace</Label>
                    <Input
                      type="text"
                      disabled
                      value={org?.name || "Loading organization..."}
                      className="bg-secondary/50 border-border text-muted-foreground cursor-not-allowed rounded-md h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg border border-border flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-xs font-semibold text-foreground">You are part of a team organization.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/40 rounded-lg border border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="text-xs font-bold text-foreground">Upgrade to Team Plan</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Collaborative features, team workspaces, shared custom agents, and high volume limits are only available on the Team or Enterprise tier.
                    </p>
                    <Button variant="outline" size="sm" className="mt-1 border-border text-foreground hover:bg-secondary rounded-md h-8 text-[11px] font-semibold" onClick={() => window.location.href = '/dashboard/billing'}>
                      View pricing plans
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border-border bg-card rounded-xl shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-sm font-bold">Change Password</CardTitle>
                  <CardDescription className="text-[10px] mt-0.5">Ensure your account is using a secure password.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-password" className="text-xs font-semibold text-muted-foreground">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-secondary border-border text-foreground rounded-md h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-xs font-semibold text-muted-foreground">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-secondary border-border text-foreground rounded-md h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-xs font-semibold text-muted-foreground">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-secondary border-border text-foreground rounded-md h-9 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <Button type="submit" size="sm" className="rounded-md font-semibold px-4 h-9">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Sidebar>
  );
}
