import { useState } from 'react';
import { ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function PanelSelector() {
  const [collapsed, setCollapsed] = useState(true);
  const { customPanelCount, selectedPanels, setCustomPanelCount } = useAppStore();
  const panelOptions = Array.from({ length: 13 }, (_, i) => i + 4);
  const currentPanels = customPanelCount ?? selectedPanels;

  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(0,122,255,0.3)]">
            5
          </span>
          <span className="text-base font-bold text-text flex items-center gap-1.5">
            <LayoutGrid className="w-4.5 h-4.5 text-primary" />
            컷 수
          </span>
          {collapsed && (
            <span className="text-xs text-muted font-normal ml-1">
              {currentPanels}컷
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronUp className="w-5 h-5 text-muted" />}
      </button>

      {!collapsed && (
        <div className="mt-3 flex items-center gap-2">
          <select
            value={customPanelCount ?? selectedPanels}
            onChange={(e) => {
              const num = parseInt(e.target.value, 10);
              if (!isNaN(num)) {
                setCustomPanelCount(num);
                setCollapsed(true);
              }
            }}
            className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-white focus:outline-none focus:border-primary dark:bg-card"
            aria-label="컷 수 선택"
          >
            {panelOptions.map((count) => (
              <option key={count} value={count}>
                {count}컷
              </option>
            ))}
          </select>
          <span className="text-xs text-muted shrink-0">4~16</span>
        </div>
      )}
    </div>
  );
}
