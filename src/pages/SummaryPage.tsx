import { useState } from 'react';
import {
  Star,
  TrendingUp,
  Heart,
  Film,
  BookOpen,
  Music2,
  Gamepad2,
  ChevronDown,
  Award,
} from 'lucide-react';
import { useEntryStore } from '@/store/useEntryStore';
import StarRating from '@/components/StarRating';
import type { EntryType } from '@/types';
import { TYPE_LABELS, TYPE_COLORS, TYPE_TEXT_COLORS, TYPE_BG_COLORS } from '@/types';

const TYPE_ICONS: Record<EntryType, typeof Film> = {
  movie: Film,
  book: BookOpen,
  album: Music2,
  game: Gamepad2,
};

export default function SummaryPage() {
  const { getAllYearsStats, getYears } = useEntryStore();
  const years = getYears();
  const allStats = getAllYearsStats();
  const currentYear = years[0] ?? new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(currentYear);

  const displayStats =
    selectedYear === 'all'
      ? allStats
      : allStats.filter((s) => s.year === selectedYear);

  return (
    <div className="relative z-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">年度总结</h2>
          <p className="text-gray-400 text-sm mt-1">回顾你的文化生活足迹</p>
        </div>

        <div className="relative">
          <select
            value={String(selectedYear)}
            onChange={(e) =>
              setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="input-field appearance-none pr-10 cursor-pointer min-w-[160px]"
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
      </div>

      {displayStats.length === 0 ? (
        <div className="card p-16 text-center">
          <Award size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">暂无数据</h3>
          <p className="text-gray-500">还没有记录，去存档列表添加一些吧！</p>
        </div>
      ) : (
        displayStats.map((stats) => (
          <div key={stats.year} className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-700/50" />
              <h3 className="font-display text-xl font-bold text-white">{stats.year} 年度报告</h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-700/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-6 bg-gradient-to-br from-primary-600/20 to-transparent">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/30 flex items-center justify-center">
                    <TrendingUp size={20} className="text-primary-300" />
                  </div>
                  <span className="text-gray-400 text-sm">总条目</span>
                </div>
                <p className="font-display text-4xl font-bold text-white">
                  {stats.total}
                  <span className="text-base font-normal text-gray-400 ml-2">部</span>
                </p>
              </div>

              <div className="card p-6 bg-gradient-to-br from-amber-500/15 to-transparent">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/25 flex items-center justify-center">
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                  </div>
                  <span className="text-gray-400 text-sm">平均评分</span>
                </div>
                <p className="font-display text-4xl font-bold text-white">
                  {stats.total > 0 ? stats.avgRating.toFixed(1) : '—'}
                  <span className="text-base font-normal text-gray-400 ml-2">/ 5.0</span>
                </p>
              </div>

              <div className="card p-6 bg-gradient-to-br from-rose-500/15 to-transparent">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/25 flex items-center justify-center">
                    <Heart size={20} className="text-rose-400" />
                  </div>
                  <span className="text-gray-400 text-sm">最喜爱类型</span>
                </div>
                {stats.favoriteType ? (
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = TYPE_ICONS[stats.favoriteType];
                      return (
                        <>
                          <span className={`text-2xl ${TYPE_TEXT_COLORS[stats.favoriteType]}`}>
                            <Icon size={28} />
                          </span>
                          <p className={`font-display text-2xl font-bold ${TYPE_TEXT_COLORS[stats.favoriteType]}`}>
                            {TYPE_LABELS[stats.favoriteType]}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="font-display text-2xl font-bold text-gray-500">—</p>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h4 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary-500 rounded-full" />
                分类统计
              </h4>
              <div className="space-y-4">
                {(Object.keys(stats.byType) as EntryType[]).map((t) => {
                  const data = stats.byType[t];
                  const Icon = TYPE_ICONS[t];
                  const maxCount = Math.max(
                    ...(Object.values(stats.byType).map((d) => d.count) as number[]),
                    1
                  );
                  const percent = (data.count / maxCount) * 100;
                  return (
                    <div key={t} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg ${TYPE_BG_COLORS[t]} flex items-center justify-center`}
                          >
                            <Icon size={16} className={TYPE_TEXT_COLORS[t]} />
                          </div>
                          <span className="font-medium text-gray-200">{TYPE_LABELS[t]}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            <span className="text-white font-semibold">{data.count}</span> 部
                          </span>
                          <span className="text-gray-400">
                            均分{' '}
                            <span className="text-amber-400 font-semibold">
                              {data.count > 0 ? data.avgRating.toFixed(1) : '—'}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
                        <div
                          className={`h-full ${TYPE_COLORS[t]} rounded-full transition-all duration-700`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stats.topEntries.length > 0 && (
              <div className="card p-6">
                <h4 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full" />
                  {stats.year} 年度最佳 TOP {stats.topEntries.length}
                </h4>
                <div className="space-y-3">
                  {stats.topEntries.map((entry, idx) => {
                    const Icon = TYPE_ICONS[entry.type];
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-light/50 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${TYPE_BG_COLORS[entry.type]} flex items-center justify-center font-bold text-sm ${TYPE_TEXT_COLORS[entry.type]}`}
                        >
                          {idx + 1}
                        </div>
                        <div className={`flex-shrink-0 ${TYPE_TEXT_COLORS[entry.type]}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{entry.name}</p>
                          <p className="text-xs text-gray-500">{TYPE_LABELS[entry.type]}</p>
                        </div>
                        <StarRating value={entry.rating} readOnly size={16} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
