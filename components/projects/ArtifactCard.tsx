"use client";

import {
  Presentation,
  FileText,
  FileSpreadsheet,
  ImageIcon,
  Download,
  Loader2,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ToolJob } from "@/lib/api/projects";
import SlidesPreview from "./SlidesPreview";
import ReportPreview from "./ReportPreview";
import SpreadsheetPreview from "./SpreadsheetPreview";
import ImagePreview from "./ImagePreview";

const TOOL_META: Record<string, { label: string; icon: typeof Presentation; ext: string }> = {
  create_presentation: { label: "Presentation", icon: Presentation, ext: "PPTX" },
  write_report: { label: "Report", icon: FileText, ext: "DOCX" },
  analyze_data: { label: "Spreadsheet", icon: FileSpreadsheet, ext: "XLSX" },
  generate_image: { label: "Image", icon: ImageIcon, ext: "PNG" },
};

const STAGE_LABELS: Record<string, string> = {
  queued: "Queued…",
  fetching_sources: "Reading knowledge base…",
  drafting: "Drafting content…",
  rendering: "Rendering file…",
  uploading: "Uploading…",
};

export default function ArtifactCard({
  job,
  onRegenerate,
  isRegenerating,
}: {
  job: ToolJob;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}) {
  const meta = TOOL_META[job.tool_type] || { label: job.tool_type, icon: FileText, ext: "FILE" };
  const Icon = meta.icon;
  const isPending = job.status === "pending" || job.status === "processing";
  const isCompleted = job.status === "completed";
  const isFailed = job.status === "failed";

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 max-w-md w-full space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground text-[12px] font-bold truncate">
              {meta.label}
              <span className="text-muted-foreground font-medium"> · {meta.ext}</span>
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5 flex items-center gap-1">
              {isPending && (
                <>
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />
                  {STAGE_LABELS[job.progress_stage] || "Working…"}
                </>
              )}
              {isCompleted && "Ready"}
              {isFailed && (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" /> Failed
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isCompleted && job.output_file_url && (
            <a
              href={job.output_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all inline-flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </a>
          )}
          {!isPending && onRegenerate && (
            <Button
              type="button"
              variant="outline"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="h-7 px-2 text-[10px] font-bold rounded-lg border-border"
            >
              {isRegenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RotateCcw className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      </div>

      {isFailed && job.error && (
        <p className="text-red-400/80 text-[10px] leading-relaxed">{job.error}</p>
      )}

      {job.content_json && (
        <div>
          {job.tool_type === "create_presentation" && <SlidesPreview content={job.content_json} />}
          {job.tool_type === "write_report" && <ReportPreview content={job.content_json} />}
          {job.tool_type === "analyze_data" && <SpreadsheetPreview content={job.content_json} />}
          {job.tool_type === "generate_image" && (
            <ImagePreview
              src={isCompleted ? job.output_file_url : undefined}
              prompt={job.content_json?.prompt}
            />
          )}
        </div>
      )}
    </div>
  );
}
