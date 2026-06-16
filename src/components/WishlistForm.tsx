import { useState, useEffect, useRef } from 'react';
import { Film, BookOpen, Plus, X } from 'lucide-react';
import type { WishlistItem, WishlistType, RecommendSource } from '@/types';
import { WISHLIST_TYPE_LABELS, SOURCE_LABELS, SOURCE_ICONS, PRESET_TAGS } from '@/types';

interface WishlistFormProps {
  item?: WishlistItem | null;
  onSubmit: (data: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const TYPE_ICONS: Record<WishlistType, typeof Film> = {
  movie: Film,
  book: BookOpen,
};

const MAX_TAGS = 10;

export default function WishlistForm({ item, onSubmit, onCancel }: WishlistFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<WishlistType>('movie');
  const [source, setSource] = useState<RecommendSource>('friend');
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setType(item.type);
      setSource(item.source);
      setNote(item.note || '');
      setTags(item.tags || []);
    } else {
      setName('');
      setType('movie');
      setSource('friend');
      setNote('');
      setTags([]);
    }
    setError('');
    setTagInput('');
  }, [item]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < MAX_TAGS) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
    tagInputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('请输入名称');
      return;
    }
    onSubmit({
      name: name.trim(),
      type,
      source,
      note: note.trim() || undefined,
      tags,
    });
  };

  const sourceOptions: RecommendSource[] = [
    'friend',
    'douban',
    'wechat',
    'weibo',
    'zhihu',
    'bilibili',
    'podcast',
    'other',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">名称 *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          placeholder="例如：奥本海默"
          autoFocus
        />
      </div>

      <div>
        <label className="label">类型 *</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(WISHLIST_TYPE_LABELS) as WishlistType[]).map((t) => {
            const Icon = TYPE_ICONS[t];
            const active = type === t;
            const colorClass =
              t === 'movie'
                ? 'border-accent-movie bg-accent-movie/15 text-accent-movie'
                : 'border-accent-book bg-accent-book/15 text-accent-book';
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl border-2 transition-all duration-200 ${
                  active
                    ? colorClass
                    : 'border-primary-800/40 text-gray-400 hover:border-primary-600/60 hover:text-gray-200'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{WISHLIST_TYPE_LABELS[t]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="label">推荐来源 *</label>
        <div className="grid grid-cols-4 gap-2">
          {sourceOptions.map((s) => {
            const active = source === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSource(s)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1.5 rounded-xl border-2 transition-all duration-200 ${
                  active
                    ? 'border-primary-500 bg-primary-500/15 text-primary-300'
                    : 'border-primary-800/40 text-gray-400 hover:border-primary-600/60 hover:text-gray-200'
                }`}
                title={SOURCE_LABELS[s]}
              >
                <span className="text-lg">{SOURCE_ICONS[s]}</span>
                <span className="text-xs font-medium">{SOURCE_LABELS[s]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">标签（可选）</label>
          <span className={`text-xs ${tags.length >= MAX_TAGS ? 'text-amber-400' : 'text-gray-500'}`}>
            {tags.length}/{MAX_TAGS}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-300 text-sm border border-primary-500/30"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <input
            ref={tagInputRef}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            disabled={tags.length >= MAX_TAGS}
            className="input-field flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={tags.length >= MAX_TAGS ? '已达标签数量上限' : '输入标签后按回车添加'}
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            disabled={tags.length >= MAX_TAGS}
            className="btn btn-secondary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
        </div>
        {tags.length < MAX_TAGS && (
          <div>
            <p className="text-xs text-gray-500 mb-2">常用标签：</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.filter((t) => !tags.includes(t)).slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-2.5 py-1 rounded-full text-xs bg-surface-dark text-gray-400 border border-primary-800/40 hover:border-primary-500/50 hover:text-gray-200 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="label">备注（可选）</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field min-h-[80px] resize-y"
          placeholder="写下添加的原因..."
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
          {item ? '保存修改' : '添加到待看'}
        </button>
      </div>
    </form>
  );
}
