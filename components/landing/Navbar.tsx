"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import Navbar12 from "@/components/ui/navbar-12";
import { ArrowRight, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const tNav = useTranslations("nav");
  const { data: session } = useSession();
  const authStoreUser = useAuthStore((s) => s.user);
  const user = session?.user || authStoreUser;
  const userName = (user as any)?.name || (user as any)?.email;

  const navLinks = [
    { label: tNav("features"), href: "#features" },
    { label: tNav("how_it_works"), href: "#how-it-works" },
    { label: tNav("pricing"), href: "#pricing" },
    { label: tNav("security"), href: "#security" },
  ];

  const desktopActions = (
    <div className="flex items-center gap-2">
      {userName ? (
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-foreground/90 hover:text-foreground hover:bg-secondary/60 transition-all h-8 pl-1 pr-2.5 rounded-full"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[130px] truncate font-medium">{userName}</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground ml-0.5" />
          </Link>
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/login"
            className="text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/70 transition-colors px-3 py-1.5 rounded-lg"
          >
            {tNav("login")}
          </Link>
          <Button
            size="sm"
            className="rounded-lg font-semibold text-xs px-3.5 h-8 shadow-xs"
            asChild
          >
            <Link href="/signup">{tNav("get_started")}</Link>
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1.5 pl-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );

  const mobileActions = (
    <div className="flex flex-col gap-2">
      {userName ? (
        <Button
          size="sm"
          className="w-full text-xs font-semibold h-9"
          asChild
        >
          <Link href="/dashboard">{tNav("dashboard")}</Link>
        </Button>
      ) : (
        <>
          <Button
            size="sm"
            className="w-full text-xs font-semibold h-9"
            asChild
          >
            <Link href="/signup">{tNav("get_started")}</Link>
          </Button>
          <Link
            href="/login"
            className="text-center text-xs font-medium text-foreground/80 hover:text-foreground py-2 hover:bg-secondary/60 rounded-md transition-colors"
          >
            {tNav("login")}
          </Link>
        </>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <LanguageSwitcher showLabel />
        <ThemeToggle />
      </div>
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
