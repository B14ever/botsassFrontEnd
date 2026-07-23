"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { ArrowLeft, Send, RotateCcw, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: bot, isLoading: botLoading } = useQuery({
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsTyping(true);
    setLimitError(null);

    try {
      const session = await getSession();
      const token = (session as { accessToken?: string } | null)?.accessToken ?? "";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/chat/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ bot_id: params.id, message: userMessage }),
        }
      );

      if (!response.ok) {
        const errorPayload = (await response.json()) as Record<string, unknown>;
        if (isLimitReachedError(errorPayload)) {
          setLimitError(errorPayload);
          throw new Error(
            `Current plan limit reached for ${errorPayload.limit.replaceAll("_", " ")}.`
          );
        }
        throw new Error((errorPayload.error as string) || "Failed to connect");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      let assistantMessage = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        for (const line of chunk.split("\n")) {
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
      const message =
        error instanceof Error ? error.message : getAxiosErrorMessage(error, "Failed to connect.");
      toast.error(message);
    } finally {
      setIsTyping(false);
    }
  };

  const placeholder =
    bot?.preferred_language === "am" ? "ጥያቄዎን ይጻፉ..." : "Ask a question...";

  return (
    <Sidebar>
      <div className="flex flex-col h-full">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="min-w-0 flex-1">
            {botLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <p className="text-sm font-semibold text-foreground truncate">
                {bot?.name || "Agent"}
              </p>
            )}
          </div>


        </div>



        {/* ── Limit error banner ── */}
        {limitError && (
          <Card size="sm" className="mt-4">
            <CardHeader>
              <p className="text-sm font-semibold text-foreground">Chat limit reached</p>
              <p className="text-xs text-muted-foreground">
                {limitError.limit.replaceAll("_", " ")} resets on{" "}
                {new Date(limitError.period_end).toLocaleDateString()}.
              </p>
            </CardHeader>
            <CardFooter>
              <Button size="sm" onClick={() => router.push("/dashboard/billing")}>
                Upgrade plan
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* ── Messages ── */}
        <ScrollArea className="flex-1 mt-4 -mx-1 px-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
              <Bot className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Send a message to start testing this agent.
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <Card
                    size="sm"
                    className={`max-w-[80%] rounded-xl ring-0 border ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-card-foreground border-border"
                    }`}
                  >
                    <CardContent className="py-2 px-3">
                      <div className="prose prose-sm max-w-none text-inherit leading-relaxed dark:prose-invert">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      {index === messages.length - 1 &&
                        isTyping &&
                        message.role === "assistant" && (
                          <span className="inline-block w-1 h-3.5 bg-current opacity-60 ml-0.5 animate-pulse align-middle" />
                        )}
                    </CardContent>
                  </Card>
                </div>
              ))}

              {isTyping && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <Card size="sm" className="rounded-xl ring-0 border border-border">
                    <CardContent className="py-2 px-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </CardContent>
                  </Card>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        {/* ── Input ── */}
        <form onSubmit={handleSend} className="mt-4 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isTyping}
          >
            {isTyping ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </Sidebar>
  );
}
