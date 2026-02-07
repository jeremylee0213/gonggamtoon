import { useAppStore } from '../../store/useAppStore';

/** Sticky settings summary bar (#20) — shows current selections when scrolled down */
export default function SettingsSummaryBar() {
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const getEffectiveStyle = useAppStore((s) => s.getEffectiveStyle);
  const selectedThemes = useAppStore((s) => s.selectedThemes);
  const customThemeInput = useAppStore((s) => s.customThemeInput);
  const selectedPanels = useAppStore((s) => s.selectedPanels);
  const customPanelCount = useAppStore((s) => s.customPanelCount);
  const dialogLanguage = useAppStore((s) => s.dialogLanguage);
  const contentMode = useAppStore((s) => s.contentMode);

  const styleName = getEffectiveStyle();
  const themeNames = selectedThemes.map((t) => t.name);
  const themeName = themeNames.length > 0
    ? (themeNames.length > 2 ? `${themeNames.slice(0, 2).join(', ')} 외 ${themeNames.length - 2}` : themeNames.join(', '))
    : customThemeInput;
  const themeEmoji = selectedThemes[0]?.emoji ?? '💡';
  const panels = customPanelCount ?? selectedPanels;

  if (!styleName && !themeName) return null;

  const langLabels: Record<string, string> = { ko: '한국어', en: '영어', ja: '일본어', zh: '중국어', custom: '기타' };
  const modeLabels: Record<string, string> = { kids: '아동', '15': '일반', '19': '19금', '49': '49금' };

  const chips = [
    styleName && `${selectedStyle?.emoji ?? '🎨'} ${styleName}`,
    themeName && `${themeEmoji} ${themeName}`,
    `${panels}컷`,
    langLabels[dialogLanguage],
    modeLabels[contentMode],
  ].filter(Boolean);

  return (
    <div className="sticky top-16 z-30 bg-card/90 backdrop-blur-md border-b border-border/50 px-4 py-2 -mx-6 mb-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
      {chips.map((chip, i) => (
        <span
          key={i}
          className="shrink-0 px-2.5 py-1 bg-surface text-text text-xs font-medium rounded-full border border-border/50"
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
