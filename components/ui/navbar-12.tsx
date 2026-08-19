"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
}

export interface Navbar12Props {
  logo?: React.ReactNode;
  brandName?: string;
  badge?: string;
  navItems?: NavItem[];
  actions?: React.ReactNode;
  mobileActions?: React.ReactNode;
  className?: string;
}

export default function Navbar12({
  logo,
  brandName = "Redas",
  badge = "AI Agents for Business",
  navItems = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Channels", href: "#channels" },
    { label: "Reports & Decks", href: "#doc-gen" },
    { label: "Pricing", href: "#pricing" },
    { label: "Security", href: "#security" },
  ],
  actions,
  mobileActions,
  className,
}: Navbar12Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 ease-out",
        scrolled
          ? "bg-background/80 dark:bg-background/80 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {logo ? (
              logo
            ) : (
              <img
                src="/redas_icon.png"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 rounded-md"
                alt="Logo"
              />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {brandName}
              </span>
              {badge && (
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                  {badge}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs lg:text-[13px] font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/70 px-3 py-1.5 rounded-lg transition-all duration-150"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {actions}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg border border-border/60 bg-secondary/40 text-foreground hover:bg-secondary transition-colors focus:outline-none shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 transition-transform rotate-90 duration-200" />
              ) : (
                <Menu className="w-4 h-4 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Drop-down Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-b border-border/80 bg-background/95 dark:bg-background/95 backdrop-blur-2xl px-6 py-4 space-y-4 md:hidden"
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground/85 hover:text-foreground hover:bg-secondary/70 px-3.5 py-2.5 rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {mobileActions && (
              <div
                className="pt-3 border-t border-border/60 flex flex-col gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {mobileActions}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
