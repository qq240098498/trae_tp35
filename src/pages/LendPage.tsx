import { useState, useMemo } from 'react';
import { Inbox, Filter, ArrowUpDown, ChevronDown, HandHeart, Share2, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import LendCard from '@/components/LendCard';
import Modal from '@/components/Modal';
import LendForm from '@/components/LendForm';
import { useLendStore } from '@/store/useLendStore';
import type { LendRecord, RecommendRecord, RecordType, FeedbackStatus, LendFilterState } from '@/types';
import { RECORD_TYPE_LABELS, LEND_ITEM_TYPE_LABELS, TYPE_LABELS } from '@/types';

interface LendPageProps {
  formOpen: boolean;
  setFormOpen: (o: boolean) => void;
}

export default function LendPage({ formOpen, setFormOpen }: LendPageProps) {
  const {
    getFilteredRecords,
    addLendRecord,
    addRecommendRecord,
    updateRecord,
    deleteRecord,
    markAsReturned,
    updateFeedback,
    getOverdueRecords,
    getActiveLendCount,
    getPendingFeedbackCount,
    records,
    filters,
    setFilter,
  } = useLendStore();

  const [editingRecord, setEditingRecord] = useState<LendRecord | RecommendRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredRecords = getFilteredRecords();
  const overdueRecords = getOverdueRecords();
  const activeLendCount = getActiveLendCount();
  const pendingFeedbackCount = getPendingFeedbackCount();

  const stats = useMemo(() => {
    const totalLend = records.filter((r) => r.type === 'lend').length;
    const totalRecommend = records.filter((r) => r.type === 'recommend').length;
    const returnedCount = records.filter((r) => r.type === 'lend' && r.actualReturnDate).length;
    return { totalLend, totalRecommend, returnedCount };
  }, [records]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleEdit = (record: LendRecord | RecommendRecord) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, data);
    } else if (data.borrower !== undefined) {
      addLendRecord(data);
    } else {
      addRecommendRecord(data);
    }
    setFormOpen(false);
    setEditingRecord(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteRecord(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleMarkReturned = (id: string) => {
    markAsReturned(id);
  };

  const handleUpdateFeedback = (id: string, feedback: FeedbackStatus, feedbackNote?: string) => {
    updateFeedback(id, feedback, feedbackNote);
  };

  const recordTypeOptions: Array<RecordType | 'all'> = ['all', 'lend', 'recommend'];
  const lendItemTypeOptions: Array<LendFilterState['itemType']> = ['all', 'book', 'disc', 'other', 'movie', 'album', 'game'];
  const statusOptions: Array<LendFilterState['status']> = ['all', 'active', 'returned'];
  const sortByOptions: Array<LendFilterState['sortBy']> = ['createdAt', 'lendDate', 'recommendDate', 'expectedReturnDate'];

  const getItemTypeLabel = (type: LendFilterState['itemType']) => {
    if (type === 'all') return '全部类型';
    if (type === 'book' || type === 'disc' || type === 'other') {
      return LEND_ITEM_TYPE_LABELS[type as keyof typeof LEND_ITEM_TYPE_LABELS];
    }
    return TYPE_LABELS[type as keyof typeof TYPE_LABELS];
  };

  const getSortByLabel = (sortBy: LendFilterState['sortBy']) => {
    const labels: Record<LendFilterState['sortBy'], string> = {
      createdAt: '创建时间',
      lendDate: '借出日期',
      recommendDate: '推荐日期',
      expectedReturnDate: '预计归还日期',
    };
    return labels[sortBy];
  };

  return (
    <div className="relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-book/20 flex items-center justify-center">
              <HandHeart size={20} className="text-accent-book" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalLend}</p>
              <p className="text-xs text-gray-400">总借出记录</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-movie/20 flex items-center justify-center">
              <Share2 size={20} className="text-accent-movie" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalRecommend}</p>
              <p className="text-xs text-gray-400">总推荐记录</p>
            </div>
          </div>
        </div>
        <div className={`card p-4 ${overdueRecords.length > 0 ? 'ring-1 ring-red-500/30' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              overdueRecords.length > 0 ? 'bg-red-500/20' : 'bg-green-500/20'
            }`}>
              <AlertTriangle size={20} className={`${overdueRecords.length > 0 ? 'text-red-400' : 'text-green-400'}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${overdueRecords.length > 0 ? 'text-red-400' : 'text-white'}`}>
                {overdueRecords.length}
              </p>
              <p className="text-xs text-gray-400">逾期未还</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Clock size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingFeedbackCount}</p>
              <p className="text-xs text-gray-400">待反馈推荐</p>
            </div>
          </div>
        </div>
      </div>

      {overdueRecords.length > 0 && (
        <div className="card p-4 mb-6 bg-red-500/10 border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-300 mb-2">有 {overdueRecords.length} 件物品已逾期未还，请及时催还：</h3>
              <div className="flex flex-wrap gap-2">
                {overdueRecords.slice(0, 5).map((record) => (
                  <span
                    key={record.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-sm"
                  >
                    <span className="font-medium">{record.itemName}</span>
                    <span className="text-red-400/70">→ {record.borrower}</span>
                  </span>
                ))}
                {overdueRecords.length > 5 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
                    还有 {overdueRecords.length - 5} 件...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Filter size={18} className="text-primary-400" />
            <span className="text-sm font-medium">筛选</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={filters.recordType}
                onChange={(e) => setFilter('recordType', e.target.value as RecordType | 'all')}
                className="input-field appearance-none pr-10 cursor-pointer min-w-[120px]"
              >
                {recordTypeOptions.map((t) => (
                  <option key={t} value={t} className="bg-surface-dark">
                    {t === 'all' ? '全部记录' : RECORD_TYPE_LABELS[t]}
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
                value={filters.itemType}
                onChange={(e) => setFilter('itemType', e.target.value as LendFilterState['itemType'])}
                className="input-field appearance-none pr-10 cursor-pointer min-w-[120px]"
              >
                {lendItemTypeOptions.map((t) => (
                  <option key={t} value={t} className="bg-surface-dark">
                    {getItemTypeLabel(t)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {filters.recordType !== 'recommend' && (
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilter('status', e.target.value as LendFilterState['status'])}
                  className="input-field appearance-none pr-10 cursor-pointer min-w-[120px]"
                >
                  <option value="all" className="bg-surface-dark">
                    全部状态
                  </option>
                  <option value="active" className="bg-surface-dark">
                    借出中
                  </option>
                  <option value="returned" className="bg-surface-dark">
                    已归还
                  </option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            )}

            <div className="h-6 w-px bg-primary-700/40 hidden lg:block" />

            <div className="flex items-center gap-2 text-gray-300">
              <ArrowUpDown size={18} className="text-primary-400" />
              <span className="text-sm font-medium">排序</span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-surface-dark rounded-lg border border-primary-700/40">
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilter('sortBy', e.target.value as LendFilterState['sortBy'])}
                  className="input-field appearance-none pr-8 cursor-pointer min-w-[120px] py-1.5 text-sm"
                >
                  {sortByOptions.map((s) => (
                    <option key={s} value={s} className="bg-surface-dark">
                      {getSortByLabel(s)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
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

      {filteredRecords.length === 0 ? (
        <div className="card p-16 text-center">
          <Inbox size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">暂无记录</h3>
          <p className="text-gray-500 mb-6">
            {records.length === 0
              ? '点击右上角「添加条目」开始记录借出和推荐历史'
              : '当前筛选条件下没有匹配的记录'}
          </p>
          {records.length === 0 && (
            <button onClick={handleOpenAdd} className="btn btn-primary">
              添加第一条记录
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredRecords.map((record, idx) => (
            <LendCard
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkReturned={handleMarkReturned}
              onUpdateFeedback={handleUpdateFeedback}
              index={idx}
            />
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={handleFormClose}
        title={editingRecord ? '编辑记录' : '添加新记录'}
      >
        <LendForm
          record={editingRecord}
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
        <p className="text-gray-300 mb-6">确定要删除这条记录吗？此操作无法撤销。</p>
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
    </div>
  );
}
