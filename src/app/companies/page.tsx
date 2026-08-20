import Link from "next/link";
import { COMP_DATA, getCompanies } from "@/lib/data";

export default function CompaniesIndex() {
  const companies = getCompanies().map((c) => {
    const records = COMP_DATA.filter((r) => r.companySlug === c.slug);
    const avgComp = Math.round(records.reduce((s, r) => s + r.totalComp, 0) / records.length);
    return { ...c, count: records.length, avgComp };
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Companies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((c) => (
          <Link
            key={c.slug}
            href={`/companies/${c.slug}`}
            className="rounded-lg border border-border bg-surface p-4 hover:border-level/50 transition-colors"
          >
            <h2 className="font-medium">{c.name}</h2>
            <p className="mt-1 text-xs text-muted">{c.count} data points</p>
            <p className="mt-2 font-mono text-lg text-level">${c.avgComp.toLocaleString()}</p>
            <p className="text-[11px] text-muted">avg total comp</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
