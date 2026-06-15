import { useState } from 'react';
import { Inbox } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import EntryCard from '@/components/EntryCard';
import Modal from '@/components/Modal';
import EntryForm from '@/components/EntryForm';
import { useEntryStore } from '@/store/useEntryStore';
import type { Entry } from '@/types';

interface ArchivePageProps {
  formOpen: boolean;
  setFormOpen: (o: boolean) => void;
}

export default function ArchivePage({ formOpen, setFormOpen }: ArchivePageProps) {
  const { getFilteredEntries, addEntry, updateEntry, deleteEntry } = useEntryStore();
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const entries = getFilteredEntries();

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormOpen(true);
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, data);
    } else {
      addEntry(data);
    }
    setFormOpen(false);
    setEditingEntry(null);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteEntry(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="relative z-10">
      <FilterBar />

      {entries.length === 0 ? (
        <div className="card p-16 text-center">
          <Inbox size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">暂无存档</h3>
          <p className="text-gray-500 mb-6">
            {useEntryStore.getState().entries.length === 0
              ? '点击右上角「添加条目」开始记录你的文化生活'
              : '当前筛选条件下没有匹配的条目'}
          </p>
          {useEntryStore.getState().entries.length === 0 && (
            <button onClick={handleOpenAdd} className="btn btn-primary">
              添加第一条记录
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {entries.map((entry, idx) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={handleDelete}
              index={idx}
            />
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={handleFormClose}
        title={editingEntry ? '编辑条目' : '添加新条目'}
      >
        <EntryForm
          entry={editingEntry}
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
