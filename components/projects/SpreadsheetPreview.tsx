"use client";

import { useState } from "react";

type SpreadsheetRow = { cells: (string | number)[] };
type Sheet = { name: string; headers: string[]; rows: SpreadsheetRow[] };
type SpreadsheetContent = { sheets?: Sheet[] };

export default function SpreadsheetPreview({ content }: { content: SpreadsheetContent }) {
  const sheets = content.sheets || [];
  const [activeSheet, setActiveSheet] = useState(0);

  if (sheets.length === 0) {
    return (
      <p className="text-muted-foreground text-[11px] italic">Data extraction pending…</p>
    );
  }

  const sheet = sheets[Math.min(activeSheet, sheets.length - 1)];
  const rows = sheet.rows || [];

  return (
    <div className="rounded-xl border border-border bg-secondary/40 overflow-hidden shadow-lg">
      {sheets.length > 1 && (
        <div className="flex gap-1 overflow-x-auto px-3 pt-3">
          {sheets.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSheet(i)}
              className={`text-xs font-bold px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                i === activeSheet
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {s.name || `Sheet ${i + 1}`}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-auto custom-scrollbar max-h-[65vh]">
        <table className="w-full border-collapse text-xs">
          <thead className="sticky top-0 bg-secondary z-10">
            <tr>
              <th className="text-left font-bold text-muted-foreground/60 px-2.5 py-2 border-b border-border w-8">
                #
              </th>
              {(sheet.headers || []).map((h, i) => (
                <th
                  key={i}
                  className="text-left font-bold text-foreground border-b border-border whitespace-nowrap px-3 py-2"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? "bg-secondary/50" : ""}>
                <td className="px-2.5 py-1.5 text-muted-foreground/50 font-mono text-[10px]">{ri + 1}</td>
                {row.cells.map((cell, ci) => (
                  <td key={ci} className="text-muted-foreground whitespace-nowrap px-3 py-1.5">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
