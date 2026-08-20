"use client";

import { useState } from "react";
import { COMP_DATA, getAllLocations, getCompanies } from "@/lib/data";
import { CompFilters, EMPTY_FILTERS } from "@/lib/types";
import { useFilteredData } from "@/lib/hooks";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { SalaryTable } from "@/components/table/SalaryTable";
import { CompareBar } from "@/components/compare/CompareBar";

export default function Home() {
  const [filters, setFilters] = useState<CompFilters>(EMPTY_FILTERS);
  const filtered = useFilteredData(COMP_DATA, filters);
  const locations = getAllLocations();
  const companies = getCompanies().map((c) => c.name);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Explore compensation</h1>
        <p className="mt-1 text-sm text-muted max-w-xl">
          Levels matter more than job titles. Every row is normalized to a 1–10 level
          scale so a &ldquo;Senior SDE&rdquo; and an &ldquo;E5&rdquo; land on the same axis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            locations={locations}
            companies={companies}
          />
        </aside>

        <section>
          <SalaryTable data={filtered} />
        </section>
      </div>

      <CompareBar />
    </div>
  );
}
