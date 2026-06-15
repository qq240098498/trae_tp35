import { create } from 'zustand';
import type { WishlistItem, WishlistType, WishlistFilterState } from '@/types';
import { loadWishlist, saveWishlist, generateId } from '@/utils/storage';

interface WishlistStore {
  items: WishlistItem[];
  filters: WishlistFilterState;
  addItem: (data: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, data: Partial<Omit<WishlistItem, 'id' | 'createdAt'>>) => void;
  deleteItem: (id: string) => void;
  setFilter: <K extends keyof WishlistFilterState>(key: K, value: WishlistFilterState[K]) => void;
  getFilteredItems: () => WishlistItem[];
  getCount: () => number;
  markAsCompleted: (id: string) => EntryLikeData | null;
  getAllTags: () => string[];
  getTopTags: (limit?: number) => Array<{ tag: string; count: number }>;
}

interface EntryLikeData {
  name: string;
  type: WishlistType;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: loadWishlist(),
  filters: {
    type: 'all',
    source: 'all',
    tag: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },

  addItem: (data) => {
    const item: WishlistItem = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const items = [item, ...get().items];
    saveWishlist(items);
    set({ items });
  },

  updateItem: (id, data) => {
    const items = get().items.map((i) =>
      i.id === id ? { ...i, ...data } : i
    );
    saveWishlist(items);
    set({ items });
  },

  deleteItem: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    saveWishlist(items);
    set({ items });
  },

  setFilter: (key, value) => {
    set({ filters: { ...get().filters, [key]: value } });
  },

  getFilteredItems: () => {
    const { items, filters } = get();
    let result = [...items];

    if (filters.type !== 'all') {
      result = result.filter((i) => i.type === filters.type);
    }

    if (filters.source !== 'all') {
      result = result.filter((i) => i.source === filters.source);
    }

    if (filters.tag !== 'all') {
      result = result.filter((i) => i.tags.includes(filters.tag));
    }

    result.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return filters.sortOrder === 'desc' ? -diff : diff;
    });

    return result;
  },

  getCount: () => get().items.length,

  getAllTags: () => {
    const { items } = get();
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  },

  getTopTags: (limit = 10) => {
    const { items } = get();
    const tagCount: Record<string, number> = {};
    items.forEach((item) => {
      item.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  markAsCompleted: (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return null;
    get().deleteItem(id);
    return { name: item.name, type: item.type };
  },
}));
