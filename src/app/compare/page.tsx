"use client";

import { COMP_DATA } from "@/lib/data";
import { useCompareStore } from "@/lib/store";
import { LevelBand, LevelPill } from "@/components/table/LevelBand";
import Link from "next/link";

function fmt(n: number, currency: string) {
  const symbol = currency === "INR" ? "₹" : currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${n.toLocaleString()}`;
}

export default function ComparePage() {
  const selected = useCompareStore((s) => s.selected);
  const clear = useCompareStore((s) => s.clear);
  const records = selected
    .map((id) => COMP_DATA.find((r) => r.id === id))
    .filter(Boolean) as NonNullable<(typeof COMP_DATA)[number]>[];

  if (records.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-xl font-semibold">Nothing to compare yet</h1>
        <p className="mt-2 text-sm text-muted">
          Select a few rows on the explore page — up to 4 — and they will line up here
          side by side.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-level px-4 py-2 text-sm font-semibold text-background"
        >
          Go to Explore
        </Link>
      </div>
    );
  }

  const rows: { label: string; render: (r: (typeof records)[number]) => React.ReactNode }[] = [
    { label: "Company", render: (r) => <span className="font-medium">{r.company}</span> },
    { label: "Level", render: (r) => <LevelPill tier={r.tier} level={r.normalizedLevel} /> },
    { label: "Role family", render: (r) => r.roleFamily },
    { label: "Location", render: (r) => r.location },
    { label: "Base salary", render: (r) => fmt(r.baseSalary, r.currency) },
    { label: "Bonus", render: (r) => fmt(r.bonus, r.currency) },
    { label: "Stock (annualized)", render: (r) => fmt(r.stock, r.currency) },
    {
      label: "Total comp",
      render: (r) => <span className="font-mono font-semibold text-lg">{fmt(r.totalComp, r.currency)}</span>,
    },
    {
      label: "Position in level band",
      render: (r) => <LevelBand value={r.totalComp} min={r.levelRangeMin} max={r.levelRangeMax} />,
    },
    { label: "Years experience", render: (r) => `${r.yearsExperience} yrs` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Comparison</h1>
          <p className="mt-1 text-sm text-muted">
            {records.length} record{records.length > 1 ? "s" : ""} compared on a common level axis.
          </p>
        </div>
        <button onClick={clear} className="text-sm text-muted hover:text-foreground underline">
          Clear selection
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2/40"}>
                <td className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted whitespace-nowrap w-40">
                  {row.label}
                </td>
                {records.map((r) => (
                  <td key={r.id} className="px-4 py-3 border-l border-border/60">
                    {row.render(r)}
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
