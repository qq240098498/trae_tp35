import { useState, useEffect } from 'react';
import { Film, BookOpen, Music2, Gamepad2 } from 'lucide-react';
import StarRating from './StarRating';
import type { Entry, EntryType, Rating } from '@/types';
import { TYPE_LABELS } from '@/types';

interface EntryFormProps {
  entry?: Entry | null;
  onSubmit: (data: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const TYPE_ICONS: Record<EntryType, typeof Film> = {
  movie: Film,
  book: BookOpen,
  album: Music2,
  game: Gamepad2,
};

export default function EntryForm({ entry, onSubmit, onCancel }: EntryFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<EntryType>('movie');
  const [date, setDate] = useState('');
  const [rating, setRating] = useState<Rating>(4);
  const [review, setReview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (entry) {
      setName(entry.name);
      setType(entry.type);
      setDate(entry.date);
      setRating(entry.rating);
      setReview(entry.review || '');
    } else {
      setName('');
      setType('movie');
      setDate(new Date().toISOString().slice(0, 10));
      setRating(4);
      setReview('');
    }
    setError('');
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('请输入名称');
      return;
    }
    if (!date) {
      setError('请选择日期');
      return;
    }
    onSubmit({
      name: name.trim(),
      type,
      date,
      rating,
      review: review.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">名称 *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          placeholder="例如：盗梦空间"
          autoFocus
        />
      </div>

      <div>
        <label className="label">类型 *</label>
        <div className="grid grid-cols-4 gap-2">
          {(Object.keys(TYPE_LABELS) as EntryType[]).map((t) => {
            const Icon = TYPE_ICONS[t];
            const active = type === t;
            const colorClass =
              t === 'movie'
                ? 'border-accent-movie bg-accent-movie/15 text-accent-movie'
                : t === 'book'
                ? 'border-accent-book bg-accent-book/15 text-accent-book'
                : t === 'album'
                ? 'border-accent-album bg-accent-album/15 text-accent-album'
                : 'border-accent-game bg-accent-game/15 text-accent-game';
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all duration-200 ${
                  active
                    ? colorClass
                    : 'border-primary-800/40 text-gray-400 hover:border-primary-600/60 hover:text-gray-200'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs font-medium">{TYPE_LABELS[t]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">日期 *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label">评分</label>
          <div className="h-[42px] flex items-center">
            <StarRating value={rating} onChange={setRating} size={24} />
          </div>
        </div>
      </div>

      <div>
        <label className="label">简评（可选）</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="input-field min-h-[90px] resize-y"
          placeholder="写下你的感受..."
          rows={3}
        />
      </div>

      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          取消
        </button>
        <button type="submit" className="btn btn-primary">
          {entry ? '保存修改' : '添加条目'}
        </button>
      </div>
    </form>
  );
}
