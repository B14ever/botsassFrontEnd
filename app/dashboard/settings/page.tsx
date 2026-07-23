"use client";

import { useAuthStore } from "@/store/authStore";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/shared/Sidebar";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Building, Key, Shield, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { getWorkspace } from "@/lib/api/workspace";

export default function GeneralSettingsPage() {
  const { user } = useAuthStore();
  const { data: session } = useSession();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  const [name, setName] = useState("");
  
  // Password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { data: workspace } = useQuery({
    queryKey: ["workspace", activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile settings updated!");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    setPasswordError(null);
    toast.success("Password changed successfully");
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <Sidebar>
      <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <PageHeader
          title="General Profile"
          description="Manage your personal identity, email address, and security authentication credentials."
        />

        <div className="space-y-6">
          {/* Card 1: Profile Information */}
          <div className="border border-border/80 bg-card rounded-lg p-5 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-secondary border border-border/50 flex items-center justify-center text-primary shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Profile Information</h2>
                <p className="text-[11px] text-muted-foreground">Personal identity details and authentication preferences.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={session?.user?.email || user?.email || ""}
                  disabled
                  className="bg-secondary/40 text-muted-foreground cursor-not-allowed text-xs h-9"
                />
                <p className="text-[10px] text-muted-foreground">Email address is managed by your single sign-on provider.</p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Display Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs h-9 bg-background"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <Button type="submit" size="sm">
                  Save Profile
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPasswordError(null);
                    setIsPasswordModalOpen(true);
                  }}
                  className="gap-2 text-xs h-8"
                >
                  <Key className="w-3.5 h-3.5" />
                  Change Password
                </Button>
              </div>
            </form>
          </div>

          </div>

        {/* Change Password Modal (Dialog) */}
        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Ensure your account is using a strong, unique security password.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSavePassword} className="space-y-3 py-2">
              <div className="space-y-1">
                <Label htmlFor="current-password" className="text-xs font-medium text-muted-foreground">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  className="text-xs h-9 bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-password" className="text-xs font-medium text-muted-foreground">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  className="text-xs h-9 bg-background"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm-password" className="text-xs font-medium text-muted-foreground">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  className="text-xs h-9 bg-background"
                />
              </div>

              {passwordError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Update Password
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Sidebar>
  );
}
