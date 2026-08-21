"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";

// Clean Redas Landing Components
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CoreFeaturesSection from "@/components/landing/CoreFeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";
import Orb from "@/components/ui/Orb";
import Aurora from "@/components/ui/Aurora";

export default function Home() {
  const { data: session } = useSession();
  const authStoreUser = useAuthStore((s) => s.user);
  const user = session?.user || authStoreUser;
  const userName = (user as any)?.name || (user as any)?.email;

  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden transition-colors duration-300">
      {/* Sticky Full-Width Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative">
        {/* 1. Hero Section (with DarkVeil Background & Embedded Dashboard Preview) */}
        <HeroSection userName={userName} />

        {/* 2. What Redas Can Do */}
        <CoreFeaturesSection />

        {/* 3 & 4. Combined How It Works & Use Cases Area with Shared Dynamic Orb Background */}
        <div className="relative isolate overflow-hidden">
          {/* Shared Dynamic Orb Background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-15 dark:opacity-65 transition-opacity [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]"
          >
            <div className="w-full h-full max-w-6xl max-h-[1400px] relative">
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
                backgroundColor={isDark ? "#000000" : "#fafafa"}
              />
            </div>
          </div>

          {/* Seamless Multi-Stop Top Gradient Bridge from Core Features */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-44 sm:h-64 bg-gradient-to-b from-[#fafafa] dark:from-background via-[#fafafa]/80 dark:via-background/80 to-transparent z-10"
          />

          {/* How It Works Section */}
          <HowItWorksSection userName={userName} />

          {/* Use Cases Section */}
          <UseCasesSection userName={userName} />

          {/* Seamless Multi-Stop Bottom Gradient Bridge to Pricing Section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-b from-transparent via-[#fafafa]/80 dark:via-background/80 to-[#fafafa] dark:to-background z-10"
          />
        </div>

        {/* 5 & 6. Combined Pricing & FAQ Area with Shared Soft Aurora Background */}
        <div className="relative isolate overflow-hidden">
          {/* Shared Dynamic Aurora Animated Background with Theme-Optimized Opacity and Progressive Mask */}
          <div
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-15 dark:opacity-40 select-none z-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_75%,transparent_100%)]"
          >
            <Aurora
              colorStops={["#3b82f6", "#8b5cf6", "#06b6d4"]}
              blend={0.7}
              amplitude={1.0}
              speed={0.4}
            />
          </div>

          {/* Seamless Multi-Stop Top Gradient Bridge from Use Cases Section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-44 sm:h-64 bg-gradient-to-b from-[#fafafa] dark:from-background via-[#fafafa]/80 dark:via-background/80 to-transparent z-10"
          />

          {/* Pricing Section */}
          <PricingSection userName={userName} />

          {/* FAQ Section */}
          <FaqSection />

          {/* Seamless Multi-Stop Bottom Gradient Bridge to CTA Section */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-64 bg-gradient-to-b from-transparent via-[#fafafa]/80 dark:via-background/80 to-[#fafafa] dark:to-background z-10"
          />
        </div>

        {/* 7. Final Call to Action & Unified Closing Footer (with Mirrored DarkVeil Background) */}
        <CtaSection userName={userName} />
      </main>
    </div>
  );
}
