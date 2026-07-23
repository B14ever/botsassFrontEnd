"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Redirecting to invitation page…</p>
      </div>
    </div>
  );
}
