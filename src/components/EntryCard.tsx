import { Pencil, Trash2, Film, BookOpen, Music2, Gamepad2 } from 'lucide-react';
import StarRating from './StarRating';
import type { Entry } from '@/types';
import { TYPE_LABELS, TYPE_COLORS, TYPE_TEXT_COLORS, TYPE_BG_COLORS } from '@/types';

interface EntryCardProps {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
  index: number;
}

const TYPE_ICONS: Record<Entry['type'], typeof Film> = {
  movie: Film,
  book: BookOpen,
  album: Music2,
  game: Gamepad2,
};

export default function EntryCard({ entry, onEdit, onDelete, index }: EntryCardProps) {
  const Icon = TYPE_ICONS[entry.type];
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div
      className="card group overflow-hidden hover:border-primary-600/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-slide-up"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div className={`h-1.5 ${TYPE_COLORS[entry.type]}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-9 h-9 rounded-lg ${TYPE_BG_COLORS[entry.type]} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={18} className={TYPE_TEXT_COLORS[entry.type]} />
            </div>
            <div className="min-w-0">
              <h3
                className={`font-display font-semibold text-lg text-white truncate ${TYPE_TEXT_COLORS[entry.type]}`}
              >
                {entry.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${TYPE_BG_COLORS[entry.type]} ${TYPE_TEXT_COLORS[entry.type]}`}
                >
                  {TYPE_LABELS[entry.type]}
                </span>
                <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(entry)}
              className="p-1.5 rounded-lg hover:bg-surface-light text-gray-400 hover:text-white transition-colors"
              aria-label="编辑"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              aria-label="删除"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <StarRating value={entry.rating} readOnly size={16} />
        </div>

        {entry.review && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">{entry.review}</p>
        )}
      </div>
    </div>
  );
}
