"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPayment } from "@/lib/api/payment";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const [status, setStatus] = useState<"pending" | "success" | "failed">(txRef ? "pending" : "failed");
  const [planCode, setPlanCode] = useState<string | null>(null);
  const [message, setMessage] = useState(
    txRef ? "Verifying your transaction..." : "No transaction reference found."
  );
  const router = useRouter();

  useEffect(() => {
    if (!txRef) {
      return;
    }

    let cancelled = false;
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    const checkStatus = async (attempt = 0) => {
      try {
        const res = await verifyPayment(txRef);
        if (cancelled) {
          return;
        }

        if (res.status === "success") {
          setPlanCode(res.plan_code || null);
          setStatus("success");
          setMessage(`Payment successful. ${res.plan_code ? `${res.plan_code.toUpperCase()} is now active with improved reasoning quality.` : "Your checkout has been confirmed."}`);
          retryTimeout = setTimeout(() => {
            router.push("/dashboard/billing");
          }, 3000);
          return;
        }

        if (res.status === "pending" && attempt < 5) {
          setStatus("pending");
          setMessage("Payment received. Waiting for final confirmation from Chapa...");
          retryTimeout = setTimeout(() => {
            checkStatus(attempt + 1);
          }, 3000);
          return;
        }

        if (res.status === "pending") {
          setStatus("failed");
          setMessage("We have not received final confirmation yet. Please refresh this page in a moment or contact support with your transaction reference.");
        } else {
          setStatus("failed");
          setMessage("Payment was not completed. If you were charged, contact support with your transaction reference.");
        }
      } catch (error) {
        console.error("Verification error", error);
        if (attempt < 5) {
          retryTimeout = setTimeout(() => {
            checkStatus(attempt + 1);
          }, 3000);
          return;
        }

        setStatus("failed");
        setMessage("We could not confirm the payment right now. Please try again shortly or contact support.");
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [txRef, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="bg-secondary backdrop-blur-lg border border-border p-10 rounded-lg shadow-none max-w-md w-full flex flex-col items-center"
      >
        {status === "pending" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-violet-500 mb-6" />
          </motion.div>
        )}
        
        {status === "success" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
          </motion.div>
        )}
        
        {status === "failed" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <XCircle className="w-16 h-16 text-rose-500 mb-6" />
          </motion.div>
        )}

        <h2 className="text-2xl font-bold text-white mb-2">
          {status === "pending" ? "Verifying..." : status === "success" ? "Success!" : "Failed"}
        </h2>
        <p className="text-gray-400 mb-8">{message}</p>
        {planCode ? (
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-violet-300">
            Activated plan: {planCode}
          </p>
        ) : null}
        {txRef && (
          <p className="mb-6 text-xs uppercase tracking-[0.2em] text-gray-500">
            Ref: {txRef}
          </p>
        )}

        {status !== "pending" && (
          <div className="flex w-full flex-col gap-3">
            <Link
              href="/dashboard/billing"
              className="w-full py-3 px-6 rounded-xl bg-secondary/80 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Return to Billing
            </Link>
            {status === "failed" && (
              <Link
                href="/dashboard/billing"
                className="w-full py-3 px-6 rounded-xl border border-border hover:bg-secondary text-white font-medium transition-colors"
              >
                Try Payment Again
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -top-32 -left-32 animate-pulse" />
        <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] bottom-0 right-0 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-500" />}>
          <VerifyPaymentContent />
        </Suspense>
      </div>
    </main>
  );
}
