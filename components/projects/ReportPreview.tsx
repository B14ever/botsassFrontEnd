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

  // A centered "document page" with real typography, mirroring
  // the layout of the generated .docx (title + heading + body per section).
  return (
    <div className="max-w-2xl mx-auto bg-background border border-border rounded-xl shadow-lg px-8 md:px-14 py-10 md:py-14 space-y-8">
      <h1 className="text-foreground text-2xl md:text-3xl font-black font-outfit text-center leading-tight border-b border-border pb-6">
        {content.title || "Untitled Report"}
      </h1>
      {sections.map((sec, i) => (
        <div key={i} className="space-y-2">
          <h2 className="text-primary text-sm md:text-base font-black font-outfit">{sec.heading}</h2>
          <p className="text-foreground/90 text-sm leading-[1.8] whitespace-pre-line">{sec.text}</p>
        </div>
      ))}
    </div>
  );
}
