'use client';

import { signOut, useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  CreditCard,
  Folder,
  Users,
  ChevronDown,
  Bot,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchSubscription } from '@/lib/api/subscription';
import { fetchUsage } from '@/lib/api/usage';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Fetch subscription and usage
  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: fetchSubscription,
    retry: false,
  });

  const { data: usage } = useQuery({
    queryKey: ['usage'],
    queryFn: fetchUsage,
    retry: false,
  });

  // Determine if Settings sub-menu is active (i.e. we are on billing, team, plans, or general settings pages)
  const isSettingsActive =
    (pathname.startsWith('/dashboard/settings') && !pathname.match(/\/dashboard\/settings\/.+/)) ||
    pathname.startsWith('/dashboard/team') ||
    pathname.startsWith('/dashboard/billing') ||
    pathname.startsWith('/dashboard/plans');

  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsActive);

  // Keep dropdown open if user navigates to it
  useEffect(() => {
    if (isSettingsActive) {
      setIsSettingsOpen(true);
    }
  }, [pathname, isSettingsActive]);

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    router.push('/login');
  };

  const planCode = subscription?.plan_code || 'free';
  const isTeam = planCode === 'team';

  // Format subscription badge styling
  const badgeStyles: Record<string, string> = {
    free: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    standard: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/50',
    team: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50',
    pro: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200/50 dark:border-violet-800/50',
  };
  const planStyle = badgeStyles[planCode] || badgeStyles.free;

  // Navigation Items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Agents', href: '/dashboard/agents', icon: Bot, exact: false },
    { name: 'Projects', href: '/dashboard/projects', icon: Folder, exact: false },
    {
      name: 'Settings',
      icon: Settings,
      submenu: [
        { name: 'General', href: '/dashboard/settings' },
        { name: 'Members', href: '/dashboard/team' },
        { name: 'Plans', href: '/dashboard/plans' },
        { name: 'Billing', href: '/dashboard/billing' },
      ],
    },
  ];

  // Calculate remaining days for display
  const getRemainingDays = (endString?: string) => {
    if (!endString) return 'Resets soon';
    const end = new Date(endString);
    const today = new Date();
    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Resets today';
    return `Resets in ${days} ${days === 1 ? 'day' : 'days'}`;
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const renderNavContent = () => (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          if (item.submenu) {
            return (
              <div key={item.name} className="space-y-1">
                <Button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  variant="ghost"
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-md h-9 transition-colors ${
                    isSettingsActive
                      ? 'text-foreground bg-muted/40'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-muted-foreground ${
                      isSettingsOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </Button>

                <AnimatePresence initial={false}>
                  {isSettingsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-6 space-y-1"
                    >
                      {item.submenu.map((sub) => {
                        const isSubActive = pathname === sub.href || (sub.href.startsWith('/dashboard/billing') && pathname === '/dashboard/billing');
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                              isSubActive
                                ? 'text-primary dark:text-foreground font-bold bg-muted/40'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/15'
                            }`}
                          >
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

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
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Credit usage & Theme section */}
      <div className="p-4 border-t border-border bg-card space-y-4">
        {/* Credit Usage Box */}
        {usage ? (
          <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
              <span>Messages Used</span>
              <span>
                {usage.used.chat_messages.toLocaleString()} / {usage.limits.chat_messages_per_month.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-foreground h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (usage.used.chat_messages / usage.limits.chat_messages_per_month) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
              <span>Limit resets</span>
              <span>{getRemainingDays(usage.period_end)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 border border-border p-3.5 rounded-xl space-y-2 animate-pulse">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-1.5 bg-muted rounded w-full" />
            <div className="h-2 bg-muted rounded w-1/2" />
          </div>
        )}

        <div className="flex items-center justify-between px-2 text-xs">
          <span className="font-semibold text-muted-foreground">Dark Theme</span>
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
            <img src="/redas_logo.png" className="h-8 object-contain shrink-0" alt="Redas logo" />
          </Link>

          <span className="text-muted-foreground/30 font-light hidden sm:inline">/</span>

          {/* Username / Email & Plan Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground hidden sm:inline max-w-[180px] truncate">
              {session?.user?.name || user?.email || 'User'}
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
                      <span className="font-semibold">General Settings</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full flex items-center justify-start gap-2.5 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-destructive/10 transition-all rounded-md h-9 border-none bg-transparent"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span className="font-semibold">Sign Out</span>
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
        <main className="flex-1 bg-muted/20 overflow-y-auto p-4 md:p-6 antialiased flex flex-col justify-stretch">
          <div className="bg-card flex-1 border border-border rounded-xl md:rounded-2xl shadow-none overflow-hidden relative flex flex-col">
            <div className="relative flex-1 overflow-y-auto custom-scrollbar px-4 py-6 md:px-8 md:py-8">
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
