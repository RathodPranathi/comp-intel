import { useMemo } from "react";
import { CompFilters, CompRecord } from "./types";

export function useFilteredData(data: CompRecord[], filters: CompFilters) {
  return useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return data.filter((r) => {
      if (q) {
        const haystack = `${r.company} ${r.levelName} ${r.location} ${r.roleFamily}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.roleFamilies.length && !filters.roleFamilies.includes(r.roleFamily)) return false;
      if (filters.locations.length && !filters.locations.includes(r.location)) return false;
      if (filters.tiers.length && !filters.tiers.includes(r.tier)) return false;
      if (r.normalizedLevel < filters.minLevel || r.normalizedLevel > filters.maxLevel) return false;
      if (r.totalComp < filters.minComp || r.totalComp > filters.maxComp) return false;
      return true;
    });
  }, [data, filters]);
}
