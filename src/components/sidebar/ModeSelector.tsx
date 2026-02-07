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
    <div className="flex items-center gap-2 min-w-0">
      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
        6
      </span>
      <span className="text-sm font-bold text-text shrink-0">수위</span>
      <select
        value={contentMode}
        onChange={(e) => setContentMode(e.target.value as ContentMode)}
        className="min-w-0 flex-1 px-2.5 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary dark:bg-card"
        aria-label="수위 선택"
      >
        {MODES.map((mode) => (
          <option key={mode.key} value={mode.key}>
            {mode.emoji} {mode.label}
          </option>
        ))}
      </select>
    </div>
  );
}
