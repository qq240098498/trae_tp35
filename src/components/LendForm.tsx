import { useState, useEffect } from 'react';
import { Film, BookOpen, Music2, Gamepad2, Disc3, HandHeart, Share2 } from 'lucide-react';
import type { LendRecord, RecommendRecord, LendItemType, EntryType, FeedbackStatus, RecordType } from '@/types';
import {
  LEND_ITEM_TYPE_LABELS,
  TYPE_LABELS,
  FEEDBACK_STATUS_LABELS,
  RECORD_TYPE_LABELS,
} from '@/types';

interface LendFormProps {
  record?: LendRecord | RecommendRecord | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function LendForm({ record, onSubmit, onCancel }: LendFormProps) {
  const [recordType, setRecordType] = useState<RecordType>('lend');
  const [itemName, setItemName] = useState('');
  const [lendItemType, setLendItemType] = useState<LendItemType>('book');
  const [recommendItemType, setRecommendItemType] = useState<EntryType>('movie');
  const [borrower, setBorrower] = useState('');
  const [recommendTo, setRecommendTo] = useState('');
  const [lendDate, setLendDate] = useState('');
  const [recommendDate, setRecommendDate] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [feedback, setFeedback] = useState<FeedbackStatus>('pending');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const defaultReturnDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (record) {
      setRecordType(record.type);
      setItemName(record.itemName);
      if (record.type === 'lend') {
        setLendItemType(record.itemType);
        setBorrower(record.borrower);
        setLendDate(record.lendDate);
        setExpectedReturnDate(record.expectedReturnDate);
      } else {
        setRecommendItemType(record.itemType);
        setRecommendTo(record.recommendTo);
        setRecommendDate(record.recommendDate);
        setFeedback(record.feedback);
        setFeedbackNote(record.feedbackNote || '');
      }
      setNote(record.note || '');
    } else {
      setRecordType('lend');
      setItemName('');
      setLendItemType('book');
      setRecommendItemType('movie');
      setBorrower('');
      setRecommendTo('');
      setLendDate(today);
      setRecommendDate(today);
      setExpectedReturnDate(defaultReturnDate);
      setFeedback('pending');
      setFeedbackNote('');
      setNote('');
    }
    setError('');
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError('请输入物品名称');
      return;
    }

    if (recordType === 'lend') {
      if (!borrower.trim()) {
        setError('请输入借阅人');
        return;
      }
      if (!lendDate) {
        setError('请选择借出日期');
        return;
      }
      if (!expectedReturnDate) {
        setError('请选择预计归还日期');
        return;
      }
      onSubmit({
        itemName: itemName.trim(),
        itemType: lendItemType,
        borrower: borrower.trim(),
        lendDate,
        expectedReturnDate,
        note: note.trim() || undefined,
      });
    } else {
      if (!recommendTo.trim()) {
        setError('请输入推荐对象');
        return;
      }
      if (!recommendDate) {
        setError('请选择推荐日期');
        return;
      }
      onSubmit({
        itemName: itemName.trim(),
        itemType: recommendItemType,
        recommendTo: recommendTo.trim(),
        recommendDate,
        feedback,
        feedbackNote: feedbackNote.trim() || undefined,
        note: note.trim() || undefined,
      });
    }
  };

  const LEND_TYPE_ICONS: Record<LendItemType, typeof BookOpen> = {
    book: BookOpen,
    disc: Disc3,
    other: HandHeart,
  };

  const RECOMMEND_TYPE_ICONS: Record<EntryType, typeof Film> = {
    movie: Film,
    book: BookOpen,
    album: Music2,
    game: Gamepad2,
  };

  const RECORD_TYPE_ICONS: Record<RecordType, typeof HandHeart> = {
    lend: HandHeart,
    recommend: Share2,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">记录类型 *</label>
        <div className="grid grid-cols-2 gap-2">
          {(['lend', 'recommend'] as RecordType[]).map((t) => {
            const Icon = RECORD_TYPE_ICONS[t];
            const active = recordType === t;
            const colorClass =
              t === 'lend'
                ? 'border-accent-book bg-accent-book/15 text-accent-book'
                : 'border-accent-movie bg-accent-movie/15 text-accent-movie';
            return (
              <button
                key={t}
                type="button"
                onClick={() => setRecordType(t)}
                disabled={!!record}
                className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl border-2 transition-all duration-200 ${
                  active
                    ? colorClass
                    : 'border-primary-800/40 text-gray-400 hover:border-primary-600/60 hover:text-gray-200'
                } ${record ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{RECORD_TYPE_LABELS[t]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="label">物品名称 *</label>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="input-field"
          placeholder={recordType === 'lend' ? '例如：三体全集' : '例如：盗梦空间'}
          autoFocus
        />
      </div>

      <div>
        <label className="label">物品类型 *</label>
        {recordType === 'lend' ? (
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(LEND_ITEM_TYPE_LABELS) as LendItemType[]).map((t) => {
              const Icon = LEND_TYPE_ICONS[t];
              const active = lendItemType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLendItemType(t)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1.5 rounded-xl border-2 transition-all duration-200 ${
                    active
                      ? 'border-primary-500 bg-primary-500/15 text-primary-300'
                      : 'border-primary-800/40 text-gray-400 hover:border-primary-600/60 hover:text-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs font-medium">{LEND_ITEM_TYPE_LABELS[t]}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(TYPE_LABELS) as EntryType[]).map((t) => {
              const Icon = RECOMMEND_TYPE_ICONS[t];
              const active = recommendItemType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setRecommendItemType(t)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1.5 rounded-xl border-2 transition-all duration-200 ${
                    active
                      ? 'border-primary-500 bg-primary-500/15 text-primary-300'
                      : 'border-primary-800/40 text-gray-400 hover:border-primary-600/60 hover:text-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs font-medium">{TYPE_LABELS[t]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {recordType === 'lend' ? (
        <>
          <div>
            <label className="label">借阅人 *</label>
            <input
              type="text"
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              className="input-field"
              placeholder="例如：张三"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">借出日期 *</label>
              <input
                type="date"
                value={lendDate}
                onChange={(e) => setLendDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">预计归还日期 *</label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="label">推荐给 *</label>
            <input
              type="text"
              value={recommendTo}
              onChange={(e) => setRecommendTo(e.target.value)}
              className="input-field"
              placeholder="例如：王五"
            />
          </div>

          <div>
            <label className="label">推荐日期 *</label>
            <input
              type="date"
              value={recommendDate}
              onChange={(e) => setRecommendDate(e.target.value)}
              className="input-field"
            />
          </div>

          {record && record.type === 'recommend' && (
            <div>
              <label className="label">反馈状态</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(FEEDBACK_STATUS_LABELS) as FeedbackStatus[]).map((f) => {
                  const active = feedback === f;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFeedback(f)}
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
          )}

          {record && record.type === 'recommend' && (
            <div>
              <label className="label">反馈备注</label>
              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                className="input-field min-h-[60px] resize-y"
                placeholder="对方的具体反馈..."
                rows={2}
              />
            </div>
          )}
        </>
      )}

      <div>
        <label className="label">备注（可选）</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field min-h-[60px] resize-y"
          placeholder="添加备注..."
          rows={2}
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
          {record ? '保存修改' : recordType === 'lend' ? '添加借出记录' : '添加推荐记录'}
        </button>
      </div>
    </form>
  );
}
