# Levelline — Compensation Intelligence System

## About

Levelline is a compensation intelligence platform built for Track B (Frontend
Engineer role). Unlike a typical salary-listing site, it treats **level** — not
job title — as the primary unit of comparison. A "Senior SDE" at one company and
an "E5" at another can sit at completely different points on the pay scale even
with similar titles, so every record here is normalized onto a 1–10 level scale
alongside its company-specific title. This makes salaries genuinely comparable
across companies, not just listed side by side.

The app lets users search and filter a large compensation dataset, sort by any
column, drill into per-company pay breakdowns with a level-distribution chart,
and select up to 4 records to compare directly on a shared set of attributes
(base, bonus, stock, total comp, and where that number falls within its level's
range).

Built with Next.js, React, TypeScript, and TailwindCSS, using TanStack Table and
TanStack Virtual so the table stays fast and responsive even with hundreds of rows.

## Running it locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser. The app reloads automatically
as you edit files.

To build and run a production version instead:

```bash
npm run build
npm run start
```
