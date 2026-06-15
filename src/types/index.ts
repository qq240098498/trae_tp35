export type EntryType = 'movie' | 'book' | 'album' | 'game';

export type WishlistType = 'movie' | 'book';

export type Rating = 1 | 2 | 3 | 4 | 5;

export type RecommendSource =
  | 'friend'
  | 'douban'
  | 'wechat'
  | 'weibo'
  | 'zhihu'
  | 'bilibili'
  | 'podcast'
  | 'other';

export interface Entry {
  id: string;
  name: string;
  type: EntryType;
  date: string;
  rating: Rating;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  type: WishlistType;
  source: RecommendSource;
  note?: string;
  createdAt: string;
}

export interface FilterState {
  type: EntryType | 'all';
  year: number | 'all';
  sortBy: 'rating' | 'date';
  sortOrder: 'asc' | 'desc';
}

export interface WishlistFilterState {
  type: WishlistType | 'all';
  source: RecommendSource | 'all';
  sortBy: 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export const TYPE_LABELS: Record<EntryType, string> = {
  movie: '电影',
  book: '书籍',
  album: '专辑',
  game: '游戏',
};

export const WISHLIST_TYPE_LABELS: Record<WishlistType, string> = {
  movie: '想看电影',
  book: '想读书籍',
};

export const TYPE_COLORS: Record<EntryType, string> = {
  movie: 'bg-accent-movie',
  book: 'bg-accent-book',
  album: 'bg-accent-album',
  game: 'bg-accent-game',
};

export const TYPE_TEXT_COLORS: Record<EntryType, string> = {
  movie: 'text-accent-movie',
  book: 'text-accent-book',
  album: 'text-accent-album',
  game: 'text-accent-game',
};

export const TYPE_BG_COLORS: Record<EntryType, string> = {
  movie: 'bg-accent-movie/15',
  book: 'bg-accent-book/15',
  album: 'bg-accent-album/15',
  game: 'bg-accent-game/15',
};

export const SOURCE_LABELS: Record<RecommendSource, string> = {
  friend: '朋友推荐',
  douban: '豆瓣高分',
  wechat: '公众号',
  weibo: '微博',
  zhihu: '知乎',
  bilibili: 'B站',
  podcast: '播客',
  other: '其他',
};

export const SOURCE_ICONS: Record<RecommendSource, string> = {
  friend: '👥',
  douban: '⭐',
  wechat: '💬',
  weibo: '🌐',
  zhihu: '💡',
  bilibili: '📺',
  podcast: '🎧',
  other: '📝',
};

export interface YearStats {
  year: number;
  total: number;
  avgRating: number;
  favoriteType: EntryType | null;
  byType: Record<EntryType, { count: number; avgRating: number }>;
  topEntries: Entry[];
}
