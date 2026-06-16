import { useState, useMemo } from 'react';
import { Search, X, Film, BookOpen, Music2, Gamepad2, Check, Plus } from 'lucide-react';
import Modal from './Modal';
import StarRating from './StarRating';
import { useEntryStore } from '@/store/useEntryStore';
import type { Entry, EntryType } from '@/types';
import { TYPE_LABELS, TYPE_COLORS, TYPE_BG_COLORS, TYPE_TEXT_COLORS } from '@/types';

interface EntrySelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (entry: Entry) => void;
  allowedTypes?: EntryType[];
  excludeIds?: string[];
}

const TYPE_ICONS: Record<EntryType, typeof Film> = {
  movie: Film,
  book: BookOpen,
  album: Music2,
  game: Gamepad2,
};

export default function EntrySelector({
  open,
  onClose,
  onSelect,
  allowedTypes,
  excludeIds = [],
}: EntrySelectorProps) {
  const entries = useEntryStore((s) => s.entries);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EntryType | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => !excludeIds.includes(e.id))
      .filter((e) => {
        if (allowedTypes && !allowedTypes.includes(e.type)) return false;
        if (typeFilter !== 'all' && e.type !== typeFilter) return false;
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            e.name.toLowerCase().includes(query) ||
            (e.review && e.review.toLowerCase().includes(query))
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, searchQuery, typeFilter, allowedTypes, excludeIds]);

  const handleSelect = (entry: Entry) => {
    setSelectedId(entry.id);
  };

  const handleConfirm = () => {
    const selected = entries.find((e) => e.id === selectedId);
    if (selected) {
      onSelect(selected);
      onClose();
      setSearchQuery('');
      setTypeFilter('all');
      setSelectedId(null);
    }
  };

  const typeOptions: Array<EntryType | 'all'> = allowedTypes
    ? ['all', ...allowedTypes]
    : ['all', 'movie', 'book', 'album', 'game'];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="从存档中选择"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索存档条目..."
              className="input-field pl-10"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as EntryType | 'all')}
            className="input-field min-w-[120px] appearance-none cursor-pointer"
          >
            {typeOptions.map((t) => (
              <option key={t} value={t} className="bg-surface-dark">
                {t === 'all' ? '全部类型' : TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <Film size={40} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400">
                {searchQuery || typeFilter !== 'all'
                  ? '没有找到匹配的存档条目'
                  : '暂无存档条目'}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const Icon = TYPE_ICONS[entry.type];
              const isSelected = selectedId === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => handleSelect(entry)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500/15'
                      : 'border-primary-800/40 hover:border-primary-600/60 bg-surface-dark/50 hover:bg-surface-dark'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${TYPE_BG_COLORS[entry.type]} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={18} className={TYPE_TEXT_COLORS[entry.type]} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-medium text-white truncate ${TYPE_TEXT_COLORS[entry.type]}`}
                      >
                        {entry.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${TYPE_BG_COLORS[entry.type]} ${TYPE_TEXT_COLORS[entry.type]}`}
                      >
                        {TYPE_LABELS[entry.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={entry.rating} readOnly size={12} />
                      <span className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    {entry.review && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        {entry.review}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-light text-transparent'
                    }`}
                  >
                    <Check size={14} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-primary-700/40">
          <p className="text-xs text-gray-500">
            共 {filteredEntries.length} 条记录
            {selectedId && <span className="text-primary-400 ml-2">已选择 1 条</span>}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedId}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
