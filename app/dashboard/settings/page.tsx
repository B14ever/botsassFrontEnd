"use client";

import { useAuthStore } from "@/store/authStore";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Building, Key, Shield, AlertCircle, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { getWorkspace } from "@/lib/api/workspace";
import LanguageSwitcher, { SUPPORTED_LANGUAGES } from "@/components/shared/LanguageSwitcher";
import { useLocale, useTranslations } from "next-intl";

export default function GeneralSettingsPage() {
  const locale = useLocale();
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { user } = useAuthStore();
  const { data: session } = useSession();
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  const [name, setName] = useState("");
  
  // Password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { data: workspace } = useQuery({
    queryKey: ["workspace", activeWorkspaceId],
    queryFn: () => getWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(tCommon("saved"));
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    setPasswordError(null);
    toast.success(tCommon("success"));
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="space-y-6">
        {/* Card 1: Profile Information */}
        <div className="border border-border/80 bg-card rounded-lg p-5 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-secondary border border-border/50 flex items-center justify-center text-primary shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{t("profile_info")}</h2>
              <p className="text-[11px] text-muted-foreground">{t("profile_info_sub")}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">{t("email_label")}</Label>
              <Input
                id="email"
                type="email"
                value={session?.user?.email || user?.email || ""}
                disabled
                className="bg-secondary/40 text-muted-foreground cursor-not-allowed text-xs h-9"
              />
              <p className="text-[10px] text-muted-foreground">{t("email_sub")}</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">{t("display_name")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("name_placeholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xs h-9 bg-background"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <Button type="submit" size="sm">
                {t("save_profile")}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPasswordError(null);
                  setIsPasswordModalOpen(true);
                }}
                className="gap-2 text-xs h-8"
              >
                <Key className="w-3.5 h-3.5" />
                {t("change_password_btn")}
              </Button>
            </div>
          </form>
        </div>

        {/* Card 2: Platform Language Selection */}
        <div className="border border-border/80 bg-card rounded-lg p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-secondary border border-border/50 flex items-center justify-center text-primary shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">{t("language_title")}</h2>
                <p className="text-[11px] text-muted-foreground">{t("language_desc")}</p>
              </div>
            </div>
            <LanguageSwitcher showLabel />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === locale;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    document.cookie = `NEXT_LOCALE=${lang.code}; path=/; max-age=31536000; SameSite=Lax`;
                    document.documentElement.lang = lang.code;
                    window.location.reload();
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/30"
                      : "border-border/60 bg-secondary/30 hover:bg-secondary text-foreground hover:border-border"
                  }`}
                >
                  <span className="w-8 h-8 rounded-md bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mb-1.5">{lang.badge}</span>
                  <span className="text-xs font-semibold">{lang.nativeName}</span>
                  <span className="text-[10px] text-muted-foreground">{lang.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Change Password Modal (Dialog) */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("modal_pwd_title")}</DialogTitle>
            <DialogDescription>
              {t("modal_pwd_desc")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePassword} className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="current-password" className="text-xs font-medium text-muted-foreground">{t("current_pwd")}</Label>
              <Input
                id="current-password"
                type="password"
                placeholder={t("current_pwd")}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                className="text-xs h-9 bg-background"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="new-password" className="text-xs font-medium text-muted-foreground">{t("new_pwd")}</Label>
              <Input
                id="new-password"
                type="password"
                placeholder={t("new_pwd")}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                className="text-xs h-9 bg-background"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm-password" className="text-xs font-medium text-muted-foreground">{t("confirm_pwd")}</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder={t("confirm_pwd")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                className="text-xs h-9 bg-background"
              />
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(false)}>
                {tCommon("cancel")}
              </Button>
              <Button type="submit" size="sm">
                {t("update_pwd_btn")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
