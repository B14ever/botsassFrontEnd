"use client";

import React from "react";
import NeuralBackground from "@/components/landing/NeuralBackground";

export default function AuthAnimationSection() {
  return (
    <div className="relative w-full h-full min-h-[400px] lg:min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <NeuralBackground className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-75 dark:opacity-60" />
    </div>
  );
}
