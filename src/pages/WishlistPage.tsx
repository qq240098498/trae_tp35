import { useState } from 'react';
import { Inbox, Plus, Filter, ChevronDown, Film, BookOpen } from 'lucide-react';
import WishlistCard from '@/components/WishlistCard';
import Modal from '@/components/Modal';
import WishlistForm from '@/components/WishlistForm';
import EntryForm from '@/components/EntryForm';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useEntryStore } from '@/store/useEntryStore';
import type { WishlistItem, WishlistType, RecommendSource } from '@/types';
import { WISHLIST_TYPE_LABELS, SOURCE_LABELS } from '@/types';

interface WishlistPageProps {
  formOpen: boolean;
  setFormOpen: (o: boolean) => void;
}

export default function WishlistPage({ formOpen, setFormOpen }: WishlistPageProps) {
  const { getFilteredItems, addItem, updateItem, deleteItem, setFilter, filters, markAsCompleted, getCount } =
    useWishlistStore();
  const { addEntry } = useEntryStore();
  const [editingItem, setEditingItem] = useState<WishlistItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [completingItem, setCompletingItem] = useState<WishlistItem | null>(null);

  const items = getFilteredItems();
  const totalCount = getCount();
  const movieCount = items.filter((i) => i.type === 'movie').length;
  const bookCount = items.filter((i) => i.type === 'book').length;

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: WishlistItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<WishlistItem, 'id' | 'createdAt'>) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
    } else {
      addItem(data);
    }
    setFormOpen(false);
    setEditingItem(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteItem(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleComplete = (item: WishlistItem) => {
    setCompletingItem(item);
  };

  const typeOptions: Array<WishlistType | 'all'> = ['all', 'movie', 'book'];
  const sourceOptions: Array<RecommendSource | 'all'> = [
    'all',
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
    <div className="relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <Plus size={24} className="text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">待看总数</p>
              <p className="text-2xl font-bold text-white font-display">{totalCount}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-movie/20 flex items-center justify-center">
              <Film size={24} className="text-accent-movie" />
            </div>
            <div>
              <p className="text-sm text-gray-400">想看电影</p>
              <p className="text-2xl font-bold text-accent-movie font-display">{movieCount}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-book/20 flex items-center justify-center">
              <BookOpen size={24} className="text-accent-book" />
            </div>
            <div>
              <p className="text-sm text-gray-400">想读书籍</p>
              <p className="text-2xl font-bold text-accent-book font-display">{bookCount}</p>
            </div>
          </div>
        </div>
      </div>

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
                onChange={(e) => setFilter('type', e.target.value as WishlistType | 'all')}
                className="input-field appearance-none pr-10 cursor-pointer min-w-[140px]"
              >
                {typeOptions.map((t) => (
                  <option key={t} value={t} className="bg-surface-dark">
                    {t === 'all' ? '全部类型' : WISHLIST_TYPE_LABELS[t]}
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
                value={filters.source}
                onChange={(e) => setFilter('source', e.target.value as RecommendSource | 'all')}
                className="input-field appearance-none pr-10 cursor-pointer min-w-[140px]"
              >
                {sourceOptions.map((s) => (
                  <option key={s} value={s} className="bg-surface-dark">
                    {s === 'all' ? '全部来源' : SOURCE_LABELS[s]}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="h-6 w-px bg-primary-700/40 hidden lg:block" />

            <div className="flex items-center gap-1 p-1 bg-surface-dark rounded-lg border border-primary-700/40">
              <button
                onClick={() => setFilter('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                title={filters.sortOrder === 'desc' ? '最新优先（点击切换最早优先）' : '最早优先（点击切换最新优先）'}
              >
                {filters.sortOrder === 'desc' ? '最新添加 ↓' : '最早添加 ↑'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-16 text-center">
          <Inbox size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">待看清单空空如也</h3>
          <p className="text-gray-500 mb-6">
            {useWishlistStore.getState().items.length === 0
              ? '点击右上角「添加待看」开始收集你想看的内容'
              : '当前筛选条件下没有匹配的条目'}
          </p>
          {useWishlistStore.getState().items.length === 0 && (
            <button onClick={handleOpenAdd} className="btn btn-primary">
              添加第一条待看
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((item, idx) => (
            <WishlistCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComplete={handleComplete}
              index={idx}
            />
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={handleFormClose}
        title={editingItem ? '编辑待看' : '添加到待看清单'}
      >
        <WishlistForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      </Modal>

      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="确认删除"
        maxWidth="max-w-sm"
      >
        <p className="text-gray-300 mb-6">确定要从待看清单中删除吗？此操作无法撤销。</p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteConfirmId(null)}
            className="btn btn-secondary"
          >
            取消
          </button>
          <button type="button" onClick={confirmDelete} className="btn bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 hover:shadow-red-500/40">
            删除
          </button>
        </div>
      </Modal>

      <Modal
        open={!!completingItem}
        onClose={() => setCompletingItem(null)}
        title="标记为已完成"
        maxWidth="max-w-lg"
      >
        {completingItem && (
          <EntryForm
            presetName={completingItem.name}
            presetType={completingItem.type}
            onSubmit={(data) => {
              addEntry(data);
              markAsCompleted(completingItem.id);
              setCompletingItem(null);
            }}
            onCancel={() => setCompletingItem(null)}
          />
        )}
      </Modal>
    </div>
  );
}
