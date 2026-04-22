"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { ArrowLeft, Bot, MessageSquare, RefreshCcw, Send, Settings, Shield, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { getAxiosErrorMessage, type LimitReachedError, isLimitReachedError } from "@/lib/api/errors";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type BotRecord = {
  id: string;
  name: string;
  preferred_language: string;
};

type KnowledgeResponse = {
  ready: boolean;
  source_count: number;
  chunk_count: number;
};

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [limitError, setLimitError] = useState<LimitReachedError | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: bot } = useQuery({
    queryKey: ["bot", params.id],
    queryFn: async () => {
      const response = await api.get<BotRecord>(`/bots/${params.id}`);
      return response.data;
    },
  });

  const { data: knowledge } = useQuery({
    queryKey: ["knowledge", params.id],
    queryFn: async () => {
      const response = await api.get<KnowledgeResponse>(`/bots/${params.id}/knowledge`);
      return response.data;
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isTyping) {
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    setLimitError(null);

    try {
      const session = await getSession();
      const token = (session as { accessToken?: string } | null)?.accessToken ?? "";
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bot_id: params.id, message: userMessage }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json()) as Record<string, unknown>;
        if (isLimitReachedError(errorPayload)) {
          setLimitError(errorPayload);
          throw new Error(`Current plan limit reached for ${errorPayload.limit.replaceAll("_", " ")}.`);
        }
        throw new Error((errorPayload.error as string) || "Failed to connect");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      let assistantMessage = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            assistantMessage += line.slice(6);
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1].content = assistantMessage;
              return next;
            });
          }
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : getAxiosErrorMessage(error, "Failed to connect.");
      toast.error(message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full text-white">
        <div className="flex items-center justify-between px-2 py-2 border-b border-white/5">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-white/10 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                <Bot className="w-6 h-6 text-white/60" />
              </div>
              <div>
                <h2 className="text-base font-bold font-outfit text-white leading-tight">{bot?.name || "Support Bot"}</h2>
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/20">
                  {knowledge?.ready ? "Knowledge ready" : "Waiting for knowledge"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/20 hover:text-white hover:bg-white/10 rounded-xl">
              <Shield className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/20 hover:text-white hover:bg-white/10 rounded-xl">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!knowledge?.ready ? (
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5 my-6">
            <div className="font-semibold text-white">No indexed knowledge yet</div>
            <div className="text-sm text-white/50 mt-1">
              Connect a website or PDF first, then come back here for grounded answers.
            </div>
            <Button onClick={() => router.push("/dashboard/create")} className="mt-4 bg-white text-black hover:bg-white/90 rounded-2xl">
              Add a source
            </Button>
          </div>
        ) : null}

        {limitError ? (
          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5 mb-4">
            <div className="font-semibold text-white">Chat limit reached</div>
            <div className="text-sm text-white/50 mt-1">
              {limitError.limit.replaceAll("_", " ")} resets on {new Date(limitError.period_end).toLocaleDateString()}.
            </div>
            <Button onClick={() => router.push("/dashboard/billing")} className="mt-4 bg-white text-black hover:bg-white/90 rounded-2xl">
              Upgrade plan
            </Button>
          </div>
        ) : null}

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-50 text-center space-y-4">
              <MessageSquare className="w-12 h-12" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-outfit uppercase tracking-wider text-white">Ready to chat</h3>
                <p className="text-sm max-w-md text-white/50">
                  Ask something grounded in your sources. If the bot cannot find the answer, it should say so and guide you toward better context.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 border ${message.role === "user" ? "bg-white text-black border-white rounded-tr-none" : "bg-white/[0.03] border-white/10 text-white/80 rounded-tl-none"}`}>
                  <div className="prose prose-invert prose-sm max-w-none text-inherit leading-relaxed">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  {index === messages.length - 1 && isTyping && message.role === "assistant" ? (
                    <span className="inline-block w-1.5 h-4 bg-white/40 ml-1 animate-pulse align-middle" />
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-6">
          <form onSubmit={handleSend} className="relative group">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-2xl">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={bot?.preferred_language === "am" ? "ጥያቄዎን ይጻፉ..." : "Ask a question..."}
                disabled={isTyping}
                className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 h-12"
              />
              <div className="flex items-center gap-1 pr-2">
                <Button type="submit" disabled={!input.trim() || isTyping} className={input.trim() ? "bg-white text-black hover:bg-white/90 rounded-xl" : "bg-white/5 text-white/20 rounded-xl"}>
                  {isTyping ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Grounded responses</span>
              <span
                className="flex items-center gap-1.5 cursor-pointer hover:text-white/40 transition-colors"
                onClick={() => setMessages([])}
              >
                <Trash2 className="w-3 h-3" /> Clear chat
              </span>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}
