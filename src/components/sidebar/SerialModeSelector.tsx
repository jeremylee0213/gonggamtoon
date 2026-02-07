import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpenText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function SerialModeSelector() {
  const [collapsed, setCollapsed] = useState(true);
  const serialMode = useAppStore((s) => s.serialMode);
  const setSerialMode = useAppStore((s) => s.setSerialMode);
  const serialEpisodeCount = useAppStore((s) => s.serialEpisodeCount);
  const setSerialEpisodeCount = useAppStore((s) => s.setSerialEpisodeCount);
  const previousEpisodeSummary = useAppStore((s) => s.previousEpisodeSummary);
  const setPreviousEpisodeSummary = useAppStore((s) => s.setPreviousEpisodeSummary);

  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(0,122,255,0.3)]">
            1
          </span>
          <span className="text-base font-bold text-text flex items-center gap-1.5">
            <BookOpenText className="w-4.5 h-4.5 text-primary" />
            연재 모드
          </span>
          {collapsed && serialMode && (
            <span className="text-xs text-muted font-normal ml-1">
              ON · {serialEpisodeCount}화
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronUp className="w-5 h-5 text-muted" />}
      </button>

      {!collapsed && (
        <div className="mt-3">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={serialMode}
              onChange={(e) => {
                const checked = e.target.checked;
                setSerialMode(checked);
                if (!checked) setCollapsed(true);
              }}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm font-medium text-text">여러 화를 한 번에 생성</span>
          </label>

          {serialMode && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text shrink-0">연재 화수</span>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={serialEpisodeCount}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    if (!isNaN(num)) setSerialEpisodeCount(num);
                  }}
                  onBlur={() => setCollapsed(true)}
                  className="w-20 px-2.5 py-1.5 text-sm text-center border border-border rounded-lg bg-white focus:outline-none focus:border-primary dark:bg-card"
                  aria-label="연재 화수 입력"
                />
                <span className="text-sm text-muted">화 (2~20)</span>
              </div>
              <p className="text-xs text-muted">
                입력한 화수만큼 스토리를 한 번에 생성하고, 각 화는 완결 + 다음 화 연속성을 유지합니다.
              </p>
              <textarea
                value={previousEpisodeSummary}
                onChange={(e) => setPreviousEpisodeSummary(e.target.value)}
                onBlur={() => {
                  if (previousEpisodeSummary.trim()) setCollapsed(true);
                }}
                placeholder="이미 연재 중이면 이전 화 요약을 입력하세요 (선택)"
                rows={2}
                className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-primary dark:bg-card resize-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
