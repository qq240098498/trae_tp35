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

    result.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return filters.sortOrder === 'desc' ? -diff : diff;
    });

    return result;
  },

  getCount: () => get().items.length,

  markAsCompleted: (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return null;
    get().deleteItem(id);
    return { name: item.name, type: item.type };
  },
}));
