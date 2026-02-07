import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_PANELS } from '../../data/panelLayouts';

export default function PanelSelector() {
  const { customPanelCount, setPanels, setCustomPanelCount } = useAppStore();

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
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
          2
        </span>
        <span className="text-sm font-bold text-muted">컷 수</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {customPanelCount
            ? `${customPanelCount}컷`
            : `${DEFAULT_PANELS}컷 (기본)`}
        </span>
        <input
          type="number"
          min={4}
          max={16}
          value={customPanelCount ?? ''}
          onChange={handleCustomChange}
          placeholder={String(DEFAULT_PANELS)}
          className="w-16 px-2 py-1 text-xs text-center border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 dark:bg-gray-800 dark:border-gray-600"
        />
        <span className="text-[10px] text-gray-400">4~16</span>
      </div>
    </div>
  );
}
