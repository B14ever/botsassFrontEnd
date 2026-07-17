"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { upgradeSubscription } from "@/lib/api/subscription";
import { initializePayment } from "@/lib/api/payment";
import { getAxiosErrorMessage, getAxiosErrorPayload, isLimitReachedError } from "@/lib/api/errors";
import { Button } from "@/components/ui/button";

interface PaymentButtonProps {
  amount?: number;
  planCode?: "standard" | "team" | "pro";
  label?: string;
}

const MotionButton = motion(Button);

export function PaymentButton({ amount, planCode, label = "Upgrade" }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLoading(true);
      const data = planCode
        ? await upgradeSubscription(planCode)
        : await initializePayment({ amount });

      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }

      toast.error("Failed to get checkout URL");
    } catch (error) {
      const payload = getAxiosErrorPayload(error);
      const apiError = error as AxiosError<{ error?: string }>;

      if (apiError.response?.status === 401) {
        toast.error("Please sign in again before starting payment.");
        router.push("/login");
      } else if (isLimitReachedError(payload)) {
        toast.error(`Current ${payload.limit.replaceAll("_", " ")} reached until ${new Date(payload.period_end).toLocaleDateString()}.`);
      } else {
        toast.error(getAxiosErrorMessage(error, "Error initializing payment"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionButton
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePayment}
      disabled={loading}
      className="relative overflow-hidden group flex items-center justify-center gap-2 w-full h-12 rounded-xl text-primary-foreground font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
      )}
      <span>
        {loading
          ? "Processing..."
          : planCode
            ? label
            : `${label}${amount ? ` (${amount} ETB)` : ""}`}
      </span>
    </MotionButton>
  );
}
