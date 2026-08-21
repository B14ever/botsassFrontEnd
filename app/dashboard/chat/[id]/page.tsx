"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { ArrowLeft, Send, RotateCcw, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { getAxiosErrorMessage, type LimitReachedError, isLimitReachedError } from "@/lib/api/errors";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("workspace_detail");
  const tAgent = useTranslations("agent_detail");
  const tCommon = useTranslations("common");
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
        error instanceof Error ? error.message : getAxiosErrorMessage(error, tCommon("error"));
      toast.error(message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
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
              {bot?.name || tAgent("ai_assistant")}
            </p>
          )}
        </div>
      </div>

      {/* ── Limit error banner ── */}
      {limitError && (
        <div className="mx-4 mt-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center justify-between">
          <div>
            <p className="font-semibold">{t("upgrade_plan")}</p>
            <p className="text-[11px] opacity-80">
              {limitError.limit.replaceAll("_", " ")} resets on {new Date(limitError.period_end).toLocaleDateString()}.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-destructive/40 hover:bg-destructive/20 ml-2"
            onClick={() => router.push("/dashboard/billing")}
          >
            {t("upgrade_plan")}
          </Button>
        </div>
      )}

      {/* ── Message list ── */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground gap-2">
            <Sparkles className="w-8 h-8 opacity-40" />
            <p className="text-sm">{t("ask_placeholder")}</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2.5 max-w-[80%] text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t("generating_artifact", { type: "AI" })}</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* ── Input bar ── */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-border flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("ask_active_placeholder")}
          disabled={isTyping}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isTyping}
          className="shrink-0"
        >
          {isTyping ? (
            <RotateCcw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
