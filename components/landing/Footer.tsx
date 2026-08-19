"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
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
            AI agents trained on your business documents — deployed to your website, WhatsApp, and
            Telegram, billed in Birr.
          </p>
        </div>

        <nav className="flex flex-wrap gap-5 text-xs font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] font-medium text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Redas. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  );
}
