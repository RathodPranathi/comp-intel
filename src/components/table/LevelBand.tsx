interface LevelBandProps {
  value: number;
  min: number;
  max: number;
  compact?: boolean;
}

export function LevelBand({ value, min, max, compact }: LevelBandProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div className={compact ? "w-20" : "w-32"}>
      <div className="relative h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-level/25 rounded-full"
          style={{ width: "100%" }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-level rounded-full"
          style={{ left: `calc(${pct}% - 1px)` }}
        />
      </div>
      {!compact && (
        <div className="flex justify-between mt-1 text-[10px] text-muted font-mono">
          <span>{Math.round(min / 1000)}k</span>
          <span>{Math.round(max / 1000)}k</span>
        </div>
      )}
    </div>
  );
}

export function LevelPill({ tier, level }: { tier: string; level: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-level/40 bg-level/10 px-2 py-0.5 text-xs font-medium text-level">
      <span className="font-mono">L{level}</span>
      <span className="text-level/70">·</span>
      <span>{tier}</span>
    </span>
  );
}
