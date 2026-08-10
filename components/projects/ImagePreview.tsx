"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

export default function ImagePreview({ src, prompt }: { src?: string; prompt?: string }) {
  const [open, setOpen] = useState(false);

  if (!src) {
    return (
      <p className="text-muted-foreground text-[11px] italic">Rendering image…</p>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative block w-full max-w-xs rounded-lg overflow-hidden border border-border"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={prompt || "Generated image"} className="w-full h-auto block" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="text-xs">{prompt || "Generated image"}</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={prompt || "Generated image"} className="w-full h-auto rounded-lg" />
        </DialogContent>
      </Dialog>
    </>
  );
}
