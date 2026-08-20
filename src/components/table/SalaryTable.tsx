"use client";

import { useRef, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CompRecord } from "@/lib/types";
import { LevelBand, LevelPill } from "./LevelBand";
import { useCompareStore } from "@/lib/store";
import Link from "next/link";

function CompareCheckbox({ id }: { id: string }) {
  const selected = useCompareStore((s) => s.selected.includes(id));
  const toggle = useCompareStore((s) => s.toggle);
  return (
    <input
      type="checkbox"
      checked={selected}
      onChange={() => toggle(id)}
      onClick={(e) => e.stopPropagation()}
      className="h-3.5 w-3.5 accent-[var(--level)]"
    />
  );
}

function fmt(n: number, currency: string) {
  const symbol = currency === "INR" ? "₹" : currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${symbol}${n.toLocaleString()}`;
}

const columns: ColumnDef<CompRecord>[] = [
  {
    id: "select",
    header: "",
    size: 36,
    cell: ({ row }) => <CompareCheckbox id={row.original.id} />,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <Link
        href={`/companies/${row.original.companySlug}`}
        className="font-medium text-foreground hover:text-level transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {row.original.company}
      </Link>
    ),
  },
  {
    accessorKey: "levelName",
    header: "Level",
    cell: ({ row }) => (
      <LevelPill tier={row.original.tier} level={row.original.normalizedLevel} />
    ),
  },
  {
    accessorKey: "roleFamily",
    header: "Role",
    cell: ({ row }) => <span className="text-muted">{row.original.roleFamily}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted">{row.original.location}</span>,
  },
  {
    accessorKey: "totalComp",
    header: "Total Comp",
    cell: ({ row }) => (
      <span className="font-mono font-semibold text-foreground">
        {fmt(row.original.totalComp, row.original.currency)}
      </span>
    ),
  },
  {
    id: "band",
    header: "Band position",
    cell: ({ row }) => (
      <LevelBand
        value={row.original.totalComp}
        min={row.original.levelRangeMin}
        max={row.original.levelRangeMax}
        compact
      />
    ),
  },
];

export function SalaryTable({ data }: { data: CompRecord[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "totalComp", desc: true }]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 12,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="grid grid-cols-[36px_1.2fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-4 py-2.5 border-b border-border bg-surface-2 text-xs font-medium text-muted uppercase tracking-wide">
        {table.getHeaderGroups()[0].headers.map((header) => (
          <button
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
            className="flex items-center gap-1 text-left hover:text-foreground transition-colors disabled:cursor-default"
            disabled={!header.column.getCanSort()}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
              asc: " ↑",
              desc: " ↓",
            }[header.column.getIsSorted() as string] ?? null}
          </button>
        ))}
      </div>

      <div ref={parentRef} className="thin-scroll h-[520px] overflow-auto">
        <div style={{ height: paddingTop }} />
        {virtualRows.map((vRow) => {
          const row = rows[vRow.index];
          return (
            <div
              key={row.id}
              className="grid grid-cols-[36px_1.2fr_1fr_1fr_1fr_1fr_1fr] gap-2 items-center px-4 py-2.5 border-b border-border/60 hover:bg-surface-2/60 transition-colors"
              style={{ height: vRow.size }}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="text-sm truncate">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          );
        })}
        <div style={{ height: paddingBottom }} />
        {rows.length === 0 && (
          <div className="px-4 py-10 text-center text-muted text-sm">
            No results match these filters. Try widening the level range or clearing a filter.
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border bg-surface-2 text-xs text-muted">
        {rows.length.toLocaleString()} records
      </div>
    </div>
  );
}
