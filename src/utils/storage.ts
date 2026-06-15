import type { Entry, WishlistItem } from '@/types';

const STORAGE_KEY = 'media-archive-entries';
const WISHLIST_STORAGE_KEY = 'media-archive-wishlist';
const LAST_REMINDER_KEY = 'media-archive-last-reminder';

export function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getMockData();
    const parsed = JSON.parse(raw) as Entry[];
    if (!Array.isArray(parsed)) return getMockData();
    return parsed;
  } catch {
    return getMockData();
  }
}

export function saveEntries(entries: Entry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save entries:', e);
  }
}

export function loadWishlist(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return getWishlistMockData();
    const parsed = JSON.parse(raw) as WishlistItem[];
    if (!Array.isArray(parsed)) return getWishlistMockData();
    return parsed;
  } catch {
    return getWishlistMockData();
  }
}

export function saveWishlist(items: WishlistItem[]): void {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
}

export function getLastReminderDate(): string | null {
  return localStorage.getItem(LAST_REMINDER_KEY);
}

export function setLastReminderDate(date: string): void {
  localStorage.setItem(LAST_REMINDER_KEY, date);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function getMockData(): Entry[] {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();

  const mock: Entry[] = [
    {
      id: generateId(),
      name: '盗梦空间',
      type: 'movie',
      date: '2026-05-12',
      rating: 5,
      review: '诺兰的巅峰之作，层层嵌套的梦境结构令人叹为观止。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: '百年孤独',
      type: 'book',
      date: '2026-03-08',
      rating: 5,
      review: '魔幻现实主义的经典，布恩迪亚家族的兴衰令人震撼。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: 'Random Access Memories',
      type: 'album',
      date: '2026-04-20',
      rating: 4,
      review: 'Daft Punk的经典专辑，Get Lucky百听不厌。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: '塞尔达传说：旷野之息',
      type: 'game',
      date: '2026-01-15',
      rating: 5,
      review: '开放世界游戏的天花板，自由度令人惊叹。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: '银翼杀手2049',
      type: 'movie',
      date: '2025-11-23',
      rating: 4,
      review: '视觉盛宴，维伦纽瓦的镜头语言无与伦比。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: '三体',
      type: 'book',
      date: '2025-08-10',
      rating: 5,
      review: '中国科幻的里程碑，黑暗森林理论让人深思。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: 'OK Computer',
      type: 'album',
      date: '2025-09-05',
      rating: 5,
      review: 'Radiohead的传世之作，超前于时代。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: '艾尔登法环',
      type: 'game',
      date: '2025-12-30',
      rating: 5,
      review: '魂系游戏集大成之作，交界地的探索欲罢不能。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: '小王子',
      type: 'book',
      date: '2026-06-01',
      rating: 4,
      review: '写给大人的童话，每次阅读都有新感悟。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
    {
      id: generateId(),
      name: '星际穿越',
      type: 'movie',
      date: '2026-02-14',
      rating: 5,
      review: '爱与时间的终极命题，汉斯·季默的配乐封神。',
      createdAt: iso(now),
      updatedAt: iso(now),
    },
  ];

  saveEntries(mock);
  return mock;
}

function getWishlistMockData(): WishlistItem[] {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();

  const mock: WishlistItem[] = [
    {
      id: generateId(),
      name: '奥本海默',
      type: 'movie',
      source: 'friend',
      note: '朋友说诺兰新片必看',
      createdAt: iso(now),
    },
    {
      id: generateId(),
      name: '人类简史',
      type: 'book',
      source: 'douban',
      note: '豆瓣 Top250 高分',
      createdAt: iso(new Date(now.getTime() - 86400000)),
    },
    {
      id: generateId(),
      name: '沙丘2',
      type: 'movie',
      source: 'bilibili',
      note: 'B站UP主推荐',
      createdAt: iso(new Date(now.getTime() - 2 * 86400000)),
    },
    {
      id: generateId(),
      name: '置身事内',
      type: 'book',
      source: 'wechat',
      note: '某公众号推荐的经济读物',
      createdAt: iso(new Date(now.getTime() - 3 * 86400000)),
    },
  ];

  saveWishlist(mock);
  return mock;
}
