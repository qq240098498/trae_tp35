import { create } from 'zustand';
import type {
  LendRecommendRecord,
  LendRecord,
  RecommendRecord,
  LendFilterState,
  RecordType,
  FeedbackStatus,
  LendItemType,
  EntryType,
} from '@/types';
import { loadLendRecords, saveLendRecords, generateId } from '@/utils/storage';

interface LendStore {
  records: LendRecommendRecord[];
  filters: LendFilterState;
  addLendRecord: (data: Omit<LendRecord, 'id' | 'type' | 'createdAt' | 'updatedAt'>) => void;
  addRecommendRecord: (data: Omit<RecommendRecord, 'id' | 'type' | 'createdAt' | 'updatedAt'>) => void;
  updateRecord: (id: string, data: Partial<Omit<LendRecord, 'id' | 'type' | 'createdAt'>> | Partial<Omit<RecommendRecord, 'id' | 'type' | 'createdAt'>>) => void;
  deleteRecord: (id: string) => void;
  markAsReturned: (id: string) => void;
  updateFeedback: (id: string, feedback: FeedbackStatus, feedbackNote?: string) => void;
  setFilter: <K extends keyof LendFilterState>(key: K, value: LendFilterState[K]) => void;
  getFilteredRecords: () => LendRecommendRecord[];
  getOverdueRecords: () => LendRecord[];
  getActiveLendCount: () => number;
  getPendingFeedbackCount: () => number;
}

function isOverdue(record: LendRecord): boolean {
  if (record.actualReturnDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expected = new Date(record.expectedReturnDate);
  expected.setHours(0, 0, 0, 0);
  return expected.getTime() < today.getTime();
}

export const useLendStore = create<LendStore>((set, get) => ({
  records: loadLendRecords(),
  filters: {
    recordType: 'all',
    itemType: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },

  addLendRecord: (data) => {
    const now = new Date().toISOString();
    const record: LendRecord = {
      ...data,
      id: generateId(),
      type: 'lend',
      createdAt: now,
      updatedAt: now,
    };
    const records = [record, ...get().records];
    saveLendRecords(records);
    set({ records });
  },

  addRecommendRecord: (data) => {
    const now = new Date().toISOString();
    const record: RecommendRecord = {
      ...data,
      id: generateId(),
      type: 'recommend',
      createdAt: now,
      updatedAt: now,
    };
    const records = [record, ...get().records];
    saveLendRecords(records);
    set({ records });
  },

  updateRecord: (id, data) => {
    const records = get().records.map((r) =>
      r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } as LendRecommendRecord : r
    );
    saveLendRecords(records);
    set({ records });
  },

  deleteRecord: (id) => {
    const records = get().records.filter((r) => r.id !== id);
    saveLendRecords(records);
    set({ records });
  },

  markAsReturned: (id) => {
    const records = get().records.map((r) =>
      r.id === id && r.type === 'lend'
        ? {
            ...r,
            actualReturnDate: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
          }
        : r
    );
    saveLendRecords(records);
    set({ records });
  },

  updateFeedback: (id, feedback, feedbackNote) => {
    const records = get().records.map((r) =>
      r.id === id && r.type === 'recommend'
        ? {
            ...r,
            feedback,
            feedbackNote: feedbackNote || r.feedbackNote,
            updatedAt: new Date().toISOString(),
          }
        : r
    );
    saveLendRecords(records);
    set({ records });
  },

  setFilter: (key, value) => {
    set({ filters: { ...get().filters, [key]: value } });
  },

  getFilteredRecords: () => {
    const { records, filters } = get();
    let result = [...records];

    if (filters.recordType !== 'all') {
      result = result.filter((r) => r.type === filters.recordType);
    }

    if (filters.itemType !== 'all') {
      result = result.filter((r) => r.itemType === filters.itemType);
    }

    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        result = result.filter((r) => r.type === 'lend' && !r.actualReturnDate);
      } else if (filters.status === 'returned') {
        result = result.filter((r) => r.type === 'lend' && r.actualReturnDate);
      }
    }

    result.sort((a, b) => {
      let diff = 0;
      const getDateField = (r: LendRecommendRecord) => {
        switch (filters.sortBy) {
          case 'lendDate':
            return r.type === 'lend' ? r.lendDate : r.createdAt;
          case 'recommendDate':
            return r.type === 'recommend' ? r.recommendDate : r.createdAt;
          case 'expectedReturnDate':
            return r.type === 'lend' ? r.expectedReturnDate : r.createdAt;
          default:
            return r.createdAt;
        }
      };
      diff = new Date(getDateField(a)).getTime() - new Date(getDateField(b)).getTime();
      return filters.sortOrder === 'desc' ? -diff : diff;
    });

    return result;
  },

  getOverdueRecords: () => {
    return get()
      .records.filter((r): r is LendRecord => r.type === 'lend')
      .filter(isOverdue);
  },

  getActiveLendCount: () => {
    return get().records.filter((r) => r.type === 'lend' && !r.actualReturnDate).length;
  },

  getPendingFeedbackCount: () => {
    return get().records.filter((r) => r.type === 'recommend' && r.feedback === 'pending').length;
  },
}));

export type { RecordType, FeedbackStatus, LendItemType, EntryType };
