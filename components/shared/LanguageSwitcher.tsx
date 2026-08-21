"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", short: "EN", badge: "EN" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", short: "አማ", badge: "AM" },
  { code: "om", name: "Oromo", nativeName: "Afaan Oromoo", short: "ORO", badge: "OM" },
  { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ", short: "ትግ", badge: "TI" },
  { code: "so", name: "Somali", nativeName: "Soomaali", short: "SOM", badge: "SO" },
] as const;

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export default function LanguageSwitcher({
  className,
  showLabel = false,
}: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLang =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLocale) ||
    SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    // Set cookie for next-intl server & Axios interceptor
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLocale;

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={showLabel ? "sm" : "default"}
          disabled={isPending}
          className={cn(
            "h-8 px-2.5 rounded-full text-foreground/80 hover:text-foreground hover:bg-secondary/60 transition-colors shrink-0 gap-1.5 font-medium border-0",
            className
          )}
          aria-label="Change language"
        >
          <Globe className="h-3.5 w-3.5 opacity-70 shrink-0" />
          <span className="text-xs font-semibold tracking-wide">
            {showLabel ? currentLang.nativeName : currentLang.badge}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 p-1 bg-popover/95 backdrop-blur-md border-border shadow-md">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === currentLocale;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 text-xs rounded-md cursor-pointer transition-colors my-0.5",
                isSelected
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-secondary text-foreground"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className={cn(
                  "w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] shrink-0",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}>
                  {lang.badge}
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-medium text-xs leading-none">{lang.nativeName}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{lang.name}</span>
                </div>
              </div>
              {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
