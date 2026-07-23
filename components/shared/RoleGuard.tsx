"use client";

import { useWorkspacePermissions } from "@/hooks/useWorkspacePermissions";
import { type PermissionKey } from "@/lib/api/workspace";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

interface RoleGuardProps {
  allowedRoles?: string[];
  requireOwner?: boolean;
  requiredPermission?: PermissionKey;
  requiredPermissions?: PermissionKey[];
  requiredPermissionLabel?: string;
  children: React.ReactNode;
}

export default function RoleGuard({
  allowedRoles = ["owner", "admin"],
  requireOwner = false,
  requiredPermission,
  requiredPermissions,
  requiredPermissionLabel = "Owner or Admin",
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const { userRoleId, userRoleName, isOwner, hasPermission, hasAnyPermission, isLoading } = useWorkspacePermissions();

  if (isLoading) {
    return (
      <Sidebar>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Checking workspace permissions...</p>
        </div>
      </Sidebar>
    );
  }

  let isAllowed = false;

  if (requireOwner) {
    isAllowed = isOwner;
  } else if (requiredPermission) {
    isAllowed = hasPermission(requiredPermission);
  } else if (requiredPermissions && requiredPermissions.length > 0) {
    isAllowed = hasAnyPermission(requiredPermissions);
  } else {
    isAllowed = isOwner || allowedRoles.includes(userRoleId);
  }

  if (!isAllowed) {
    return (
      <Sidebar>
        <div className="flex flex-col items-center justify-center min-h-[65vh] p-6 text-center max-w-md mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-outfit text-foreground tracking-tight">
              Access Restricted
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You are signed in as <span className="font-semibold text-foreground capitalize">{userRoleName}</span>.
              This area requires <strong className="text-foreground">{requireOwner ? "Workspace Owner" : requiredPermissionLabel}</strong> permissions for this workspace.
            </p>
          </div>

          <div className="flex gap-3 w-full pt-2">
            <Button
              variant="outline"
              className="flex-1 gap-2 text-xs"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Button>
            <Button
              className="flex-1 text-xs font-semibold"
              onClick={() => router.push("/dashboard/agents")}
            >
              Go to Agents
            </Button>
          </div>
        </div>
      </Sidebar>
    );
  }

  return <>{children}</>;
}
