"use client";

import { useEffect, useRef, useState } from "react";
import {
  Presentation,
  FileText,
  FileSpreadsheet,
  ImageIcon,
  Download,
  Loader2,
  RotateCcw,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

function ArtifactBody({ job }: { job: ToolJob }) {
  if (!job.content_json) return null;
  switch (job.tool_type) {
    case "create_presentation":
      return <SlidesPreview content={job.content_json} />;
    case "write_report":
      return <ReportPreview content={job.content_json} />;
    case "analyze_data":
      return <SpreadsheetPreview content={job.content_json} />;
    case "generate_image":
      return (
        <ImagePreview
          src={job.status === "completed" ? job.output_file_url : undefined}
          prompt={job.content_json?.prompt}
        />
      );
    default:
      return null;
  }
}

export default function ArtifactCard({
  job,
  onRegenerate,
  isRegenerating,
}: {
  job: ToolJob;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = TOOL_META[job.tool_type] || { label: job.tool_type, icon: FileText, ext: "FILE" };
  const Icon = meta.icon;
  const isPending = job.status === "pending" || job.status === "processing";
  const isCompleted = job.status === "completed";
  const isFailed = job.status === "failed";
  const canExpand = isCompleted && !!job.content_json;

  // Open automatically the moment a job finishes generating (not for
  // artifacts that were already complete when this card first mounted, e.g.
  // loaded from history) — closing it just leaves the card clickable again.
  const prevStatusRef = useRef(job.status);
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = job.status;
    if (job.status === "completed" && prevStatus !== "completed" && job.content_json) {
      setExpanded(true);
    }
  }, [job.status, job.content_json]);

  const viewButton = canExpand && (
    <Button
      type="button"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(true);
      }}
      className="h-7 px-2.5 text-[10px] font-bold rounded-lg border-border gap-1"
    >
      <Eye className="w-3 h-3" />
      View
    </Button>
  );

  const downloadButton = isCompleted && job.output_file_url && (
    <a
      href={job.output_file_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-[10px] py-1.5 px-3 rounded-lg transition-all inline-flex items-center gap-1"
    >
      <Download className="w-3 h-3" />
      Download
    </a>
  );

  const regenerateButton = !isPending && onRegenerate && (
    <Button
      type="button"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        onRegenerate();
      }}
      disabled={isRegenerating}
      className="h-7 px-2 text-[10px] font-bold rounded-lg border-border"
    >
      {isRegenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
    </Button>
  );

  return (
    <>
      <div
        onClick={() => canExpand && setExpanded(true)}
        className={`rounded-xl border border-border bg-card p-3.5 max-w-md w-full space-y-3 transition-all ${
          canExpand ? "cursor-pointer hover:border-primary/40 hover:shadow-md" : ""
        }`}
      >
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
            {viewButton}
            {downloadButton}
            {regenerateButton}
          </div>
        </div>

        {isFailed && job.error && (
          <p className="text-red-400/80 text-[10px] leading-relaxed">{job.error}</p>
        )}
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="sm:max-w-4xl w-[calc(100%-2rem)] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-sm font-bold text-foreground truncate">
                  {meta.label}
                  <span className="text-muted-foreground font-medium"> · {meta.ext}</span>
                </DialogTitle>
                {job.user_prompt && (
                  <p className="text-muted-foreground text-[11px] truncate mt-0.5">{job.user_prompt}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 mr-8">
              {downloadButton}
              {regenerateButton}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-secondary/20">
            <ArtifactBody job={job} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
