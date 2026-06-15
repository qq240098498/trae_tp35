export type EntryType = 'movie' | 'book' | 'album' | 'game';

export type Rating = 1 | 2 | 3 | 4 | 5;

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

export interface FilterState {
  type: EntryType | 'all';
  year: number | 'all';
  sortBy: 'rating' | 'date';
  sortOrder: 'asc' | 'desc';
}

export const TYPE_LABELS: Record<EntryType, string> = {
  movie: '电影',
  book: '书籍',
  album: '专辑',
  game: '游戏',
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

export interface YearStats {
  year: number;
  total: number;
  avgRating: number;
  favoriteType: EntryType | null;
  byType: Record<EntryType, { count: number; avgRating: number }>;
  topEntries: Entry[];
}
