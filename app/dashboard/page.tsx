"use strict";
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, 
  Plus, 
  Search, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  MoreVertical,
  Calendar,
  Zap,
  FileText,
  Globe
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { format } from "date-fns";
import Sidebar from "@/components/shared/Sidebar";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bots, isLoading } = useQuery({
    queryKey: ["bots"],
    queryFn: async () => {
      const resp = await api.get("/bots/");
      return resp.data;
    },
  });

  const filteredBots = bots?.filter((bot: any) => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Sidebar>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-5xl font-black bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent font-outfit tracking-tighter">
              {getGreeting()}, <span className="text-primary">{session?.user?.name || 'Commander'}</span>
            </h1>
            <p className="text-white/40 font-medium tracking-wide">Your AI infrastructure is optimal. {filteredBots.length} active agents detected.</p>
          </div>
          <Link href="/dashboard/create">
            <Button className="bg-white text-black hover:bg-white/90 font-black px-8 transition-all hover:scale-105 active:scale-95 h-14 rounded-2xl shadow-xl shadow-white/5">
              <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
              Initialize New Bot
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Active Bots" 
            value={bots?.length || 0} 
            icon={<Bot className="w-5 h-5" />} 
            trend="+2 this month"
            color="text-blue-400"
          />
          <StatsCard 
            title="Total Chunks" 
            value="85.4k" 
            icon={<FileText className="w-5 h-5" />} 
            trend="+12% from last week"
            color="text-purple-400"
          />
          <StatsCard 
            title="Total Chats" 
            value="1.2k" 
            icon={<MessageSquare className="w-5 h-5" />} 
            trend="+12% from last week"
            color="text-green-400"
          />
          <StatsCard 
            title="Knowledge Tokens" 
            value="450k" 
            icon={<Zap className="w-5 h-5" />} 
            trend="82% capacity"
            color="text-orange-400"
          />
        </div>

        {/* Bot List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white/80 font-outfit">Your Knowledge Bots</h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input 
                placeholder="Search bots..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white focus:border-white/20 transition-all placeholder:text-white/20 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
              ))
            ) : filteredBots.length > 0 ? (
              filteredBots.map((bot: any, index: number) => (
                <BotCard key={bot.id} bot={bot} index={index} />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
                <Bot className="w-16 h-16 text-white/10 mb-4" />
                <h3 className="text-white/60 font-medium text-xl">No bots found</h3>
                <p className="text-white/20 max-w-xs mx-auto mt-2">
                  {searchTerm ? "Try a different search term" : "Create your first knowledge-powered AI bot to get started."}
                </p>
                {!searchTerm && (
                  <Link href="/dashboard/create" className="mt-8">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 px-8 rounded-2xl">
                      Create First Bot
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function StatsCard({ title, value, icon, trend, color }: { title: string, value: string | number, icon: React.ReactNode, trend: string, color: string }) {
  return (
    <Card className="glass-dark border-white/5 rounded-3xl overflow-hidden relative group hover:border-white/10 transition-all card-hover">
      <div className={`absolute -top-2 -right-2 p-6 opacity-5 group-hover:opacity-20 transition-opacity ${color} scale-150`}>
        {icon}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-black text-white font-outfit tracking-tight">{value}</div>
        <div className="mt-3 flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
            {trend}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BotCard({ bot, index }: { bot: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass-dark border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all relative card-hover">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
              <Bot className="w-7 h-7" />
            </div>
            <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <div className="w-2 h-2 rounded-full bg-white/10" />
               <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <CardTitle className="text-2xl text-white font-black font-outfit tracking-tight">{bot.name}</CardTitle>
            <CardDescription className="text-white/40 font-medium line-clamp-2 min-h-[3rem] leading-relaxed italic">
              " {bot.description || "Specialized intelligence agent optimized for RAG tasks."} "
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-white/20">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {format(new Date(bot.created_at), 'MMM d')}
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-500/50" />
              Ready
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link href={`/dashboard/chat/${bot.id}`} className="flex-1">
              <Button className="w-full bg-white text-black hover:bg-white/90 text-sm h-11 rounded-xl font-bold">
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Chat
              </Button>
            </Link>
            <Link href={`/dashboard/integrate/${bot.id}`}>
              <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 h-11 px-4 rounded-xl group/btn">
                <Globe className="w-4 h-4 group-hover/btn:text-primary transition-colors" />
              </Button>
            </Link>
            <Link href={`/dashboard/settings/${bot.id}`}>
              <Button variant="outline" size="icon" className="border-white/10 text-white hover:bg-white/5 h-11 w-11 rounded-xl">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
