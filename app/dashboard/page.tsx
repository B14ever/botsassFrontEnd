"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bot, Globe, LayoutGrid, MessageSquare, Plus, Search, Settings, Sparkles } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { fetchSubscription } from "@/lib/api/subscription";
import { fetchUsage } from "@/lib/api/usage";

type BotRecord = {
  id: string;
  name: string;
  description: string;
  preferred_language: string;
  created_at: string;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bots = [], isLoading } = useQuery({
    queryKey: ["bots"],
    queryFn: async () => {
      const response = await api.get<BotRecord[]>("/bots/");
      return response.data;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
  });

  const { data: usage } = useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage,
  });

  const filteredBots = bots?.filter((bot) => bot.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Sidebar>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-primary font-black">
              <Sparkles className="w-3 h-3" />
              Workspace
            </div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent font-outfit tracking-tight">
              Welcome back, {session?.user?.name || "there"}
            </h1>
            <p className="text-white/40 font-medium text-sm md:text-base">
              {subscription ? `Plan: ${subscription.plan_code.toUpperCase()} · resets ${new Date(subscription.current_period_end).toLocaleDateString()}` : "Your bots, usage, and upgrades in one place."}
            </p>
          </div>
          <Link href="/dashboard/create">
            <Button className="bg-white text-black hover:bg-white/90 font-bold px-6 h-12 rounded-2xl text-sm">
              <Plus className="w-5 h-5 mr-2" />
              New Bot
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
          <Card className="glass-dark border-white/10 rounded-[2.5rem]">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="text-white text-lg font-outfit">Usage overview</CardTitle>
                <p className="text-white/40 text-sm mt-1">Server-enforced limits for the current period.</p>
              </div>
              <Link href="/dashboard/billing">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-2xl">
                  Manage plan
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <UsageStat label="Bots" used={usage?.used.bots ?? 0} limit={usage?.limits.bots ?? 0} />
              <UsageStat label="Sources" used={usage?.used.sources ?? 0} limit={usage?.limits.sources ?? 0} />
              <UsageStat label="Chat messages" used={usage?.used.chat_messages ?? 0} limit={usage?.limits.chat_messages_per_month ?? 0} />
              <UsageStat label="Website pages" used={usage?.used.website_pages ?? 0} limit={usage?.limits.website_pages_per_month ?? 0} />
              <UsageStat label="PDF pages" used={usage?.used.pdf_pages ?? 0} limit={usage?.limits.pdf_pages_per_month ?? 0} />
              <UsageBadge planCode={subscription?.plan_code ?? "free"} />
            </CardContent>
          </Card>

          <Card className="glass-dark border-white/10 rounded-[2.5rem]">
            <CardHeader>
            <CardTitle className="text-white text-lg font-outfit">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickLink href="/dashboard/create" icon={<Bot className="w-4 h-4" />} text="Create a new bot" />
              <QuickLink href="/dashboard/billing" icon={<MessageSquare className="w-4 h-4" />} text="Compare Free, Standard, and Pro" />
              <QuickLink href="/dashboard/create" icon={<Globe className="w-4 h-4" />} text="Connect a website or PDF" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-white/80 font-outfit">Your bots</h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <Input
                placeholder="Search bots..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white focus:border-white/20 placeholder:text-white/20 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-48 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
              ))
            ) : filteredBots?.length > 0 ? (
              filteredBots.map((bot) => <BotCard key={bot.id} bot={bot} />)
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02]">
                <LayoutGrid className="w-16 h-16 text-white/10 mb-4" />
                <h3 className="text-white/60 font-medium text-lg">No bots yet</h3>
                <p className="text-white/20 max-w-xs mx-auto mt-2 text-sm">Create your first grounded support bot to start onboarding customers fast.</p>
                <Link href="/dashboard/create" className="mt-8">
                  <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 px-8 rounded-2xl">
                    Create first bot
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function UsageStat({ label, used, limit }: { label: string; used: number; limit: number }) {
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">{label}</div>
      <div className="mt-2 text-2xl font-black text-white">
        {used}
        <span className="text-sm text-white/30 ml-1">/ {limit}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function UsageBadge({ planCode }: { planCode: string }) {
  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/10 p-5 flex flex-col justify-between">
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-black">Current plan</div>
      <div className="mt-2 text-2xl font-black text-white">{planCode.toUpperCase()}</div>
      <div className="mt-3 text-xs text-white/50">Tier-based quality and usage limits are enforced server-side.</div>
    </div>
  );
}

function QuickLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white/70 hover:text-white hover:border-white/20 transition-all">
      <div className="w-8 h-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-primary">{icon}</div>
      <span>{text}</span>
    </Link>
  );
}

function BotCard({ bot }: { bot: BotRecord }) {
  return (
    <Card className="glass-dark border-white/10 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
        </div>
        <div>
          <CardTitle className="text-white text-lg font-black font-outfit">{bot.name}</CardTitle>
          <p className="text-white/40 mt-2 min-h-[3rem] text-sm">{bot.description || "Purpose-built support bot trained on your docs."}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-black">
          Created {format(new Date(bot.created_at), "MMM d")}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/chat/${bot.id}`} className="flex-1">
            <Button className="w-full bg-white text-black hover:bg-white/90 rounded-2xl font-bold">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </Link>
          <Link href={`/dashboard/integrate/${bot.id}`}>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-2xl">
              <Globe className="w-4 h-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/settings/${bot.id}`}>
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-2xl">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
