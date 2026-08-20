import { CompRecord, LevelTier } from "./types";

const COMPANIES = [
  { name: "Stratosoft", slug: "stratosoft" },
  { name: "Northbeam", slug: "northbeam" },
  { name: "Ferrovia Systems", slug: "ferrovia-systems" },
  { name: "Quillhorn", slug: "quillhorn" },
  { name: "Vantpoint", slug: "vantpoint" },
  { name: "Anchorwell", slug: "anchorwell" },
  { name: "Basecamp Analytics", slug: "basecamp-analytics" },
  { name: "Deepgrid", slug: "deepgrid" },
  { name: "Solvane", slug: "solvane" },
  { name: "Cursive Labs", slug: "cursive-labs" },
];

const ROLE_FAMILIES: CompRecord["roleFamily"][] = [
  "Engineering",
  "Product",
  "Design",
  "Data",
  "Sales",
];

// Each company maps normalized level (1-10) to its own internal title.
const LEVEL_TITLES: Record<CompRecord["roleFamily"], string[]> = {
  Engineering: [
    "SDE1",
    "SDE2",
    "SDE2",
    "Senior SDE",
    "Senior SDE",
    "Staff SDE",
    "Staff SDE",
    "Senior Staff",
    "Principal",
    "Distinguished",
  ],
  Product: [
    "APM",
    "PM I",
    "PM II",
    "Senior PM",
    "Senior PM",
    "Group PM",
    "Group PM",
    "Principal PM",
    "Director PM",
    "VP Product",
  ],
  Design: [
    "Designer I",
    "Designer II",
    "Designer II",
    "Senior Designer",
    "Senior Designer",
    "Staff Designer",
    "Staff Designer",
    "Principal Designer",
    "Design Director",
    "VP Design",
  ],
  Data: [
    "Analyst I",
    "Data Scientist I",
    "Data Scientist II",
    "Senior DS",
    "Senior DS",
    "Staff DS",
    "Staff DS",
    "Principal DS",
    "Director Data",
    "VP Data",
  ],
  Sales: [
    "SDR",
    "AE I",
    "AE II",
    "Senior AE",
    "Senior AE",
    "Enterprise AE",
    "Strategic AE",
    "Sales Lead",
    "Director Sales",
    "VP Sales",
  ],
};

const TIER_BY_LEVEL: LevelTier[] = [
  "Entry",
  "Entry",
  "Mid",
  "Mid",
  "Senior",
  "Senior",
  "Staff",
  "Staff",
  "Principal",
  "Distinguished",
];

const LOCATIONS: { city: string; country: string; costIndex: number }[] = [
  { city: "Bengaluru", country: "India", costIndex: 0.55 },
  { city: "Hyderabad", country: "India", costIndex: 0.5 },
  { city: "Pune", country: "India", costIndex: 0.48 },
  { city: "Gurgaon", country: "India", costIndex: 0.52 },
  { city: "San Francisco", country: "USA", costIndex: 1.6 },
  { city: "Seattle", country: "USA", costIndex: 1.35 },
  { city: "New York", country: "USA", costIndex: 1.55 },
  { city: "Austin", country: "USA", costIndex: 1.15 },
  { city: "London", country: "UK", costIndex: 1.3 },
  { city: "Berlin", country: "Germany", costIndex: 1.05 },
  { city: "Singapore", country: "Singapore", costIndex: 1.2 },
  { city: "Toronto", country: "Canada", costIndex: 1.1 },
];

// Seeded PRNG so the dataset is stable across renders/builds.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function currencyFor(country: string): CompRecord["currency"] {
  if (country === "India") return "INR";
  if (country === "UK") return "GBP";
  if (country === "Germany") return "EUR";
  return "USD";
}

// Base total-comp anchor per normalized level (USD, before location/company noise).
const LEVEL_BASE_COMP = [45000, 65000, 90000, 130000, 175000, 230000, 300000, 400000, 550000, 750000];

function generateRecords(count: number): CompRecord[] {
  const records: CompRecord[] = [];
  for (let i = 0; i < count; i++) {
    const company = pick(COMPANIES);
    const roleFamily = pick(ROLE_FAMILIES);
    const normalizedLevel = 1 + Math.floor(rand() * 10);
    const idx = normalizedLevel - 1;
    const levelName = LEVEL_TITLES[roleFamily][idx];
    const tier = TIER_BY_LEVEL[idx];
    const loc = pick(LOCATIONS);
    const currency = currencyFor(loc.country);

    // Company comp philosophy: some companies pay 15% above/below market band.
    const companyMultiplier = 0.85 + (COMPANIES.indexOf(company) % 5) * 0.08;
    const anchor = LEVEL_BASE_COMP[idx] * loc.costIndex * companyMultiplier;
    const noise = 0.85 + rand() * 0.3; // +/-15% individual variance
    const totalCompUSD = Math.round((anchor * noise) / 500) * 500;

    const stockShare = tier === "Entry" || tier === "Mid" ? 0.1 : 0.28;
    const bonusShare = 0.08;
    const stock = Math.round(totalCompUSD * stockShare);
    const bonus = Math.round(totalCompUSD * bonusShare);
    const baseSalary = totalCompUSD - stock - bonus;

    // Convert display currency roughly (for realism only, not FX-accurate).
    const fx = currency === "INR" ? 83 : currency === "GBP" ? 0.79 : currency === "EUR" ? 0.92 : 1;

    const levelRangeMin = Math.round(LEVEL_BASE_COMP[idx] * loc.costIndex * 0.85 * fx);
    const levelRangeMax = Math.round(LEVEL_BASE_COMP[idx] * loc.costIndex * 1.25 * companyMultiplier * fx);

    records.push({
      id: `rec-${i}`,
      company: company.name,
      companySlug: company.slug,
      role: levelName,
      roleFamily,
      levelName,
      normalizedLevel,
      tier,
      location: loc.city,
      country: loc.country,
      yearsExperience: Math.max(0, Math.round(idx * 1.6 + rand() * 2 - 1)),
      baseSalary: Math.round(baseSalary * fx),
      bonus: Math.round(bonus * fx),
      stock: Math.round(stock * fx),
      totalComp: Math.round(totalCompUSD * fx),
      currency,
      levelRangeMin,
      levelRangeMax,
    });
  }
  return records;
}

export const COMP_DATA: CompRecord[] = generateRecords(600);

export function getCompanies() {
  return COMPANIES;
}

export function getCompanyBySlug(slug: string) {
  return COMPANIES.find((c) => c.slug === slug);
}

export function getRecordsForCompany(slug: string) {
  return COMP_DATA.filter((r) => r.companySlug === slug);
}

export function getAllLocations() {
  return Array.from(new Set(COMP_DATA.map((r) => r.location))).sort();
}
