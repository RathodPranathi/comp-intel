"use client";

import { CompFilters } from "@/lib/types";

const ROLE_FAMILIES = ["Engineering", "Product", "Design", "Data", "Sales"];
const TIERS = ["Entry", "Mid", "Senior", "Staff", "Principal", "Distinguished"];

interface FilterPanelProps {
  filters: CompFilters;
  onChange: (next: CompFilters) => void;
  locations: string[];
  companies: string[];
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-level bg-level/15 text-level"
          : "border-border text-muted hover:border-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function FilterPanel({ filters, onChange, locations, companies }: FilterPanelProps) {
  function toggleArrayValue(key: "roleFamilies" | "locations" | "tiers", value: string) {
    const arr = filters[key] as string[];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  }

  return (
    <div className="space-y-5 rounded-lg border border-border bg-surface p-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Search
        </label>
        <input
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Company, level, location…"
          className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-level"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Normalized level ({filters.minLevel}–{filters.maxLevel})
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={10}
            value={filters.minLevel}
            onChange={(e) =>
              onChange({ ...filters, minLevel: Math.min(Number(e.target.value), filters.maxLevel) })
            }
            className="w-full accent-[var(--level)]"
          />
          <input
            type="range"
            min={1}
            max={10}
            value={filters.maxLevel}
            onChange={(e) =>
              onChange({ ...filters, maxLevel: Math.max(Number(e.target.value), filters.minLevel) })
            }
            className="w-full accent-[var(--level)]"
          />
        </div>
        <p className="mt-1 text-[11px] text-muted">
          Level, not title, is the comparable unit across companies.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Tier
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TIERS.map((t) => (
            <Chip
              key={t}
              active={filters.tiers.includes(t as CompFilters["tiers"][number])}
              onClick={() => toggleArrayValue("tiers", t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Role family
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ROLE_FAMILIES.map((r) => (
            <Chip key={r} active={filters.roleFamilies.includes(r)} onClick={() => toggleArrayValue("roleFamilies", r)}>
              {r}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
          Location
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto thin-scroll pr-1">
          {locations.map((loc) => (
            <Chip key={loc} active={filters.locations.includes(loc)} onClick={() => toggleArrayValue("locations", loc)}>
              {loc}
            </Chip>
          ))}
        </div>
      </div>

      {(filters.roleFamilies.length > 0 ||
        filters.locations.length > 0 ||
        filters.tiers.length > 0 ||
        filters.search ||
        filters.minLevel > 1 ||
        filters.maxLevel < 10) && (
        <button
          onClick={() =>
            onChange({
              search: "",
              companies: [],
              roleFamilies: [],
              locations: [],
              tiers: [],
              minLevel: 1,
              maxLevel: 10,
              minComp: 0,
              maxComp: Infinity,
            })
          }
          className="text-xs text-muted hover:text-foreground underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
