"use client";

type ReportSection = { heading: string; text: string };
type ReportContent = { title?: string; sections?: ReportSection[] };

export default function ReportPreview({ content }: { content: ReportContent }) {
  const sections = content.sections || [];

  if (sections.length === 0) {
    return (
      <p className="text-muted-foreground text-[11px] italic">Draft pending…</p>
    );
  }

  return (
    <div className="max-h-56 overflow-y-auto custom-scrollbar rounded-lg border border-border bg-secondary/40 p-3 space-y-2.5">
      {content.title && (
        <p className="text-foreground text-[12px] font-black">{content.title}</p>
      )}
      {sections.map((sec, i) => (
        <div key={i}>
          <p className="text-primary text-[10px] font-bold uppercase tracking-wide mb-0.5">
            {sec.heading}
          </p>
          <p className="text-muted-foreground text-[10.5px] leading-relaxed line-clamp-4">
            {sec.text}
          </p>
        </div>
      ))}
    </div>
  );
}
