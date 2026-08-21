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
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ToolJob } from "@/lib/api/projects";
import SlidesPreview from "./SlidesPreview";
import ReportPreview from "./ReportPreview";
import SpreadsheetPreview from "./SpreadsheetPreview";
import ImagePreview from "./ImagePreview";
import { useTranslations } from "next-intl";

const TOOL_ICONS: Record<string, typeof Presentation> = {
  create_presentation: Presentation,
  write_report: FileText,
  analyze_data: FileSpreadsheet,
  generate_image: ImageIcon,
};

const TOOL_EXTS: Record<string, string> = {
  create_presentation: "PPTX",
  write_report: "DOCX",
  analyze_data: "XLSX",
  generate_image: "PNG",
};

const EDITABLE_TOOL_TYPES = new Set(["create_presentation", "write_report", "analyze_data"]);

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
  onEdit,
  isEditing,
}: {
  job: ToolJob;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onEdit?: (instruction: string) => void;
  isEditing?: boolean;
}) {
  const t = useTranslations("workspace_detail");
  const [expanded, setExpanded] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editInstruction, setEditInstruction] = useState("");

  const labelMap: Record<string, string> = {
    create_presentation: t("slides_tool"),
    write_report: t("report_tool"),
    analyze_data: t("spreadsheet_tool"),
    generate_image: t("image_tool"),
  };

  const stageMap: Record<string, string> = {
    queued: t("stage_queued"),
    fetching_sources: t("stage_fetching_sources"),
    loading_previous: t("stage_loading_previous"),
    drafting: t("stage_drafting"),
    rendering: t("stage_rendering"),
    uploading: t("stage_uploading"),
  };

  const label = labelMap[job.tool_type] || job.tool_type;
  const ext = TOOL_EXTS[job.tool_type] || "FILE";
  const Icon = TOOL_ICONS[job.tool_type] || FileText;

  const isPending = job.status === "pending" || job.status === "processing";
  const isCompleted = job.status === "completed";
  const isFailed = job.status === "failed";
  const canExpand = isCompleted && !!job.content_json;
  const canEdit = isCompleted && !!onEdit && EDITABLE_TOOL_TYPES.has(job.tool_type);

  const submitEdit = () => {
    if (!editInstruction.trim() || !onEdit) return;
    onEdit(editInstruction.trim());
    setEditInstruction("");
    setShowEditInput(false);
  };

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
      {t("artifact_view")}
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
      {t("artifact_download")}
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
                {label}
                <span className="text-muted-foreground font-medium"> · {ext}</span>
              </p>
              <p className="text-muted-foreground text-[10px] mt-0.5 flex items-center gap-1">
                {isPending && (
                  <>
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />
                    {stageMap[job.progress_stage] || t("artifact_working")}
                  </>
                )}
                {isCompleted && t("artifact_ready")}
                {isFailed && (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> {t("artifact_failed")}
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
                  {label}
                  <span className="text-muted-foreground font-medium"> · {ext}</span>
                </DialogTitle>
                {job.user_prompt && (
                  <p className="text-muted-foreground text-[11px] truncate mt-0.5">{job.user_prompt}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 mr-8">
              {canEdit && !isPending && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditInput((v) => !v)}
                  disabled={isEditing}
                  className="h-7 px-2.5 text-[10px] font-bold rounded-lg border-border gap-1"
                >
                  {isEditing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pencil className="w-3 h-3" />}
                  {t("artifact_edit")}
                </Button>
              )}
              {downloadButton}
              {regenerateButton}
            </div>
          </div>

          {showEditInput && (
            <div className="px-5 py-3 border-b border-border bg-secondary/40 flex items-center gap-2 shrink-0">
              <Input
                autoFocus
                placeholder={t("edit_instruction_placeholder")}
                value={editInstruction}
                onChange={(e) => setEditInstruction(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitEdit();
                  if (e.key === "Escape") setShowEditInput(false);
                }}
                className="flex-1 bg-background border-border text-foreground rounded-lg text-xs h-9"
              />
              <Button
                type="button"
                onClick={submitEdit}
                disabled={!editInstruction.trim()}
                className="h-9 px-4 text-xs font-bold rounded-lg"
              >
                {t("artifact_apply")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowEditInput(false)}
                className="h-9 w-9 p-0 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-secondary/20">
            <ArtifactBody job={job} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
