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
  tags: string[];
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
  tag: string | 'all';
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

export const PRESET_TAGS = [
  '治愈系',
  '烧脑',
  '催泪',
  '适合通勤听',
  '深夜必看',
  '轻松搞笑',
  '悬疑推理',
  '科幻',
  '爱情',
  '纪录片',
];

export interface YearStats {
  year: number;
  total: number;
  avgRating: number;
  favoriteType: EntryType | null;
  byType: Record<EntryType, { count: number; avgRating: number }>;
  topEntries: Entry[];
}

export type LendItemType = 'book' | 'disc' | 'other';
export type RecordType = 'lend' | 'recommend';
export type FeedbackStatus = 'pending' | 'liked' | 'disliked' | 'neutral';

export interface LendRecord {
  id: string;
  type: 'lend';
  itemName: string;
  itemType: LendItemType;
  borrower: string;
  lendDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  entryId?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendRecord {
  id: string;
  type: 'recommend';
  itemName: string;
  itemType: EntryType;
  recommendTo: string;
  recommendDate: string;
  feedback: FeedbackStatus;
  feedbackNote?: string;
  entryId?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type LendRecommendRecord = LendRecord | RecommendRecord;

export interface LendFilterState {
  recordType: RecordType | 'all';
  itemType: LendItemType | EntryType | 'all';
  status: 'active' | 'returned' | 'all';
  sortBy: 'lendDate' | 'recommendDate' | 'expectedReturnDate' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export const LEND_ITEM_TYPE_LABELS: Record<LendItemType, string> = {
  book: '书籍',
  disc: '光盘',
  other: '其他',
};

export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  lend: '借出',
  recommend: '推荐',
};

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  pending: '待反馈',
  liked: '喜欢',
  disliked: '不喜欢',
  neutral: '一般',
};

export const LEND_ITEM_TYPE_COLORS: Record<LendItemType, string> = {
  book: 'bg-accent-book',
  disc: 'bg-accent-album',
  other: 'bg-accent-game',
};

export const FEEDBACK_STATUS_COLORS: Record<FeedbackStatus, string> = {
  pending: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
  liked: 'text-green-400 bg-green-500/20 border-green-500/30',
  disliked: 'text-red-400 bg-red-500/20 border-red-500/30',
  neutral: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
};
