import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { themeMetaList, THEME_CATEGORIES } from '../../data/themes';
import { scrollToSection } from '../../hooks/useAutoScroll';

export default function ThemeSelector() {
  const { selectedTheme, customThemeInput, setTheme, setCustomThemeInput } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
    scrollToSection('section-generate');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="bg-accent text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(88,86,214,0.3)]">
          2
        </span>
        <span className="text-lg font-bold text-text">공감 주제</span>
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

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="주제 검색..."
          className="w-full pl-10 pr-4 py-2.5 text-base border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-accent dark:bg-card"
          aria-label="주제 검색"
        />
      </div>

      <div
        className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1"
        role="radiogroup"
        aria-label="공감 주제 선택"
      >
        {filtered.map((theme) => {
          const isSelected = selectedTheme?.key === theme.key;
          return (
            <button
              key={theme.key}
              type="button"
              onClick={() => handleSelect(theme)}
              className={`
                px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all border
                ${
                  isSelected
                    ? 'border-accent bg-accent-light text-accent font-semibold shadow-[0_2px_8px_rgba(88,86,214,0.15)] scale-105'
                    : 'border-border bg-white text-text hover:shadow-md hover:-translate-y-0.5 dark:bg-card'
                }
              `}
              role="radio"
              aria-checked={isSelected}
              title={theme.description}
            >
              {isSelected && <Check className="w-3.5 h-3.5 inline mr-1" />}
              {theme.emoji} {theme.name}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <span className="text-sm text-muted py-2">검색 결과가 없습니다</span>
        )}
      </div>

      <div className="mt-3">
        <input
          type="text"
          value={customThemeInput}
          onChange={(e) => setCustomThemeInput(e.target.value)}
          placeholder="직접 입력 (예: 시험 기간 스트레스)"
          className="w-full px-4 py-2.5 text-base border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-accent dark:bg-card"
          aria-label="커스텀 주제 입력"
        />
      </div>
    </div>
  );
}
