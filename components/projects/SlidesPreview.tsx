"use client";

type Slide = { title: string; bullets: string[] };
type SlidesContent = { title?: string; subtitle?: string; slides?: Slide[] };

export default function SlidesPreview({ content }: { content: SlidesContent }) {
  const slides = content.slides || [];

  if (slides.length === 0) {
    return (
      <p className="text-muted-foreground text-[11px] italic">Outline pending…</p>
    );
  }

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-1 custom-scrollbar">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="shrink-0 w-44 aspect-[4/3] rounded-lg border border-border bg-gradient-to-br from-secondary to-secondary/60 p-3 flex flex-col"
        >
          <p className="text-[9px] font-black uppercase tracking-widest text-primary/70 mb-1">
            Slide {i + 1}
          </p>
          <p className="text-foreground text-[11px] font-bold leading-tight mb-1.5 line-clamp-2">
            {slide.title}
          </p>
          <ul className="space-y-0.5 overflow-hidden">
            {(slide.bullets || []).slice(0, 4).map((bullet, bi) => (
              <li key={bi} className="text-muted-foreground text-[9px] leading-snug line-clamp-1">
                • {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
