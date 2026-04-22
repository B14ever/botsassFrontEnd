"use client";

import { use, useState } from "react";
import {
  Copy,
  Check,
  Globe,
  ShieldCheck,
  Terminal,
  ArrowLeft,
  Settings,
  ExternalLink,
  Sparkles,
  Monitor
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/shared/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";

export default function IntegratePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [copied, setCopied] = useState(false);

  const scriptUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/widget.js`;
  const embedCode = `<!-- KiboBot Widget -->\n<script\n  src="${scriptUrl}"\n  data-bot-id="${id}"\n  async\n></script>\n<!-- End KiboBot Widget -->`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success("Code copied to clipboard!");
    } catch {
      const el = document.createElement("textarea");
      el.value = embedCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast.success("Code copied!");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sidebar>
      <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-white/40 hover:text-white flex items-center gap-2 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles className="w-3 h-3" />
            Integration
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-white tracking-tight">
            Embed <span className="gradient-text">Chat Widget</span>
          </h1>
          <p className="text-white/40 mt-3 text-lg max-w-2xl">
            Add the widget to any website with a single script tag. It loads fast and keeps styling scoped to the bubble.
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <Link href={`/dashboard/settings/${id}`}>
            <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 h-12 px-6 transition-all">
              <Settings className="w-4 h-4 mr-2" />
              Bot Settings
            </Button>
          </Link>
          <Link href={`/widget-chat?botId=${id}`} target="_blank" rel="noreferrer">
            <Button className="rounded-2xl h-12 px-6 bg-white text-black hover:bg-white/90 font-bold">
              <Monitor className="w-4 h-4 mr-2" />
              Preview Widget
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="glass-dark border-white/5 rounded-[2rem] lg:col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-outfit text-white">Embed Script</CardTitle>
                  <CardDescription className="text-white/40">Paste this before the closing &lt;/body&gt; tag</CardDescription>
                </div>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                className={`rounded-xl border-white/5 px-4 h-11 transition-all ${
                  copied ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-white/5"
                }`}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Code"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
              <pre className="bg-black/40 border border-white/5 rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed text-emerald-200/90 relative">
                {embedCode}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "1. Add script",
                  desc: "Copy the embed script into your site."
                },
                {
                  title: "2. Publish",
                  desc: "Deploy your site so the widget loads."
                },
                {
                  title: "3. Customize",
                  desc: "Match colors and greeting in Settings."
                }
              ].map((step) => (
                <div key={step.title} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[11px] uppercase tracking-widest font-black text-white/40">{step.title}</p>
                  <p className="text-sm text-white/50 mt-2 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card className="glass-dark border-white/5 rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl font-outfit text-white">Status</CardTitle>
              <CardDescription className="text-white/40">Widget readiness</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-sm text-white/60">Widget Script</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-sm font-semibold text-white">Ready</span>
                </div>
              </div>
              <div className="space-y-3 text-sm text-white/40">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <p>Requests are scoped to your bot ID and secured with your API.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-emerald-300 shrink-0" />
                  <p>Works with React, Webflow, WordPress, and static sites.</p>
                </div>
              </div>
              <Link href={`/widget-chat?botId=${id}`} target="_blank" rel="noreferrer">
                <Button className="w-full h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold transition-all">
                  Preview Widget
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-dark border-white/5 rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-xl font-outfit text-white">Helpful Links</CardTitle>
              <CardDescription className="text-white/40">Common setup shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/dashboard/settings/${id}`} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                <span className="text-sm text-white/70">Bot appearance</span>
                <ExternalLink className="w-4 h-4 text-white/30" />
              </Link>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm text-white/70">Allowed domains</span>
                <span className="text-xs text-white/30">Coming soon</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm text-white/70">Widget events</span>
                <span className="text-xs text-white/30">Coming soon</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </Sidebar>
  );
}
