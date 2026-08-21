"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spokes } from "@/components/loading-ui/spokes";

/**
 * Redirect shim: /invite/[token] → /org/invite/[token]
 *
 * This ensures any invite links that were generated with the old
 * /invite/ path (e.g. from early emails) still work correctly.
 */
export default function InviteRedirectPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/org/invite/${token}`);
  }, [token, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <Spokes className="size-16" />
        <p className="text-sm text-muted-foreground">Redirecting to invitation page…</p>
      </div>
    </div>
  );
}
