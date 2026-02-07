import { useState } from 'react';
import { Search, Check, Flame, X, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { themeMetaList, THEME_CATEGORIES } from '../../data/themes';

const POPULAR_THEMES = ['번아웃', 'ADHD', '연애', '미루기', '직장생활', '사회불안'];

export default function ThemeSelector() {
  const selectedThemes = useAppStore((s) => s.selectedThemes);
  const customThemeInput = useAppStore((s) => s.customThemeInput);
  const setTheme = useAppStore((s) => s.setTheme);
  const addThemes = useAppStore((s) => s.addThemes);
  const removeThemeAt = useAppStore((s) => s.removeThemeAt);
  const clearThemes = useAppStore((s) => s.clearThemes);
  const setCustomThemeInput = useAppStore((s) => s.setCustomThemeInput);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(true);

  const filtered = themeMetaList.filter((t) => {
    const matchesSearch = !search.trim() ||
      t.name.includes(search) ||
      t.description.includes(search) ||
      t.key.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Category count badges
  const categoryCounts = THEME_CATEGORIES.map((cat) => ({
    ...cat,
    count: themeMetaList.filter((t) => t.category === cat.key).length,
  }));

  const handleSelect = (theme: typeof themeMetaList[0]) => {
    setTheme(theme);
    setCollapsed(true);
  };

  const handleSelectAll = () => {
    addThemes(themeMetaList);
    setCollapsed(true);
  };

  const getSelectedCount = (key: string) => selectedThemes.filter((t) => t.key === key).length;

  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="bg-accent text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(88,86,214,0.3)]">
            3
          </span>
          <span className="text-lg font-bold text-text flex items-center gap-1.5">
            <Heart className="w-4.5 h-4.5 text-accent" />
            공감 주제
          </span>
          {collapsed && selectedThemes.length > 0 && (
            <span className="text-xs text-muted font-normal ml-1">
              {selectedThemes[0].name}{selectedThemes.length > 1 ? ` 외 ${selectedThemes.length - 1}` : ''} ({selectedThemes.length})
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronUp className="w-5 h-5 text-muted" />}
      </button>

      {!collapsed && (
        <div className="mt-3">
          {/* Popular picks */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {POPULAR_THEMES.map((key) => {
              const theme = themeMetaList.find((t) => t.key === key);
              if (!theme) return null;
              const selectedCount = getSelectedCount(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelect(theme)}
              className={`
                    relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl cursor-pointer transition-all border min-w-[60px] shrink-0
                    ${selectedCount > 0
                      ? 'border-accent bg-accent-light shadow-sm'
                      : 'border-border bg-surface hover:shadow-md hover:-translate-y-0.5'
                    }
                  `}
                  title={`${theme.name} 선택/해제`}
                >
                  {selectedCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                  )}
                  <span className="text-2xl">{theme.emoji}</span>
                  <span className={`text-xs font-medium ${selectedCount > 0 ? 'text-accent' : 'text-text'}`}>{theme.name}</span>
                </button>
              );
            })}
            <div className="flex items-center px-1">
              <Flame className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs text-muted ml-0.5">인기</span>
            </div>
          </div>

          <div className="flex gap-1.5 mb-3 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                activeCategory === null
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface text-muted hover:bg-surface/80'
              }`}
            >
              전체 <span className="opacity-60 ml-0.5">{themeMetaList.length}</span>
            </button>
            {categoryCounts.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                  activeCategory === cat.key
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-surface text-muted hover:bg-surface/80'
                }`}
              >
                {cat.emoji} {cat.label} <span className="opacity-60 ml-0.5">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-accent/40 text-accent hover:bg-accent-light transition-colors cursor-pointer"
            >
              모두 선택
            </button>
            <button
              type="button"
              onClick={clearThemes}
              disabled={selectedThemes.length === 0}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border text-muted hover:bg-surface transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              전체 해제
            </button>
            <span className="text-xs text-muted ml-auto">선택 {selectedThemes.length}개</span>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="주제 검색..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-accent dark:bg-card"
              aria-label="주제 검색"
            />
          </div>

          <div
            className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1"
            role="group"
            aria-label="공감 주제 다중 선택"
          >
            {filtered.map((theme) => {
              const selectedCount = getSelectedCount(theme.key);
              return (
                <button
                  key={theme.key}
                  type="button"
                  onClick={() => handleSelect(theme)}
                  className={`
                    px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all border
                    ${
                      selectedCount > 0
                        ? 'border-accent bg-accent-light text-accent font-semibold shadow-[0_2px_8px_rgba(88,86,214,0.15)] scale-105'
                        : 'border-border bg-white text-text hover:shadow-md hover:-translate-y-0.5 dark:bg-card'
                    }
                  `}
                  aria-label={`${theme.name} 선택/해제`}
                  title={theme.description}
                >
                  {selectedCount > 0 && <Check className="w-3.5 h-3.5 inline mr-1" />}
                  {theme.emoji} {theme.name}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <span className="text-sm text-muted py-2">검색 결과가 없습니다</span>
            )}
          </div>

          {selectedThemes.length > 0 && (
            <div className="mt-3 p-2 rounded-xl border border-border bg-surface/60">
              <div className="text-xs text-muted mb-1">선택 목록</div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {selectedThemes.map((theme, idx) => (
                  <span
                    key={`${theme.key}-${idx}`}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-white border border-border dark:bg-card"
                  >
                    {idx + 1}. {theme.emoji} {theme.name}
                    <button
                      type="button"
                      onClick={() => removeThemeAt(idx)}
                      className="text-muted hover:text-text cursor-pointer"
                      aria-label={`선택된 주제 ${idx + 1} 제거`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3">
            <input
              type="text"
              value={customThemeInput}
              onChange={(e) => setCustomThemeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customThemeInput.trim()) setCollapsed(true);
              }}
              onBlur={() => {
                if (customThemeInput.trim()) setCollapsed(true);
              }}
              placeholder="직접 입력 (예: 시험 기간 스트레스)"
              className="w-full px-4 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-accent dark:bg-card"
              aria-label="커스텀 주제 입력"
            />
          </div>
        </div>
      )}
    </div>
  );
}
