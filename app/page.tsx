"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Bot, 
  Zap, 
  Shield, 
  Sparkles, 
  MessageSquare, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  Code2, 
  Cpu, 
  Layers
} from "lucide-react";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-0 -left-1/4 w-[70%] h-[50%] bg-primary/10 rounded-full blur-[160px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-[70%] h-[50%] bg-blue-500/10 rounded-full blur-[160px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] left-[20%] w-[1px] h-[400px] bg-gradient-to-b from-transparent via-primary/20 to-transparent rotate-45" />
      </div>

      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-outfit tracking-tight">KiboBot</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-black italic">Advanced AI RAG</span>
            </div>
          </motion.div>

          <nav className="hidden items-center gap-10 text-sm font-medium text-white/60 md:flex">
            {['Features', 'How it Works', 'Pricing', 'Security'].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white transition-colors relative group">
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              Log in
            </Link>
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-bold shadow-xl shadow-white/5">
              <Link href="/register">Join the Fleet</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative pt-32">
        {/* HERO SECTION */}
        <section className="px-6 py-20 md:py-32 flex flex-col items-center text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5 text-[11px] font-bold text-primary mb-10 tracking-widest uppercase"
            >
                <Sparkles className="w-3 h-3" />
                <span>Next-Gen RAG Architecture</span>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl text-5xl md:text-8xl font-black font-outfit tracking-tight leading-[0.9] scroll-m-20"
            >
                Give Your SaaS a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400 animate-gradient">
                  Bionic Memory.
                </span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mt-8 max-w-2xl text-lg md:text-xl text-white/40 font-medium leading-relaxed"
            >
                Most bots are just talk. KiboBot <b>learns</b>. <br className="hidden md:block" />
                Connect your URLs, PDFs, and Docs. Launch an intelligent agent that 
                responds with sub-second accuracy and actual product context.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
            >
                <Button size="lg" className="h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 group">
                    <Link href="/register" className="flex items-center gap-2">
                        Build My Bot 
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
                <Button size="lg" variant="ghost" className="h-16 px-10 text-white/60 hover:text-white rounded-2xl font-bold bg-white/5 border border-white/5">
                    View Live Demo
                </Button>
            </motion.div>

            {/* Feature Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-20 hover:opacity-100 transition-opacity"
            >
                {['No-Code Training', 'AES-256 Security', 'Sub-2s Response', 'Next.js Native'].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {feat}
                  </div>
                ))}
            </motion.div>
        </section>

        {/* MOCK APPLICATION SHOWCASE */}
        <section className="px-6 py-20 relative">
          <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-y-20 scale-75" />
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-6xl p-4 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl shadow-black ring-1 ring-white/10 overflow-hidden"
          >
            <div className="aspect-[16/10] w-full bg-[#09090b] rounded-[1.8rem] border border-white/5 overflow-hidden flex relative">
                {/* Mock Sidebar */}
                <div className="w-20 border-r border-white/5 p-4 flex flex-col items-center gap-6 bg-white/[0.01]">
                   <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                   </div>
                   {[Cpu, Database, MessageSquare, Shield].map((Icon, idx) => (
                      <div key={idx} className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center opacity-40">
                         <Icon className="w-5 h-5" />
                      </div>
                   ))}
                </div>
                {/* Mock Content area */}
                <div className="flex-1 p-8 space-y-8 overflow-hidden">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h3 className="text-xl font-bold font-outfit">Security Bot Alpha</h3>
                         <p className="text-xs text-white/40">Knowledge Base Integration Active</p>
                      </div>
                      <div className="flex gap-2">
                         <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Online</div>
                         <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest">v1.2.0</div>
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Ingested Chunks', val: '1,429', color: 'primary' },
                        { label: 'Avg Deflection', val: '42.8%', color: 'emerald-400' },
                        { label: 'AI Confidence', val: '99.2%', color: 'blue-400' }
                      ].map((stat, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                           <span className="text-[10px] uppercase font-bold text-white/20 tracking-widest">{stat.label}</span>
                           <p className={`text-xl font-black text-${stat.color}`}>{stat.val}</p>
                        </div>
                      ))}
                   </div>

                   <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 h-full relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity group-hover:opacity-100 opacity-0" />
                      <div className="relative space-y-4">
                         <div className="flex justify-start">
                            <div className="max-w-[70%] bg-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-white/60 border border-white/5">
                               How do I implement specific rate limiting for API users based on their tier?
                            </div>
                         </div>
                         <div className="flex justify-end gap-3">
                            <div className="max-w-[70%] bg-primary p-4 rounded-2xl rounded-tr-none text-sm font-medium border border-white/10 shadow-xl shadow-primary/20">
                               Based on your documentation (Security.pdf, Page 12), you should use the `X-Tier-Limit` header middleware. It allows you to toggle limits between Basic (100req), Pro (1000req), and Ultra (Unlimited).
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                               <Bot className="w-4 h-4 text-black" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-xl font-bold bg-white/5 border border-white/10 rounded-full px-6 py-1.5 inline-flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" /> Core Engine
             </h2>
             <h3 className="text-4xl md:text-6xl font-black font-outfit">The Muscle Behind Your Support.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { 
                 title: "Neural Scraping", 
                 desc: "Our colly-based crawler doesn't just read HTML. It understands page hierarchy and context.",
                 icon: Globe,
                 color: "sky-400"
               },
               { 
                 title: "Vector Pipeline", 
                 desc: "Automated chunking and OpenAI-powered embeddings stored in secure PGVector clusters.",
                 icon: Layers,
                 color: "primary"
               },
               { 
                 title: "Smart Ingestion", 
                 desc: "Handling encrypted PDFs, raw text, and dynamic URLs with synchronous error reporting.",
                 icon: Database,
                 color: "emerald-400"
               },
               { 
                 title: "Custom Guardrails", 
                 desc: "Define exactly how your AI speaks. No hallucinations, just hard facts from your data.",
                 icon: Shield,
                 color: "fuchsia-400"
               },
               { 
                 title: "Sub-Second RAG", 
                 desc: "Optimized SQL search ensure your users aren't left staring at a typing indicator.",
                 icon: Zap,
                 color: "yellow-400"
               },
               { 
                 title: "Ready-to-Embed", 
                 desc: "A single line of JS. That's all it takes to bring your KB-Bot live on any platform.",
                 icon: Code2,
                 color: "rose-400"
               }
             ].map((feat, i) => (
                <motion.div 
                   key={i}
                   whileHover={{ y: -5 }}
                   className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all card-hover overflow-hidden relative group"
                >
                   <div className={`absolute top-0 right-0 w-32 h-32 bg-${feat.color}/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity`} />
                   <div className={`w-14 h-14 rounded-2xl bg-${feat.color}/10 border border-${feat.color}/20 flex items-center justify-center mb-6`}>
                      <feat.icon className={`w-7 h-7 text-${feat.color}`} />
                   </div>
                   <h4 className="text-xl font-bold font-outfit mb-3">{feat.title}</h4>
                   <p className="text-sm text-white/40 leading-relaxed font-medium">
                      {feat.desc}
                   </p>
                </motion.div>
             ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="px-6 py-20 pb-40 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[200px] opacity-30 select-none pointer-events-none" />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="relative z-10 space-y-8"
            >
               <h2 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter">Ready to Deploy?</h2>
               <p className="max-w-xl mx-auto text-lg md:text-xl text-white/40 font-medium">
                  Thousands of conversations is just the beginning. Launch your first bot in the next 5 minutes.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-white/90 rounded-2xl font-black text-xl shadow-2xl transition-transform hover:scale-105">
                     <Link href="/register">Start My Free Trial</Link>
                  </Button>
                  <Button size="lg" variant="ghost" className="h-16 px-10 text-white font-bold bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl">
                     Contact Sales
                  </Button>
               </div>
               <div className="flex items-center justify-center gap-8 pt-10">
                  {['Cloud', 'Self-Host', 'API-Only'].map((tag) => (
                    <div key={tag} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30">
                       <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />
                       {tag}
                    </div>
                  ))}
               </div>
            </motion.div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black/80 py-20 relative z-10">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                     <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold font-outfit tracking-tight">KiboBot</span>
               </div>
               <p className="max-w-sm text-sm text-white/40 font-medium leading-relaxed">
                  The infrastructure for modern AI support. Built for speed, precision, 
                  and security. Empowering SaaS teams to scale through intelligence.
               </p>
               <div className="flex gap-4">
                  {['Twitter', 'GitHub', 'LinkedIn'].map((app) => (
                    <div key={app} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors text-white/40 hover:text-white">
                       <span className="sr-only">{app}</span>
                       {/* Icon placeholders */}
                       <Layers className="w-5 h-5" />
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="space-y-4">
               <h4 className="text-sm font-bold uppercase tracking-widest text-white">Product</h4>
               <ul className="space-y-2 text-sm text-white/40">
                  <li className="hover:text-primary transition-colors cursor-pointer">Changelog</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">SDKs</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">API Keys</li>
               </ul>
            </div>

            <div className="space-y-4">
               <h4 className="text-sm font-bold uppercase tracking-widest text-white">Company</h4>
               <ul className="space-y-2 text-sm text-white/40">
                  <li className="hover:text-primary transition-colors cursor-pointer">Privacy</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Terms</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Security</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Hiring</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter text-white/20">
            <span>© 2026 KIBOBOT CORP. ALL INTELLIGENCE RESERVED.</span>
            <div className="flex gap-4">
               <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-500" /> All Systems Operational</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
