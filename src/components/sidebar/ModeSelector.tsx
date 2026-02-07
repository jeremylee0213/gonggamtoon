import { useAppStore } from '../../store/useAppStore';
import type { ContentMode } from '../../store/useAppStore';

const MODES: { key: ContentMode; label: string; emoji: string; desc: string; color: string }[] = [
  { key: 'kids', label: '미취학 아동', emoji: '🧒', desc: '순수하고 귀여운 내용만', color: 'border-success bg-green-50 text-success dark:bg-green-900/20' },
  { key: '15', label: '일반', emoji: '🎓', desc: '일반적인 공감 스토리', color: 'border-primary bg-primary-light text-primary-dark' },
  { key: '19', label: '19금', emoji: '🔞', desc: '섹드립/야한 유머 포함', color: 'border-warning bg-[#FFF8EC] text-warning' },
  { key: '49', label: '49금', emoji: '🔥', desc: '노골적 성인 유머/상황', color: 'border-error bg-red-50 text-error dark:bg-red-900/20' },
];

export default function ModeSelector() {
  const contentMode = useAppStore((s) => s.contentMode);
  const setContentMode = useAppStore((s) => s.setContentMode);

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-base font-bold text-text">수위 모드</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MODES.map((mode) => {
          const isSelected = contentMode === mode.key;
          return (
            <button
              key={mode.key}
              type="button"
              onClick={() => setContentMode(mode.key)}
              className={`
                px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all border-2
                ${isSelected
                  ? `${mode.color} font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] scale-[1.02]`
                  : 'border-border bg-white text-text hover:shadow-md hover:-translate-y-0.5 dark:bg-card'
                }
              `}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{mode.emoji}</span>
                <span className="text-sm font-bold">{mode.label}</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{mode.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
