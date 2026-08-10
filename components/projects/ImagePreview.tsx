"use client";

export default function ImagePreview({ src, prompt }: { src?: string; prompt?: string }) {
  if (!src) {
    return (
      <p className="text-muted-foreground text-[11px] italic">Rendering image…</p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={prompt || "Generated image"}
        className="max-w-full max-h-[70vh] w-auto rounded-xl border border-border shadow-lg object-contain"
      />
      {prompt && <p className="text-muted-foreground text-xs text-center max-w-md">{prompt}</p>}
    </div>
  );
}
