"use client";

import { PaymentButton } from "@/components/pricing/PaymentButton";
import Sidebar from "@/components/shared/Sidebar";
import { Check, Shield, Gem } from "lucide-react";
import { motion } from "framer-motion";

export default function BillingPage() {
  return (
    <Sidebar>
      <div className="text-white selection:bg-violet-500/30 overflow-hidden relative pb-20 fade-in duration-700 animate-in slide-in-from-bottom-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 pt-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
            >
              <Gem className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium tracking-wide text-gray-300">Billing & Checkout</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent"
            >
              Complete Your Payment
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Pay securely through Chapa to activate your BotSaas workspace and keep your customer support assistant live.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-lg mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32 text-violet-500" />
            </div>

            <div className="relative z-10 text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Starter Workspace</h2>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-extrabold tracking-tight">1000</span>
                <span className="text-xl text-gray-400 font-medium">ETB</span>
              </div>
              <p className="text-gray-400 text-sm">A simple one-time checkout for your current plan setup.</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Fast Chapa checkout",
                "Secure hosted payment page",
                "Automatic payment verification",
                "Ready for tonight's launch"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="bg-violet-500/20 p-1 rounded-full">
                    <Check className="w-4 h-4 text-violet-400" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-white/10">
              <PaymentButton amount={1000} label="Checkout with Chapa" />
            </div>
          </motion.div>
        </div>
      </div>
    </Sidebar>
  );
}
