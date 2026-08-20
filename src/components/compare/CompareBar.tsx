"use client";

import Link from "next/link";
import { useCompareStore } from "@/lib/store";
import { COMP_DATA } from "@/lib/data";

export function CompareBar() {
  const selected = useCompareStore((s) => s.selected);
  const clear = useCompareStore((s) => s.clear);

  if (selected.length === 0) return null;

  const records = selected
    .map((id) => COMP_DATA.find((r) => r.id === id))
    .filter(Boolean);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 shadow-lg">
      <span className="text-xs text-muted">
        {selected.length} selected for comparison
      </span>
      <div className="flex -space-x-1.5">
        {records.map((r) => (
          <span
            key={r!.id}
            title={`${r!.company} · L${r!.normalizedLevel}`}
            className="h-6 w-6 rounded-full border-2 border-surface bg-level/20 text-[10px] flex items-center justify-center font-mono text-level"
          >
            {r!.company.slice(0, 1)}
          </span>
        ))}
      </div>
      <Link
        href="/compare"
        className="rounded-full bg-level px-3 py-1 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
      >
        Compare
      </Link>
      <button onClick={clear} className="text-xs text-muted hover:text-foreground">
        Clear
      </button>
    </div>
  );
}
