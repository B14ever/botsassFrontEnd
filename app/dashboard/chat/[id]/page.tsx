"use strict";
"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Send,
  Bot,
  User,
  ArrowLeft,
  Paperclip,
  Sparkles,
  RefreshCcw,
  Shield,
  Trash2,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: bot } = useQuery({
    queryKey: ["bot", id],
    queryFn: async () => {
      const resp = await api.get(`/bots/${id}`);
      return resp.data;
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);

    try {
      const session = await getSession();
      const token = (session as any)?.accessToken;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1"}/chat/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ bot_id: id, message: userMessage })
      });

      if (!response.ok) throw new Error("Failed to connect");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      let assistantMessage = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const content = line.slice(6);
            assistantMessage += content;
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1].content = assistantMessage;
              return newMsgs;
            });
          }
        }
      }
    } catch (error: any) {
      toast.error("Failed to connect. Please check your backend connection.");
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#030303] text-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              <Bot className="w-6 h-6 text-white/60" />
            </div>
            <div>
              <h2 className="font-bold font-outfit text-white leading-tight">
                {bot?.name || "Support Bot"}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/20">Online</span>
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

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4">
            <Sparkles className="w-12 h-12" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-outfit uppercase tracking-wider text-white">Ready to chat</h3>
              <p className="text-sm max-w-xs">Ask a question about your docs or help center.</p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                  msg.role === "user" ? "bg-white border-white text-black" : "bg-white/5 border-white/10 text-white/40"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl relative ${
                  msg.role === "user"
                    ? "bg-white/10 border border-white/10 rounded-tr-none text-white"
                    : "bg-white/[0.03] border border-white/5 rounded-tl-none text-white/80"
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none text-inherit leading-relaxed">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {i === messages.length - 1 && isTyping && msg.role === "assistant" && (
                    <span className="inline-block w-1.5 h-4 bg-white/40 ml-1 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-6 bg-gradient-to-t from-black to-black/0">
        <form
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-focus-within:opacity-20 transition-opacity rounded-2xl" />
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-2xl">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white/20 hover:text-white rounded-xl"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isTyping}
              className="bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/20 h-12"
            />
            <div className="flex items-center gap-1 pr-2">
              <Button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={`transition-all rounded-xl ${
                  input.trim()
                    ? "bg-white text-black hover:bg-white/90 scale-100"
                    : "bg-white/5 text-white/20 scale-95"
                }`}
              >
                {isTyping ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Secure connection</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Sources synced</span>
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
  );
}
