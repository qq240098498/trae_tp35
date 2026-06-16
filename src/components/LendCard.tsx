import { useState } from 'react';
import {
  Pencil,
  Trash2,
  BookOpen,
  Disc3,
  HandHeart,
  Share2,
  Film,
  Music2,
  Gamepad2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import Modal from './Modal';
import LendForm from './LendForm';
import type { LendRecord, RecommendRecord, FeedbackStatus } from '@/types';
import {
  LEND_ITEM_TYPE_LABELS,
  TYPE_LABELS,
  FEEDBACK_STATUS_LABELS,
  RECORD_TYPE_LABELS,
  FEEDBACK_STATUS_COLORS,
  LEND_ITEM_TYPE_COLORS,
  TYPE_BG_COLORS,
  TYPE_TEXT_COLORS,
  TYPE_COLORS,
} from '@/types';

interface LendCardProps {
  record: LendRecord | RecommendRecord;
  onEdit: (record: LendRecord | RecommendRecord) => void;
  onDelete: (id: string) => void;
  onMarkReturned: (id: string) => void;
  onUpdateFeedback: (id: string, feedback: FeedbackStatus, feedbackNote?: string) => void;
  index: number;
}

export default function LendCard({
  record,
  onEdit,
  onDelete,
  onMarkReturned,
  onUpdateFeedback,
  index,
}: LendCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState<FeedbackStatus>('pending');
  const [newFeedbackNote, setNewFeedbackNote] = useState('');

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDaysOverdue = () => {
    if (record.type !== 'lend' || record.actualReturnDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expected = new Date(record.expectedReturnDate);
    expected.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - expected.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getDaysRemaining = () => {
    if (record.type !== 'lend' || record.actualReturnDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expected = new Date(record.expectedReturnDate);
    expected.setHours(0, 0, 0, 0);
    const diff = Math.ceil((expected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const isOverdue = getDaysOverdue() > 0;
  const isReturned = record.type === 'lend' && record.actualReturnDate;

  const LEND_TYPE_ICONS: Record<string, typeof BookOpen> = {
    book: BookOpen,
    disc: Disc3,
    other: HandHeart,
  };

  const RECOMMEND_TYPE_ICONS: Record<string, typeof Film> = {
    movie: Film,
    book: BookOpen,
    album: Music2,
    game: Gamepad2,
  };

  const RECORD_TYPE_ICONS: Record<string, typeof HandHeart> = {
    lend: HandHeart,
    recommend: Share2,
  };

  const getTypeIcon = () => {
    if (record.type === 'lend') {
      return LEND_TYPE_ICONS[record.itemType] || HandHeart;
    }
    return RECOMMEND_TYPE_ICONS[record.itemType] || Film;
  };

  const getTypeLabel = () => {
    if (record.type === 'lend') {
      return LEND_ITEM_TYPE_LABELS[record.itemType as keyof typeof LEND_ITEM_TYPE_LABELS] || '其他';
    }
    return TYPE_LABELS[record.itemType as keyof typeof TYPE_LABELS] || '其他';
  };

  const getTypeColorClass = () => {
    if (record.type === 'lend') {
      return LEND_ITEM_TYPE_COLORS[record.itemType as keyof typeof LEND_ITEM_TYPE_COLORS] || 'bg-accent-game';
    }
    return TYPE_COLORS[record.itemType as keyof typeof TYPE_COLORS] || 'bg-accent-movie';
  };

  const getTypeBgClass = () => {
    if (record.type === 'lend') {
      return 'bg-accent-book/15';
    }
    return TYPE_BG_COLORS[record.itemType as keyof typeof TYPE_BG_COLORS] || 'bg-accent-movie/15';
  };

  const getTypeTextClass = () => {
    if (record.type === 'lend') {
      return 'text-accent-book';
    }
    return TYPE_TEXT_COLORS[record.itemType as keyof typeof TYPE_TEXT_COLORS] || 'text-accent-movie';
  };

  const handleFeedbackSubmit = () => {
    onUpdateFeedback(record.id, newFeedback, newFeedbackNote || undefined);
    setShowFeedbackModal(false);
  };

  const RecordIcon = RECORD_TYPE_ICONS[record.type] || HandHeart;
  const ItemIcon = getTypeIcon();

  return (
    <>
      <div
        className={`card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-slide-up ${
          isOverdue ? 'border-red-500/50 ring-1 ring-red-500/30' : 'hover:border-primary-600/50'
        }`}
        style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
      >
        <div className={`h-1.5 ${getTypeColorClass()}`} />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative">
                <div
                  className={`w-9 h-9 rounded-lg ${getTypeBgClass()} flex items-center justify-center flex-shrink-0`}
                >
                  <ItemIcon size={18} className={getTypeTextClass()} />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                    record.type === 'lend' ? 'bg-accent-book' : 'bg-accent-movie'
                  }`}
                >
                  <RecordIcon size={10} className="text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h3
                  className={`font-display font-semibold text-lg text-white truncate ${getTypeTextClass()}`}
                >
                  {record.itemName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getTypeBgClass()} ${getTypeTextClass()}`}
                  >
                    {getTypeLabel()}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      record.type === 'lend'
                        ? 'bg-accent-book/20 text-accent-book'
                        : 'bg-accent-movie/20 text-accent-movie'
                    }`}
                  >
                    {RECORD_TYPE_LABELS[record.type]}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {record.type === 'lend' && !record.actualReturnDate && (
                <button
                  onClick={() => onMarkReturned(record.id)}
                  className="p-1.5 rounded-lg hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-colors"
                  title="标记已归还"
                >
                  <CheckCircle2 size={16} />
                </button>
              )}
              {record.type === 'recommend' && (
                <button
                  onClick={() => {
                    setNewFeedback(record.feedback);
                    setNewFeedbackNote(record.feedbackNote || '');
                    setShowFeedbackModal(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-primary-500/20 text-gray-400 hover:text-primary-300 transition-colors"
                  title="更新反馈"
                >
                  <MessageSquare size={16} />
                </button>
              )}
              <button
                onClick={() => onEdit(record)}
                className="p-1.5 rounded-lg hover:bg-surface-light text-gray-400 hover:text-white transition-colors"
                title="编辑"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(record.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                title="删除"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {record.type === 'lend' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 min-w-[60px]">借阅人：</span>
                <span className="text-white font-medium">{record.borrower}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 min-w-[60px]">借出日期：</span>
                <span className="text-gray-200">{formatDate(record.lendDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 min-w-[60px]">预计归还：</span>
                <span className={`${isOverdue ? 'text-red-400 font-medium' : 'text-gray-200'}`}>
                  {formatDate(record.expectedReturnDate)}
                </span>
              </div>
              {record.actualReturnDate && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 min-w-[60px]">实际归还：</span>
                  <span className="text-green-400 font-medium">{formatDate(record.actualReturnDate)}</span>
                </div>
              )}
              {isOverdue && (
                <div className="flex items-center gap-2 text-sm mt-3 p-2 rounded-lg bg-red-500/15 border border-red-500/30">
                  <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
                  <span className="text-red-300 font-medium">已逾期 {getDaysOverdue()} 天，需要催还！</span>
                </div>
              )}
              {!isOverdue && !isReturned && getDaysRemaining() <= 7 && getDaysRemaining() > 0 && (
                <div className="flex items-center gap-2 text-sm mt-3 p-2 rounded-lg bg-yellow-500/15 border border-yellow-500/30">
                  <Clock size={16} className="text-yellow-400 flex-shrink-0" />
                  <span className="text-yellow-300">还有 {getDaysRemaining()} 天到期</span>
                </div>
              )}
              {isReturned && (
                <div className="flex items-center gap-2 text-sm mt-3 p-2 rounded-lg bg-green-500/15 border border-green-500/30">
                  <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-green-300">已归还</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 min-w-[60px]">推荐给：</span>
                <span className="text-white font-medium">{record.recommendTo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 min-w-[60px]">推荐日期：</span>
                <span className="text-gray-200">{formatDate(record.recommendDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 min-w-[60px]">反馈状态：</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                    FEEDBACK_STATUS_COLORS[record.feedback]
                  }`}
                >
                  {FEEDBACK_STATUS_LABELS[record.feedback]}
                </span>
              </div>
              {record.feedbackNote && (
                <div className="mt-2 p-2 rounded-lg bg-surface-dark/50">
                  <p className="text-sm text-gray-300">{record.feedbackNote}</p>
                </div>
              )}
            </div>
          )}

          {record.note && (
            <div className="mt-3 pt-3 border-t border-primary-800/30">
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{record.note}</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`编辑${RECORD_TYPE_LABELS[record.type]}记录`}
      >
        <LendForm
          record={record}
          onSubmit={(data) => {
            onEdit({ ...record, ...data });
            setShowEditModal(false);
          }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      <Modal
        open={showFeedbackModal && record.type === 'recommend'}
        onClose={() => setShowFeedbackModal(false)}
        title="更新反馈"
      >
        <div className="space-y-4">
          <div>
            <label className="label">反馈状态</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(FEEDBACK_STATUS_LABELS) as FeedbackStatus[]).map((f) => {
                const active = newFeedback === f;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setNewFeedback(f)}
                    className={`py-2 px-1.5 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                      active
                        ? 'border-primary-500 bg-primary-500/15 text-primary-300'
                        : 'border-primary-800/40 text-gray-400 hover:border-primary-600/60 hover:text-gray-200'
                    }`}
                  >
                    {FEEDBACK_STATUS_LABELS[f]}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">反馈备注</label>
            <textarea
              value={newFeedbackNote}
              onChange={(e) => setNewFeedbackNote(e.target.value)}
              className="input-field min-h-[80px] resize-y"
              placeholder="对方的具体反馈..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowFeedbackModal(false)}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button type="button" onClick={handleFeedbackSubmit} className="btn btn-primary">
              保存
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
