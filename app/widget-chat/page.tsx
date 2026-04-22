"use strict";
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Bot, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { isLimitReachedError, type LimitReachedError } from "@/lib/api/errors";

function WidgetChatContent() {
  const searchParams = useSearchParams();
  const botId = searchParams.get("botId");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [limitError, setLimitError] = useState<LimitReachedError | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Read apiUrl from the URL param injected by widget.js (falls back to correct port 8081)
  const apiUrl = searchParams.get("apiUrl") 
    ? decodeURIComponent(searchParams.get("apiUrl")!) 
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1");

  const { data: settings } = useQuery({
    queryKey: ["public-bot-settings", botId],
    queryFn: async () => {
      if (!botId) return null;
      const resp = await axios.get(`${apiUrl}/public/bots/${botId}/settings`);
      return resp.data;
    },
    enabled: !!botId,
  });

  useEffect(() => {
    if (settings && messages.length === 0) {
      setMessages([{ 
        role: "assistant", 
        content: settings.welcome_message || "Hello! How can I help you today?" 
      }]);
    }
  }, [settings, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !botId) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setIsTyping(true);
    setLimitError(null);

    try {
      const response = await fetch(`${apiUrl}/public/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot_id: botId, message: userMessage }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as Record<string, unknown>;
        if (isLimitReachedError(payload)) {
          setLimitError(payload);
          throw new Error(`This bot has reached its ${payload.limit.replaceAll("_", " ")}.`);
        }
        throw new Error((payload.error as string) || "Failed to connect");
      }

      if (!response.body) throw new Error("No response body");

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.replace("data: ", "");
            assistantMessage += data;
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].content = assistantMessage;
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Connection failed. Please try again.");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const primaryColor = settings?.primary_color || "#7c3aed";

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white font-sans selection:bg-primary/30">
      {/* Header */}
      <div 
        className="p-4 border-b border-white/10 flex items-center gap-3"
        style={{ backgroundColor: `${primaryColor}1a` }}
      >
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 shadow-lg"
          style={{ backgroundColor: primaryColor }}
        >
          {settings?.avatar_url ? (
            <img src={settings.avatar_url} className="w-full h-full object-cover" alt="bot" />
          ) : (
            <Bot className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold font-outfit truncate text-white">{settings?.name || "Support Bot"}</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20"
      >
        {limitError && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-white/70">
            This bot has reached its current chat limit until {new Date(limitError.period_end).toLocaleDateString()}.
          </div>
        )}
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all animate-in slide-in-from-bottom-2 ${
                msg.role === "user" 
                ? "text-white rounded-tr-none" 
                : "bg-white/5 border border-white/5 rounded-tl-none text-white/90"
              }`}
              style={msg.role === "user" ? { backgroundColor: primaryColor } : {}}
            >
              <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-duration:0.6s]" />
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                </div>
              </div>
           </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-xl">
        <form onSubmit={handleSend} className="relative">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="h-12 bg-white/5 border-white/5 rounded-xl pr-12 focus:ring-0 focus:border-white/10 transition-all text-[13px] placeholder:text-white/20"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-20 active:scale-95"
            style={{ backgroundColor: primaryColor }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
        <p className="text-[9px] text-center text-white/10 mt-3 flex items-center justify-center gap-1 uppercase tracking-tighter">
            Powered by <Sparkles className="w-2.5 h-2.5 text-white/20" /> KiboBot
        </p>
      </div>
    </div>
  );
}

export default function WidgetChatPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#09090b]" />}>
      <WidgetChatContent />
    </Suspense>
  );
}
