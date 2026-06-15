import { Star } from 'lucide-react';
import type { Rating } from '@/types';

interface StarRatingProps {
  value: Rating;
  onChange?: (value: Rating) => void;
  size?: number;
  readOnly?: boolean;
}

export default function StarRating({
  value,
  onChange,
  size = 18,
  readOnly = false,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5] as const;

  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => {
        const filled = s <= value;
        return (
          <button
            key={s}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(s)}
            className={`transition-transform duration-150 ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
            }`}
            aria-label={`${s}星`}
          >
            <Star
              size={size}
              className={
                filled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.4)]'
                  : 'text-gray-500'
              }
            />
          </button>
        );
      })}
    </div>
  );
}
