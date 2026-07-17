"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { Bot, Globe, LayoutGrid, MessageSquare, Plus, Search, Settings } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

type BotRecord = {
  id: string;
  name: string;
  description: string;
  preferred_language: string;
  created_at: string;
};

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: bots = [], isLoading } = useQuery({
    queryKey: ["bots"],
    queryFn: async () => {
      const response = await api.get<BotRecord[]>("/bots/");
      return response.data;
    },
  });

  const filteredBots = bots?.filter((bot) =>
    bot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="space-y-6 pb-10">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
              <Bot className="w-3 h-3" />
              Manage
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground font-sans">
              Agents
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Create, configure, and chat with your custom support agents.
            </p>
          </div>
          <Link href="/dashboard/create">
            <Button size="sm" className="rounded-md font-semibold px-4 h-9">
              <Plus className="w-4 h-4 mr-1.5" />
              New Bot
            </Button>
          </Link>
        </div>

        {/* Search and List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground font-sans">Your bots ({filteredBots.length})</h2>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <Input
                placeholder="Search bots..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 bg-secondary border-border text-foreground focus:ring-0 placeholder:text-muted-foreground/40 rounded-md h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-44 rounded-xl bg-secondary/50 animate-pulse border border-border" />
              ))
            ) : filteredBots?.length > 0 ? (
              filteredBots.map((bot) => <BotCard key={bot.id} bot={bot} />)
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-border rounded-xl bg-muted/10">
                <LayoutGrid className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <h3 className="text-foreground font-semibold text-sm">No bots found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-1 text-xs">Create your first grounded support bot to start onboarding customers fast.</p>
                <Link href="/dashboard/create" className="mt-4">
                  <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary h-9 px-6 rounded-md font-semibold">
                    Create bot
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

function BotCard({ bot }: { bot: BotRecord }) {
  return (
    <Card className="border-border bg-card rounded-xl shadow-none overflow-hidden flex flex-col justify-between hover:border-foreground/25 transition-all">
      <CardHeader className="space-y-2.5 pb-3">
        <div className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <CardTitle className="text-foreground text-sm font-semibold leading-tight">{bot.name}</CardTitle>
          <p className="text-muted-foreground mt-1 min-h-[2.5rem] text-xs line-clamp-2 leading-relaxed">{bot.description || "Purpose-built support bot trained on your docs."}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
          Created {format(new Date(bot.created_at), "MMM d")}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/chat/${bot.id}`} className="flex-1">
            <Button size="sm" className="w-full rounded-md font-semibold h-8 text-xs">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
              Chat
            </Button>
          </Link>
          <Link href={`/dashboard/integrate/${bot.id}`}>
            <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-secondary rounded-md h-8 w-8 p-0 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link href={`/dashboard/settings/${bot.id}`}>
            <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-secondary rounded-md h-8 w-8 p-0 flex items-center justify-center">
              <Settings className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
