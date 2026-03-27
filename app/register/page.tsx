"use strict";
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Mail, Lock, User, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      await api.post("/auth/signup", formData);
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-dark border-white/5 rounded-[2.5rem] shadow-2xl">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold font-outfit text-white">Join the Matrix</CardTitle>
            <CardDescription className="text-white/40 mt-2">
              Start building your autonomous AI fleet today.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="text"
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 pl-12 bg-white/5 border-white/5 rounded-2xl focus:bg-white/10 focus:border-white/10 transition-all placeholder:text-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email"
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-14 pl-12 bg-white/5 border-white/5 rounded-2xl focus:bg-white/10 focus:border-white/10 transition-all placeholder:text-white/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password"
                    placeholder="Create Password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-14 pl-12 bg-white/5 border-white/5 rounded-2xl focus:bg-white/10 focus:border-white/10 transition-all placeholder:text-white/20 text-white"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-white text-black hover:bg-white/90 rounded-2xl font-bold text-lg transition-all group flex items-center justify-center gap-2"
              >
                {loading ? "Initializing..." : "Register Now"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <ShieldCheck className="w-5 h-5 text-green-500/50" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Secure</span>
               </div>
               <div className="flex flex-col items-center gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <Sparkles className="w-5 h-5 text-blue-500/50" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">AI-Ready</span>
               </div>
            </div>
          </CardContent>

          <CardFooter className="justify-center pb-10">
            <p className="text-white/30 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline font-semibold ml-1 transition-all hover:text-primary">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
