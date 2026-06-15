import { Pencil, Trash2, Film, BookOpen, Check } from 'lucide-react';
import type { WishlistItem } from '@/types';
import {
  WISHLIST_TYPE_LABELS,
  TYPE_COLORS,
  TYPE_TEXT_COLORS,
  TYPE_BG_COLORS,
  SOURCE_LABELS,
  SOURCE_ICONS,
} from '@/types';

interface WishlistCardProps {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
  onDelete: (id: string) => void;
  onComplete: (item: WishlistItem) => void;
  onTagClick?: (tag: string) => void;
  index: number;
}

const TYPE_ICONS: Record<WishlistItem['type'], typeof Film> = {
  movie: Film,
  book: BookOpen,
};

export default function WishlistCard({
  item,
  onEdit,
  onDelete,
  onComplete,
  onTagClick,
  index,
}: WishlistCardProps) {
  const Icon = TYPE_ICONS[item.type];
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div
      className="card group overflow-hidden hover:border-primary-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-slide-up"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className={`h-1.5 ${TYPE_COLORS[item.type]}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg ${TYPE_BG_COLORS[item.type]} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={18} className={TYPE_TEXT_COLORS[item.type]} />
            </div>
            <div className="min-w-0">
              <h3
                className={`font-display font-semibold text-lg text-white truncate ${TYPE_TEXT_COLORS[item.type]}`}
              >
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${TYPE_BG_COLORS[item.type]} ${TYPE_TEXT_COLORS[item.type]}`}
                >
                  {WISHLIST_TYPE_LABELS[item.type]}
                </span>
                <span className="text-xs text-gray-400">
                  添加于 {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onComplete(item)}
              className="p-1.5 rounded-lg hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-colors"
              aria-label="标记为已完成"
              title="标记为已完成并移至存档"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg hover:bg-surface-light text-gray-400 hover:text-white transition-colors"
              aria-label="编辑"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              aria-label="删除"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-primary-700/30 text-primary-300 border border-primary-700/40">
            <span>{SOURCE_ICONS[item.source]}</span>
            <span>{SOURCE_LABELS[item.source]}</span>
          </span>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="text-xs px-2 py-0.5 rounded-full bg-surface-dark text-gray-300 border border-primary-800/40 hover:border-primary-500/50 hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {item.note && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{item.note}</p>
        )}
      </div>
    </div>
  );
}
