"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Copy, 
  Check, 
  Globe, 
  ShieldCheck, 
  Terminal,
  ArrowLeft,
  Settings
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

  const scriptUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/widget.js`;
  const embedCode = `<!-- BotSaas Widget -->
<script 
  src="${scriptUrl}" 
  data-bot-id="${id}"
  async 
></script>
<!-- End BotSaas Widget -->`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success("Code copied to clipboard!");
    } catch {
      // Fallback for browsers that block clipboard in certain contexts
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
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/dashboard" 
            className="text-sm text-white/40 hover:text-white flex items-center gap-2 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold font-outfit text-white tracking-tight">
            Integrate <span className="gradient-text">Chatbot</span>
          </h1>
          <p className="text-white/40 mt-2 text-lg">
            Deploy your AI assistant to any website with a single line of code.
          </p>
        </div>
        <div className="flex gap-3">
            <Link href={`/dashboard/settings/${id}`}>
              <Button variant="outline" className="rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 h-12 px-6 transition-all">
                  <Settings className="w-4 h-4 mr-2" />
                  Bot Identity
              </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-dark border-white/5 rounded-[2rem] md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                  <Terminal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-outfit text-white">Embed Script</CardTitle>
                  <CardDescription className="text-white/40">Paste this before the &lt;/body&gt; tag</CardDescription>
                </div>
              </div>
              <Button 
                onClick={handleCopy}
                variant="outline" 
                className={`rounded-xl border-white/5 px-4 h-11 transition-all ${
                  copied ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-white/5'
                }`}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Code"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
              <pre className="bg-black/40 border border-white/5 rounded-2xl p-6 overflow-x-auto font-mono text-sm leading-relaxed text-blue-400/90 relative">
                {embedCode}
              </pre>
            </div>
            
            <div className="mt-8 space-y-4">
                <h4 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Integration Guide
                </h4>
                <ul className="space-y-3 text-sm text-white/40">
                    <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">1</span>
                        Copy the embed script provided above.
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">2</span>
                        Open your website HTML file and scroll to the bottom.
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">3</span>
                        Paste the script right before the closing <code className="text-primary/60 px-1">&lt;/body&gt;</code> tag.
                    </li>
                </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-dark border-white/5 rounded-[2rem] h-fit">
          <CardHeader>
            <CardTitle className="text-xl font-outfit text-white">Status</CardTitle>
            <CardDescription className="text-white/40">Real-time bot health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-sm text-white/60">Bot Link</span>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-sm font-semibold text-white">Active</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-white/40">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <p>Submissions from authorized domains are encrypted and safe.</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-white/40">
                    <Code2 className="w-5 h-5 text-blue-400 shrink-0" />
                    <p>Compatible with React, Vue, WordPress, and raw HTML sites.</p>
                </div>
            </div>

            <Button className="w-full h-12 rounded-2xl bg-white text-black hover:bg-white/90 font-bold transition-all">
                Test Component
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
