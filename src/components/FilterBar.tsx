import { Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useEntryStore } from '@/store/useEntryStore';
import { TYPE_LABELS } from '@/types';
import type { EntryType } from '@/types';

export default function FilterBar() {
  const { filters, setFilter, getYears } = useEntryStore();
  const years = getYears();

  const types: Array<EntryType | 'all'> = ['all', 'movie', 'book', 'album', 'game'];

  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-2 text-gray-300">
          <Filter size={18} className="text-primary-400" />
          <span className="text-sm font-medium">筛选</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value as EntryType | 'all')}
              className="input-field appearance-none pr-10 cursor-pointer min-w-[140px]"
            >
              {types.map((t) => (
                <option key={t} value={t} className="bg-surface-dark">
                  {t === 'all' ? '全部类型' : TYPE_LABELS[t]}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={String(filters.year)}
              onChange={(e) =>
                setFilter('year', e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="input-field appearance-none pr-10 cursor-pointer min-w-[140px]"
            >
              <option value="all" className="bg-surface-dark">
                全部年份
              </option>
              {years.map((y) => (
                <option key={y} value={y} className="bg-surface-dark">
                  {y} 年
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="h-6 w-px bg-primary-700/40 hidden lg:block" />

          <div className="flex items-center gap-2 text-gray-300">
            <ArrowUpDown size={18} className="text-primary-400" />
            <span className="text-sm font-medium">排序</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-surface-dark rounded-lg border border-primary-700/40">
            <button
              onClick={() => setFilter('sortBy', 'date')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filters.sortBy === 'date'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              按日期
            </button>
            <button
              onClick={() => setFilter('sortBy', 'rating')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filters.sortBy === 'rating'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              按评分
            </button>
            <div className="w-px h-5 bg-primary-700/40 mx-1" />
            <button
              onClick={() => setFilter('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
              title={filters.sortOrder === 'desc' ? '降序（点击切换升序）' : '升序（点击切换降序）'}
            >
              {filters.sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
