"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";

// Clean Redas Landing Components
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CoreFeaturesSection from "@/components/landing/CoreFeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import CtaSection from "@/components/landing/CtaSection";

export default function Home() {
  const { data: session } = useSession();
  const authStoreUser = useAuthStore((s) => s.user);
  const user = session?.user || authStoreUser;
  const userName = (user as any)?.name || (user as any)?.email;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 overflow-x-hidden">
      {/* Sticky Full-Width Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative">
        {/* 1. Hero Section (with DarkVeil Background & Embedded Dashboard Preview) */}
        <HeroSection userName={userName} />

        {/* 2. Core Features (4 Natural, Simple Cards) */}
        <CoreFeaturesSection />

        {/* 3. How It Works (3 Clear Steps) */}
        <HowItWorksSection />

        {/* 4. Pricing & Usage Tiers */}
        <PricingSection userName={userName} />

        {/* 5. Frequently Asked Questions */}
        <FaqSection />

        {/* 6. Final Call to Action & Unified Closing Footer (with Mirrored DarkVeil Background) */}
        <CtaSection userName={userName} />
      </main>
    </div>
  );
}
