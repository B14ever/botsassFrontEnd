'use client';

import { signOut } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import { Bot, LayoutDashboard, PlusCircle, Settings, LogOut, User, Menu, X, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Create Bot', href: '/dashboard/create', icon: PlusCircle },
  { name: 'Automation', href: '/dashboard/automation', icon: Bot },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(true);

	const handleLogout = async () => {
		logout();
		await signOut({ redirect: false });
		router.push('/login');
	};

	return (
		<div className="flex h-screen bg-background overflow-hidden font-sans">
			{/* Dynamic Sidebar */}
			<motion.aside
				initial={false}
				animate={{ width: isOpen ? 280 : 0 }}
				className="glass-dark flex flex-col h-full border-r border-white/5 relative z-40 overflow-hidden"
			>
				<div className="p-6 flex items-center gap-3">
					<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
						<Bot className="w-6 h-6 text-white" />
					</div>
					<span className="text-2xl font-bold font-outfit gradient-text whitespace-nowrap">BotSaas</span>
				</div>

				<nav className="flex-1 px-4 mt-4 space-y-2 overflow-y-auto">
					{navigation.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
									isActive ? 'text-white' : 'text-white/40 hover:text-white'
								}`}
							>
								{isActive && (
									<motion.div
										layoutId="active-nav-pill"
										className="absolute inset-0 bg-primary/20 border border-primary/20 rounded-2xl shadow-[inset_0_0_20px_rgba(var(--primary),0.1)]"
										transition={{ type: "spring", stiffness: 350, damping: 30 }}
									/>
								)}
								<item.icon className="w-5 h-5 relative z-10 transition-transform group-hover:scale-110" />
								<span className="font-bold text-sm relative z-10 font-outfit uppercase tracking-widest">{item.name}</span>
								{isActive && (
									<motion.div
										className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),1)]"
										animate={{ scale: [1, 1.2, 1] }}
										transition={{ repeat: Infinity, duration: 2 }}
									/>
								)}
							</Link>
						);
					})}
				</nav>

				{/* Profile Section */}
				<div className="p-4 border-t border-white/5 space-y-2 bg-black/20">
					<div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-2xl overflow-hidden border border-white/5 group hover:border-white/10 transition-colors">
						{user?.avatar_url ? (
							<img src={user.avatar_url} className="w-10 h-10 rounded-xl" alt="avatar" />
						) : (
							<div className="w-10 h-10 bg-secondary/80 rounded-xl flex items-center justify-center border border-white/5">
								<User className="w-5 h-5 text-muted-foreground" />
							</div>
						)}
						<div className="min-w-0">
							<p className="text-sm font-semibold truncate text-white">{user?.email || 'User'}</p>
							<p className="text-xs text-muted-foreground">Pro Account</p>
						</div>
					</div>

					<button
						onClick={handleLogout}
						className="w-full flex items-center gap-4 px-4 py-3 text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all rounded-2xl group"
					>
						<LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
						<span className="font-medium text-sm">Sign Out</span>
					</button>
				</div>
			</motion.aside>

			{/* Sidebar Toggle Hook */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="absolute bottom-6 left-6 z-50 p-2.5 bg-secondary/80 backdrop-blur rounded-full border border-white/10 lg:flex hidden hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)]"
			>
				{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
			</button>

			{/* Content Root */}
			<main className="flex-1 h-full overflow-y-auto bg-black relative antialiased p-0 sm:p-4">
				<div className="max-w-7xl mx-auto h-full sm:glass-dark sm:rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative border border-white/5">
					<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
					<div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none opacity-30" />

					<div className="relative h-full overflow-y-auto custom-scrollbar px-6 py-8">
						<AnimatePresence mode="wait">
							<motion.div
								key={pathname}
								initial={{ opacity: 0, y: 10, scale: 0.995 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -10, scale: 0.995 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
								className="h-full"
							>
								{children}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</main>
		</div>
	);
}

