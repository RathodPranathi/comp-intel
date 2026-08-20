"use client";

import { CompRecord } from "@/lib/types";
import { SalaryTable } from "@/components/table/SalaryTable";
import { CompareBar } from "@/components/compare/CompareBar";
import { LevelDistribution } from "@/components/charts/LevelDistribution";

export function CompanyClient({
  companyName,
  records,
}: {
  companyName: string;
  records: CompRecord[];
}) {
  const avgComp = Math.round(records.reduce((s, r) => s + r.totalComp, 0) / records.length);
  const levelSpread = `L${Math.min(...records.map((r) => r.normalizedLevel))}–L${Math.max(
    ...records.map((r) => r.normalizedLevel)
  )}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{companyName}</h1>
        <div className="mt-2 flex gap-6 text-sm text-muted">
          <span>
            <span className="text-foreground font-mono font-medium">{records.length}</span> data points
          </span>
          <span>
            Level range <span className="text-foreground font-mono font-medium">{levelSpread}</span>
          </span>
          <span>
            Avg total comp{" "}
            <span className="text-foreground font-mono font-medium">${avgComp.toLocaleString()}</span>
          </span>
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-surface p-5">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">
          Average total comp by level
        </h2>
        <LevelDistribution records={records} />
      </div>

      <SalaryTable data={records} />
      <CompareBar />
    </div>
  );
}
