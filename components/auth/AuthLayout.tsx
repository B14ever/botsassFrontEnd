"use client";

import { motion } from "framer-motion";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-6 bg-card border border-border rounded-xl p-8 md:p-10 relative z-10"
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <img src="/redas_logo.png" className="h-16 object-contain" alt="Redas Logo" />
          </div>
          <h1 className="text-3xl font-bold font-outfit tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground font-medium text-sm">{subtitle}</p>
        </div>

        {children}
      </motion.div>
    </div>
  );
}
