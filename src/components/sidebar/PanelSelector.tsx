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
    <div>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(76,175,80,0.3)]">
          3
        </span>
        <span className="text-base font-bold text-text">컷 수</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-base text-muted">
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
          className="w-20 px-3 py-2 text-base text-center border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-primary dark:bg-card"
        />
        <span className="text-sm text-muted">4~16</span>
      </div>
    </div>
  );
}
