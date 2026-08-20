export type LevelTier =
  | "Entry"
  | "Mid"
  | "Senior"
  | "Staff"
  | "Principal"
  | "Distinguished";

export interface CompRecord {
  id: string;
  company: string;
  companySlug: string;
  role: string;
  roleFamily: "Engineering" | "Product" | "Design" | "Data" | "Sales";
  levelName: string; // company-specific label, e.g. "L4", "SDE2", "E5"
  normalizedLevel: number; // 1-10, cross-company comparable axis
  tier: LevelTier;
  location: string;
  country: string;
  yearsExperience: number;
  baseSalary: number;
  bonus: number;
  stock: number; // annualized
  totalComp: number;
  currency: "USD" | "INR" | "EUR" | "GBP";
  levelRangeMin: number; // total comp range for this normalized level, for band position
  levelRangeMax: number;
}

export interface CompFilters {
  search: string;
  companies: string[];
  roleFamilies: string[];
  locations: string[];
  tiers: LevelTier[];
  minLevel: number;
  maxLevel: number;
  minComp: number;
  maxComp: number;
}

export const EMPTY_FILTERS: CompFilters = {
  search: "",
  companies: [],
  roleFamilies: [],
  locations: [],
  tiers: [],
  minLevel: 1,
  maxLevel: 10,
  minComp: 0,
  maxComp: Infinity,
};
