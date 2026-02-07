import { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { ContentMode } from '../../store/useAppStore';

const MODES: { key: ContentMode; label: string; emoji: string }[] = [
  { key: 'kids', label: '아동', emoji: '🧒' },
  { key: '15', label: '일반', emoji: '🎓' },
  { key: '19', label: '19금', emoji: '🔞' },
  { key: '49', label: '49금', emoji: '🔥' },
];

export default function ModeSelector() {
  const [collapsed, setCollapsed] = useState(true);
  const contentMode = useAppStore((s) => s.contentMode);
  const setContentMode = useAppStore((s) => s.setContentMode);
  const currentMode = MODES.find((mode) => mode.key === contentMode);

  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(0,122,255,0.3)]">
            6
          </span>
          <span className="text-base font-bold text-text flex items-center gap-1.5">
            <ShieldAlert className="w-4.5 h-4.5 text-primary" />
            수위
          </span>
          {collapsed && currentMode && (
            <span className="text-xs text-muted font-normal ml-1">
              {currentMode.emoji} {currentMode.label}
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronUp className="w-5 h-5 text-muted" />}
      </button>

      {!collapsed && (
        <div className="mt-3">
          <select
            value={contentMode}
            onChange={(e) => {
              setContentMode(e.target.value as ContentMode);
              setCollapsed(true);
            }}
            className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-white focus:outline-none focus:border-primary dark:bg-card"
            aria-label="수위 선택"
          >
            {MODES.map((mode) => (
              <option key={mode.key} value={mode.key}>
                {mode.emoji} {mode.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
