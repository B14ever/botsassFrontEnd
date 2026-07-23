"use client";

import React, { useRef, useEffect } from "react";
import {
  Send, Bot, Sparkles, MessageSquare, BookOpen, Plus,
  Users, History
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Sidebar from "@/components/shared/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLATFORM_NAME } from "@/constants";

export type ChatThreadItem = {
  id: string;
  title: string;
  created_at?: string;
};

export type ChatMessageItem = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

export type WorkspaceChatInterfaceProps = {
  workspaceName?: string;
  userName?: string;
  isOwner?: boolean;
  chatThreads?: ChatThreadItem[];
  activeChatId?: string | null;
  messages?: ChatMessageItem[];
  input?: string;
  isTyping?: boolean;
  membersCount?: number;
  sourcesCount?: number;
  onSelectChat?: (id: string) => void;
  onCreateNewChat?: () => void;
  onOpenMembers?: () => void;
  onOpenKnowledgeSource?: () => void;
  onInputChange?: (value: string) => void;
  onSend?: (message?: string) => void;
};

/**
 * Group chats chronologically into date sections matching the wireframe sketch:
 * "TODAY", "YESTERDAY", "7 DAYS AGO", "OLDER"
 */
function groupChatsByDate(chats: ChatThreadItem[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 86400000;
  const sevenDaysAgoStart = todayStart - 6 * 86400000;

  const categories: { [key: string]: ChatThreadItem[] } = {
    TODAY: [],
    YESTERDAY: [],
    "7 DAYS AGO": [],
    OLDER: [],
  };

  chats.forEach((chat) => {
    const time = chat.created_at ? new Date(chat.created_at).getTime() : Date.now();
    if (time >= todayStart) {
      categories["TODAY"].push(chat);
    } else if (time >= yesterdayStart) {
      categories["YESTERDAY"].push(chat);
    } else if (time >= sevenDaysAgoStart) {
      categories["7 DAYS AGO"].push(chat);
    } else {
      categories["OLDER"].push(chat);
    }
  });

  return [
    { label: "TODAY", chats: categories["TODAY"] },
    { label: "YESTERDAY", chats: categories["YESTERDAY"] },
    { label: "7 DAYS AGO", chats: categories["7 DAYS AGO"] },
    { label: "OLDER", chats: categories["OLDER"] },
  ].filter((group) => group.chats.length > 0);
}

export function WorkspaceChatInterface({
  workspaceName = "Workspace Chat",
  userName = "User-Name",
  isOwner = true,
  chatThreads = [],
  activeChatId = null,
  messages = [],
  input = "",
  isTyping = false,
  membersCount = 1,
  sourcesCount = 0,
  onSelectChat,
  onCreateNewChat,
  onOpenMembers,
  onOpenKnowledgeSource,
  onInputChange,
  onSend,
}: WorkspaceChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const groupedChatHistory = groupChatsByDate(chatThreads);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend?.();
    }
  };

  return (
    <Sidebar>
      {/* ── 100% Full-Bleed Edge-to-Edge Layout (Zero Outer Margin, Zero Gray BG Bleed) ── */}
      <div className="w-[calc(100%+2.5rem)] md:w-[calc(100%+3.5rem)] h-[calc(100%+2.5rem)] md:h-[calc(100%+3.5rem)] -m-5 md:-m-7 flex overflow-hidden animate-in fade-in duration-300 bg-card">
        
        {/* ── LEFT INNER SIDEBAR / DRAWER ── */}
        <div className="w-80 sm:w-85 shrink-0 border-r border-border/60 p-4 pb-3 flex flex-col justify-between h-full overflow-hidden bg-card">
          
          {/* Top Section: Categorized History ("TODAY", "YESTERDAY", "7 DAYS AGO") */}
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <History className="w-4 h-4 text-primary" />
                <span>Chat History</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-2 py-0.5 rounded border">
                {chatThreads.length} threads
              </span>
            </div>

            {/* Date Grouped Scrollable History */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {groupedChatHistory.length > 0 ? (
                groupedChatHistory.map((group) => (
                  <div key={group.label} className="space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground px-1">
                      {group.label}
                    </div>
                    <div className="space-y-1">
                      {group.chats.map((thread) => (
                        <button
                          key={thread.id}
                          onClick={() => onSelectChat?.(thread.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between group ${
                            activeChatId === thread.id
                              ? "text-foreground font-bold bg-secondary/50"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                          }`}
                        >
                          <span className="truncate pr-2">{thread.title || "Untitled Chat"}</span>
                          {activeChatId === thread.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center space-y-2 border border-dashed border-border/60 rounded-lg p-3">
                  <MessageSquare className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                  <p className="text-xs text-muted-foreground font-medium">No chat history</p>
                  <p className="text-[10px] text-muted-foreground/70">Click "+ New Chat" below to start.</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Inner Sidebar Controls (Exact Wireframe: Members, Knowledge Source, New Chat) */}
          <div className="mt-auto pt-3 border-t border-border/40 shrink-0 space-y-2">
            
            {/* Members Button */}
            <button
              onClick={onOpenMembers}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors flex items-center justify-between border border-border/40"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Members</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                {membersCount}
              </span>
            </button>

            {/* Knowledge Source Button */}
            <button
              onClick={onOpenKnowledgeSource}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-secondary/50 transition-colors flex items-center justify-between border border-border/40"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Knowledge Source</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                {sourcesCount}
              </span>
            </button>

            {/* Wireframe Primary Action: New Chat (Pinned at absolute bottom of drawer) */}
            <Button
              size="sm"
              className="w-full h-9 text-xs font-bold gap-2 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground mt-1"
              onClick={onCreateNewChat}
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* ── RIGHT MAIN CHAT AREA (Flat Canvas, No Header Bar) ── */}
        <div className="flex-1 flex flex-col h-full bg-background min-w-0 overflow-hidden">
          
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto min-h-0 flex flex-col">
            {messages.length === 0 ? (
              
              /* ── WELCOME HERO STATE (Exact Wireframe Layout with Centered Input) ── */
              <div className="my-auto flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full space-y-6">
                
                {/* Redas Logo & Brand Section */}
                <div className="space-y-3 flex flex-col items-center">
                  <div className="flex items-center gap-2.5 mb-1">
                    <img src="/redas_icon.png" alt={`${PLATFORM_NAME} Logo`} className="h-10 w-10 object-contain shrink-0" />
                    <span className="text-xl font-extrabold tracking-tight text-foreground font-outfit">{PLATFORM_NAME}</span>
                  </div>
                  
                  {/* Greeting, User-Name */}
                  <h2 className="text-2xl font-extrabold text-foreground font-outfit tracking-tight">
                    Greeting, {userName}
                  </h2>
                  
                  {/* How can I Assist You */}
                  <p className="text-sm font-semibold text-muted-foreground">
                    How can I Assist You
                  </p>
                </div>

                {/* Centered Input Box directly under "How can I Assist You" (Exact Wireframe Box) */}
                <div className="w-full pt-2">
                  <div className="flex items-center gap-2 bg-background border border-input rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                    <Input
                      ref={inputRef}
                      placeholder="Ask anything..."
                      value={input}
                      onChange={(e) => onInputChange?.(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                      className="text-sm border-0 shadow-none focus-visible:ring-0 h-10 bg-transparent"
                    />
                    
                    {/* Circular Send Action Button (Wireframe Circle Button 'A') */}
                    <Button
                      size="icon"
                      onClick={() => onSend?.()}
                      disabled={!input.trim() || isTyping}
                      className="h-9 w-9 rounded-full font-bold text-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                      title="Send Message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              
              /* ── ACTIVE CHAT MESSAGES ── */
              <div className="space-y-4 my-auto w-full">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`flex gap-3 text-xs ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                          : "bg-secondary/70 border border-border text-foreground rounded-tl-none"
                      }`}
                    >
                      {msg.role === "user" ? (
                        msg.content
                      ) : (
                        <div className="prose prose-invert prose-xs max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 text-xs justify-start">
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 animate-pulse">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-secondary/70 border border-border text-muted-foreground rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* ── PINNED BOTTOM INPUT BAR (Only visible during active message thread) ── */}
          {messages.length > 0 && (
            <div className="p-4 border-t border-border/40 bg-background shrink-0">
              <div className="flex items-center gap-2 bg-background border border-input rounded-xl p-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-primary/20">
                <Input
                  ref={inputRef}
                  placeholder="Ask a question or type a message..."
                  value={input}
                  onChange={(e) => onInputChange?.(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  className="text-xs border-0 shadow-none focus-visible:ring-0 h-9 bg-transparent"
                />
                
                {/* Circular Send Action Button (Wireframe Circle Button 'A') */}
                <Button
                  size="icon"
                  onClick={() => onSend?.()}
                  disabled={!input.trim() || isTyping}
                  className="h-9 w-9 rounded-full font-bold text-xs shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
