'use client';

import { signOut, useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  CreditCard,
  Bot,
  Sparkles,
  Building2,
  Lock,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchSubscription } from '@/lib/api/subscription';
import { fetchUsage } from '@/lib/api/usage';
import WorkspaceSwitcher from './WorkspaceSwitcher';
import ThemeToggle from './ThemeToggle';
import { cleanWorkspaceName } from '@/lib/utils';

import { useWorkspaceStore } from '@/store/workspaceStore';
import { getWorkspaceUsage, listWorkspaces, WorkspaceUsage } from '@/lib/api/workspace';

import { useWorkspacePermissions } from '@/hooks/useWorkspacePermissions';
import { PLATFORM_NAME } from '@/constants';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { data: session } = useSession();
  const { activeWorkspaceId, workspaces, setWorkspaces } = useWorkspaceStore();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currentUserId = (session?.user as { id?: string })?.id || user?.id;

  const { isOwner, canManageWorkspace } = useWorkspacePermissions();

  // Auto-initialize user's workspaces
  const { data: fetchedWorkspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: listWorkspaces,
    retry: false,
  });

  useEffect(() => {
    if (fetchedWorkspaces && fetchedWorkspaces.length > 0) {
      setWorkspaces(fetchedWorkspaces);
    }
  }, [fetchedWorkspaces, setWorkspaces]);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const isPersonalAccount = !activeWorkspace || !currentUserId || activeWorkspace.owner_id === currentUserId;

  // Fetch subscription and usage
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: fetchSubscription,
    retry: false,
  });

  const { data: usage } = useQuery({
    queryKey: ['usage', activeWorkspaceId],
    queryFn: fetchUsage,
    retry: false,
  });

  const { data: wsUsage } = useQuery<WorkspaceUsage>({
    queryKey: ['workspace-usage', activeWorkspaceId],
    queryFn: () => getWorkspaceUsage(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
    retry: false,
  });

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    router.push('/login');
  };

  const planCode = wsUsage?.plan_code || subscription?.plan_code || 'free';

  const badgeStyles: Record<string, string> = {
    free: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    standard: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50',
    team: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50',
    pro: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50',
  };
  const planStyle = badgeStyles[planCode] || badgeStyles.free;

  // Navigation Items Strategy:
  // If Personal Account -> Full personal navigation (Dashboard, Workspaces, Agents, Settings, Plans, Billing)
  // If Invited Workspace Account -> ONLY show that Workspace & Workspace Settings (no unrelated global features)
  const navItems = isPersonalAccount
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
        { name: 'Workspaces', href: '/dashboard/workspaces', icon: Building2, exact: false },
        { name: 'Agents', href: '/dashboard/agents', icon: Bot, exact: false },
        { name: 'Usage', href: '/dashboard/usage', icon: Activity, exact: false },
        { name: 'Settings', href: '/dashboard/settings', icon: User, exact: false },
        { name: 'Plans', href: '/dashboard/plans', icon: Sparkles, exact: false },
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard, exact: false },
      ]
    : [
        {
          name: activeWorkspace?.name || 'Workspace',
          href: `/dashboard/workspaces/${activeWorkspace?.id}`,
          icon: Building2,
          exact: true,
        },
        ...(canManageWorkspace
          ? [
              {
                name: 'Workspace Settings',
                href: `/dashboard/workspaces/${activeWorkspace?.id}/settings`,
                icon: Settings,
                exact: false,
              },
            ]
          : []),
      ];

  const getRemainingDays = (endString?: string) => {
    if (!endString) return 'Resets soon';
    const end = new Date(endString);
    const today = new Date();
    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Resets today';
    return `Resets in ${days} ${days === 1 ? 'day' : 'days'}`;
  };

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const renderNavContent = () => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {!isPersonalAccount && (
          <div className="px-3 py-2 mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-medium flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Invited Workspace Mode</span>
          </div>
        )}

        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                isActive
                  ? 'text-foreground bg-muted/40 border border-border/40 font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM FOOTER SECTION: Account Switcher & Theme */}
      <div className="p-3 border-t border-border/60 bg-muted/10 space-y-3 shrink-0">
        {/* Account / Workspace Switcher at the bottom of the sidebar */}
        <div className="space-y-1.5">
          <WorkspaceSwitcher dropDirection="up" fullWidth />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
          <span className="font-medium text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background font-sans">
      {/* GLOBAL NAVBAR */}
      <header className="h-16 flex items-center justify-between border-b border-border bg-card px-6 shrink-0 relative z-40">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0 h-9 w-9 p-0 hover:bg-muted"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Redas Logo */}
          <Link href="/dashboard" className="flex items-center">
            <img src="/redas_logo.png" className="h-8 object-contain shrink-0" alt={`${PLATFORM_NAME} logo`} />
          </Link>

          <span className="text-muted-foreground/30 font-light hidden sm:inline">/</span>

          {/* Active Workspace Title & Plan Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              {activeWorkspace ? cleanWorkspaceName(activeWorkspace.name) : 'Dashboard'}
            </span>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${planStyle}`}>
              {planCode}
            </span>
          </div>
        </div>

        {/* Profile Circle Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="rounded-full h-8 w-8 p-0 border border-border flex items-center justify-center shrink-0 hover:bg-muted"
          >
            {session?.user?.image || user?.avatar_url ? (
              <img src={session?.user?.image || user?.avatar_url} className="w-7 h-7 rounded-full" alt="avatar" />
            ) : (
              <div className="w-7 h-7 bg-secondary rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-foreground">
                {session?.user?.name ? session.user.name.slice(0, 2).toUpperCase() : (user?.email ? user.email.slice(0, 2).toUpperCase() : 'US')}
              </div>
            )}
          </Button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                {/* Backdrop to close click outside */}
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-lg z-50"
                >
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{session?.user?.name || 'User'}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email || user?.email}</p>
                  </div>
                  <Link href="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="w-full block">
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-start gap-2.5 px-3 py-2 text-xs text-foreground hover:bg-muted transition-all rounded-md h-9 border-none bg-transparent"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold font-sans">General Settings</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-2.5 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-destructive/10 transition-all rounded-md h-9 border-none bg-transparent"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="font-semibold font-sans">Sign Out</span>
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* LOWER GRID LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card shrink-0 h-full overflow-hidden">
          {renderNavContent()}
        </aside>

        {/* MOBILE SIDEBAR DRAWERS */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setIsMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-16 left-0 bottom-0 w-64 bg-card border-r border-border z-40 md:hidden flex flex-col overflow-hidden"
              >
                {renderNavContent()}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* CONTENT PANEL */}
        <main className="flex-1 bg-muted/20 overflow-y-auto antialiased flex flex-col justify-stretch p-3 md:p-5">
          <div className="bg-card flex-1 border border-border rounded-xl shadow-none overflow-hidden relative flex flex-col">
            <div className="relative flex-1 overflow-y-auto custom-scrollbar p-5 md:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
