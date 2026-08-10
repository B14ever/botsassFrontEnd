"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { title: string; bullets: string[] };
type SlidesContent = { title?: string; subtitle?: string; slides?: Slide[] };

export default function SlidesPreview({ content }: { content: SlidesContent }) {
  const slides = content.slides || [];
  const [index, setIndex] = useState(0);

  if (slides.length === 0) {
    return (
      <p className="text-muted-foreground text-[11px] italic">Outline pending…</p>
    );
  }

  // One large slide at a time, navigable — mirrors the
  // cover + content-slide styling of the actual generated PPTX.
  const total = slides.length + 1; // +1 for the title/cover slide
  const clampedIndex = Math.min(index, total - 1);
  const isCover = clampedIndex === 0;
  const slide = !isCover ? slides[clampedIndex - 1] : null;

  const goTo = (next: number) => setIndex(Math.max(0, Math.min(total - 1, next)));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border shadow-lg">
        {isCover ? (
          <div className="w-full h-full bg-gradient-to-br from-[#1F3A56] to-[#101B2B] flex flex-col items-center justify-center text-center px-10">
            <h2 className="text-white text-2xl md:text-3xl font-black font-outfit leading-tight">
              {content.title || "Untitled Presentation"}
            </h2>
            {content.subtitle && (
              <p className="text-[#BDC3C7] text-sm md:text-base italic mt-3">{content.subtitle}</p>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white to-[#F0F3F4] dark:from-secondary dark:to-secondary/70 flex flex-col px-8 md:px-12 py-8 md:py-10">
            <h3 className="text-[#1F3A56] dark:text-primary text-lg md:text-2xl font-black font-outfit mb-4 md:mb-6 shrink-0">
              {slide?.title}
            </h3>
            <ul className="space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar">
              {(slide?.bullets || []).map((bullet, bi) => (
                <li key={bi} className="flex gap-2.5 text-[#2C3E50] dark:text-foreground text-xs md:text-sm leading-relaxed">
                  <span className="text-[#1F3A56] dark:text-primary shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => goTo(clampedIndex - 1)}
          disabled={clampedIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-0 text-white flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => goTo(clampedIndex + 1)}
          disabled={clampedIndex === total - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-0 text-white flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === clampedIndex ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-muted-foreground text-[11px] font-medium">
        {isCover ? "Cover" : `Slide ${clampedIndex} of ${slides.length}`}
      </p>
    </div>
  );
}
