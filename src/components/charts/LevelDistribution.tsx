import { CompRecord } from "@/lib/types";

export function LevelDistribution({ records }: { records: CompRecord[] }) {
  const byLevel = new Map<number, { count: number; avgComp: number; total: number }>();
  for (const r of records) {
    const entry = byLevel.get(r.normalizedLevel) ?? { count: 0, avgComp: 0, total: 0 };
    entry.count += 1;
    entry.total += r.totalComp;
    byLevel.set(r.normalizedLevel, entry);
  }
  const levels = Array.from(byLevel.entries())
    .map(([level, e]) => ({ level, count: e.count, avg: Math.round(e.total / e.count) }))
    .sort((a, b) => a.level - b.level);

  if (levels.length === 0) {
    return <p className="text-sm text-muted">No data available for this company yet.</p>;
  }

  const maxAvg = Math.max(...levels.map((l) => l.avg));

  return (
    <div className="flex items-end gap-3 h-48">
      {levels.map((l) => {
        const heightPct = (l.avg / maxAvg) * 100;
        return (
          <div key={l.level} className="flex flex-col items-center flex-1 h-full justify-end">
            <span className="mb-1 text-[10px] font-mono text-muted">
              {Math.round(l.avg / 1000)}k
            </span>
            <div
              className="w-full rounded-t bg-level/70 hover:bg-level transition-colors"
              style={{ height: `${heightPct}%` }}
              title={`L${l.level}: avg ${l.avg.toLocaleString()} (${l.count} records)`}
            />
            <span className="mt-1.5 text-[11px] font-mono text-muted">L{l.level}</span>
          </div>
        );
      })}
    </div>
  );
}
