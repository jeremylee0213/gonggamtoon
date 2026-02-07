import { useAppStore } from '../../store/useAppStore';
import type { ContentMode } from '../../store/useAppStore';

const MODES: { key: ContentMode; label: string; emoji: string }[] = [
  { key: 'kids', label: '아동', emoji: '🧒' },
  { key: '15', label: '일반', emoji: '🎓' },
  { key: '19', label: '19금', emoji: '🔞' },
  { key: '49', label: '49금', emoji: '🔥' },
];

export default function ModeSelector() {
  const contentMode = useAppStore((s) => s.contentMode);
  const setContentMode = useAppStore((s) => s.setContentMode);

  return (
    <div>
      <span className="text-sm font-bold text-text block mb-1.5">수위</span>
      <div className="flex gap-1">
        {MODES.map((mode) => {
          const isSelected = contentMode === mode.key;
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => setContentMode(mode.key)}
              className={`
                flex-1 px-2 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border
                ${isSelected
                  ? 'border-primary bg-primary-light text-primary-dark font-semibold'
                  : 'border-border bg-white text-text hover:bg-surface dark:bg-card'
                }
              `}
            >
              {mode.emoji} {mode.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
