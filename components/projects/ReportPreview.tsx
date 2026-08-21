"use client";

import { useTranslations } from "next-intl";

type ReportSection = { heading: string; text: string };
type ReportContent = { title?: string; sections?: ReportSection[] };

export default function ReportPreview({ content }: { content: ReportContent }) {
  const t = useTranslations("workspace_detail");
  const sections = content.sections || [];

  if (sections.length === 0) {
    return (
      <p className="text-muted-foreground text-[11px] italic">{t("preview_draft_pending")}</p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-background border border-border rounded-xl shadow-lg px-8 md:px-14 py-10 md:py-14 space-y-8">
      <h1 className="text-foreground text-2xl md:text-3xl font-black font-outfit text-center leading-tight border-b border-border pb-6">
        {content.title || t("preview_untitled_report")}
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
