"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthAnimationSection from "@/components/auth/AuthAnimationSection";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-x-hidden selection:bg-primary/20">
      {/* Transparent Top Header (Logo Redirecting to Home) */}
      <header className="absolute top-0 inset-x-0 z-50 w-full bg-transparent">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-16 md:h-18">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/redas_icon.png"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 rounded-md"
                alt="Logo"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  Redas
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                  AI Agents for Business
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Left Form, Right Animation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full">
        {/* Form Section (Left) */}
        <div className="w-full min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 pt-20 sm:pt-24 lg:pt-24 relative z-10 bg-background">
          {/* Main Centered Form (No Card, Flat on Background) */}
          <div className="w-full max-w-sm mx-auto my-auto py-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Heading */}
              <div className="text-left space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold font-outfit tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>

              {/* Form Content */}
              <div className="w-full space-y-4">
                {children}
              </div>
            </motion.div>
          </div>

          {/* Bottom Footer Note */}
          <div className="w-full text-left text-xs text-muted-foreground pt-4">
            <p>© {new Date().getFullYear()} Redas AI. All rights reserved.</p>
          </div>
        </div>

        {/* Animation Section (Right) */}
        <div className="hidden lg:block w-full h-full min-h-screen bg-background overflow-hidden relative">
          <AuthAnimationSection />
        </div>
      </div>
    </div>
  );
}
