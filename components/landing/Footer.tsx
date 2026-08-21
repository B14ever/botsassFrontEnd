"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const tNav = useTranslations("nav");
  const tLanding = useTranslations("landing.footer");

  return (
    <footer className="border-t border-border bg-card py-12 text-xs">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <img
              src="/redas_icon.png"
              className="w-6 h-6 object-contain shrink-0 rounded"
              alt="Redas logo"
            />
            <span className="text-sm font-bold tracking-tight text-foreground">Redas</span>
          </div>
          <p className="max-w-sm text-xs text-muted-foreground leading-relaxed">
            {tLanding("desc")}
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-xs font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            {tNav("features")}
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            {tNav("how_it_works")}
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            {tNav("pricing")}
          </a>
          <a href="#security" className="hover:text-foreground transition-colors">
            {tNav("security")}
          </a>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-medium text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Redas. {tLanding("copyright")}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
