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

  return (
    <Sidebar>
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent font-outfit">
              Your AI Matrix
            </h1>
            <p className="text-white/40 mt-1">Welcome back, {session?.user?.name || 'Commander'}.</p>
          </div>
          <Link href="/dashboard/create">
            <Button className="bg-white text-black hover:bg-white/90 font-semibold px-6 transition-all hover:scale-105 active:scale-95 h-12 rounded-2xl">
              <Plus className="w-5 h-5 mr-2" />
              Create New Bot
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
    <Card className="glass border-white/5 rounded-3xl overflow-hidden relative group hover:border-white/20 transition-all">
      <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        {icon}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white/40">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        <p className="text-xs text-white/20 mt-2 flex items-center gap-1">
          <BarChart3 className="w-3 h-3 text-green-500" />
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}

function BotCard({ bot, index }: { bot: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="glass border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/20 transition-all relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all">
              <Bot className="w-6 h-6" />
            </div>
            <Button variant="ghost" size="icon" className="text-white/20 hover:text-white hover:bg-white/10 rounded-full">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-4 space-y-1">
            <CardTitle className="text-xl text-white font-outfit">{bot.name}</CardTitle>
            <CardDescription className="text-white/30 line-clamp-2 min-h-[2.5rem]">
              {bot.description || "Specialized knowledge-powered assistant."}
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
