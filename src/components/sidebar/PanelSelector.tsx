import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_PANELS } from '../../data/panelLayouts';

export default function PanelSelector() {
  const { customPanelCount, setPanels, setCustomPanelCount } = useAppStore();
  const currentPanels = customPanelCount ?? DEFAULT_PANELS;

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setCustomPanelCount(null);
      setPanels(DEFAULT_PANELS);
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 4 && num <= 16) {
      setCustomPanelCount(num);
    }
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
        4
      </span>
      <span className="text-sm font-bold text-text shrink-0">컷 수</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <input
          type="number"
          min={4}
          max={16}
          value={customPanelCount ?? ''}
          onChange={handleCustomChange}
          placeholder={String(DEFAULT_PANELS)}
          className="w-16 px-2 py-1.5 text-sm text-center border border-border rounded-lg bg-white focus:outline-none focus:border-primary dark:bg-card"
          aria-label="컷 수 입력"
        />
        <span className="text-sm text-text shrink-0">컷</span>
        <span className="text-xs text-muted shrink-0">(4~16)</span>
        <span className="text-xs text-muted shrink-0">현재 {currentPanels}</span>
      </div>
    </div>
  );
}
