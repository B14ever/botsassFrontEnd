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

  return (
    <div className="rounded-lg border border-border bg-secondary/40 overflow-hidden">
      {sheets.length > 1 && (
        <div className="flex gap-1 px-2 pt-2 overflow-x-auto">
          {sheets.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSheet(i)}
              className={`text-[9px] font-bold px-2 py-1 rounded-md shrink-0 ${
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
      <div className="max-h-56 overflow-auto custom-scrollbar">
        <table className="w-full text-[10px] border-collapse">
          <thead className="sticky top-0 bg-secondary">
            <tr>
              {(sheet.headers || []).map((h, i) => (
                <th
                  key={i}
                  className="text-left font-bold text-foreground px-2.5 py-1.5 border-b border-border whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(sheet.rows || []).slice(0, 12).map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? "bg-secondary/50" : ""}>
                {row.cells.map((cell, ci) => (
                  <td key={ci} className="px-2.5 py-1 text-muted-foreground whitespace-nowrap">
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
