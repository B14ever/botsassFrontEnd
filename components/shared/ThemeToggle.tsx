"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-lg border border-border/60 bg-secondary/40 text-muted-foreground shrink-0",
          className
        )}
        disabled
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-8 w-8 rounded-lg border border-border/60 bg-secondary/40 hover:bg-secondary text-foreground hover:border-border transition-all duration-150 relative shrink-0",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 shrink-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-400 shrink-0" />
    </Button>
  );
}
