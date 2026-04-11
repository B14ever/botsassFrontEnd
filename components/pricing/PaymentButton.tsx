"use client";

import { useState } from "react";
import { initializePayment } from "@/lib/api/payment";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface PaymentButtonProps {
  amount: number;
  label?: string;
}

export function PaymentButton({ amount, label = "Top-up Wallet" }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLoading(true);
      const data = await initializePayment(amount);
      if (data && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        toast.error("Failed to get checkout URL");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      const apiError = error as AxiosError<{ error?: string }>;
      if (apiError.response?.status === 401) {
        toast.error("Please sign in again before starting payment.");
        router.push("/login");
      } else {
        toast.error(apiError.response?.data?.error || "Error initializing payment");
      }
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePayment}
      disabled={loading}
      className={`
        relative overflow-hidden group 
        flex items-center justify-center gap-2 
        bg-gradient-to-r from-violet-600 to-indigo-600 
        hover:from-violet-500 hover:to-indigo-500 
        text-white font-semibold py-3 px-8 rounded-xl
        shadow-[0_0_20px_rgba(124,58,237,0.3)]
        hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]
        transition-all duration-300 w-full sm:w-auto
        disabled:opacity-70 disabled:cursor-not-allowed
      `}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      )}
      <span>{loading ? "Processing..." : `${label} (${amount} ETB)`}</span>
    </motion.button>
  );
}
