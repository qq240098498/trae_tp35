import { create } from 'zustand';
import type { Entry, EntryType, FilterState, Rating, YearStats } from '@/types';
import { loadEntries, saveEntries, generateId } from '@/utils/storage';

interface EntryStore {
  entries: Entry[];
  filters: FilterState;
  addEntry: (data: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, data: Partial<Omit<Entry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  getFilteredEntries: () => Entry[];
  getYears: () => number[];
  getYearStats: (year: number) => YearStats;
  getAllYearsStats: () => YearStats[];
}

function calcYearStats(entries: Entry[], year: number): YearStats {
  const yearEntries = entries.filter((e) => new Date(e.date).getFullYear() === year);

  const byType: YearStats['byType'] = {
    movie: { count: 0, avgRating: 0 },
    book: { count: 0, avgRating: 0 },
    album: { count: 0, avgRating: 0 },
    game: { count: 0, avgRating: 0 },
  };

  const typeSums: Record<EntryType, number> = { movie: 0, book: 0, album: 0, game: 0 };

  yearEntries.forEach((e) => {
    byType[e.type].count++;
    typeSums[e.type] += e.rating;
  });

  (Object.keys(byType) as EntryType[]).forEach((t) => {
    byType[t].avgRating = byType[t].count > 0 ? typeSums[t] / byType[t].count : 0;
  });

  const total = yearEntries.length;
  const avgRating = total > 0 ? yearEntries.reduce((s, e) => s + e.rating, 0) / total : 0;

  let favoriteType: EntryType | null = null;
  let maxCount = 0;
  (Object.keys(byType) as EntryType[]).forEach((t) => {
    if (byType[t].count > maxCount) {
      maxCount = byType[t].count;
      favoriteType = t;
    }
  });

  const topEntries = [...yearEntries]
    .sort((a, b) => b.rating - a.rating || new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return { year, total, avgRating, favoriteType, byType, topEntries };
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: loadEntries(),
  filters: {
    type: 'all',
    year: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  },

  addEntry: (data) => {
    const now = new Date().toISOString();
    const entry: Entry = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const entries = [entry, ...get().entries];
    saveEntries(entries);
    set({ entries });
  },

  updateEntry: (id, data) => {
    const entries = get().entries.map((e) =>
      e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
    );
    saveEntries(entries);
    set({ entries });
  },

  deleteEntry: (id) => {
    const entries = get().entries.filter((e) => e.id !== id);
    saveEntries(entries);
    set({ entries });
  },

  setFilter: (key, value) => {
    set({ filters: { ...get().filters, [key]: value } });
  },

  getFilteredEntries: () => {
    const { entries, filters } = get();
    let result = [...entries];

    if (filters.type !== 'all') {
      result = result.filter((e) => e.type === filters.type);
    }

    if (filters.year !== 'all') {
      result = result.filter((e) => new Date(e.date).getFullYear() === filters.year);
    }

    result.sort((a, b) => {
      let diff = 0;
      if (filters.sortBy === 'rating') {
        diff = a.rating - b.rating;
      } else {
        diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return filters.sortOrder === 'desc' ? -diff : diff;
    });

    return result;
  },

  getYears: () => {
    const years = new Set(get().entries.map((e) => new Date(e.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  },

  getYearStats: (year) => calcYearStats(get().entries, year),

  getAllYearsStats: () => {
    const years = get().getYears();
    return years.map((y) => calcYearStats(get().entries, y));
  },
}));

export type { Rating };
