import { create } from "zustand";

interface CompareState {
  selected: string[]; // record ids
  toggle: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
}

const MAX_COMPARE = 4;

export const useCompareStore = create<CompareState>((set, get) => ({
  selected: [],
  toggle: (id) =>
    set((s) => {
      if (s.selected.includes(id)) {
        return { selected: s.selected.filter((x) => x !== id) };
      }
      if (s.selected.length >= MAX_COMPARE) return s;
      return { selected: [...s.selected, id] };
    }),
  clear: () => set({ selected: [] }),
  isSelected: (id) => get().selected.includes(id),
}));

export { MAX_COMPARE };
