"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import Navbar12 from "@/components/ui/navbar-12";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const authStoreUser = useAuthStore((s) => s.user);
  const user = session?.user || authStoreUser;
  const userName = (user as any)?.name || (user as any)?.email;

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const desktopActions = (
    <div className="flex items-center gap-2">
      {userName ? (
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-foreground/85 hover:text-foreground transition-colors max-w-[130px] truncate py-1 px-2 rounded-md hover:bg-secondary/60"
          >
            <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{userName}</span>
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg font-medium text-xs px-3 h-8 gap-1.5 border-border/80 bg-secondary/40 hover:bg-secondary text-foreground hover:border-foreground/20 transition-all shadow-2xs"
            asChild
          >
            <Link href="/dashboard">
              Dashboard
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/70 transition-colors px-3 py-1.5 rounded-lg"
          >
            Log in
          </Link>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg font-medium text-xs px-3.5 h-8 border-border/80 bg-secondary/50 hover:bg-secondary text-foreground shadow-2xs hover:border-foreground/20 transition-all"
            asChild
          >
            <Link href="/register">Create Workspace</Link>
          </Button>
        </div>
      )}
      <ThemeToggle />
    </div>
  );

  const mobileActions = (
    <div className="flex flex-col gap-2">
      {userName ? (
        <Button
          variant="outline"
          className="w-full text-xs font-medium h-9 border-border/80 bg-secondary/50 hover:bg-secondary text-foreground"
          asChild
        >
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            className="w-full text-xs font-medium h-9 border-border/80 bg-secondary/50 hover:bg-secondary text-foreground"
            asChild
          >
            <Link href="/register">Create Workspace</Link>
          </Button>
          <Link
            href="/login"
            className="text-center text-xs font-medium text-foreground/80 hover:text-foreground py-2 hover:bg-secondary/60 rounded-md transition-colors"
          >
            Log in
          </Link>
        </>
      )}
    </div>
  );

  return (
    <Navbar12
      brandName="Redas"
      navItems={navLinks}
      actions={desktopActions}
      mobileActions={mobileActions}
    />
  );
}
