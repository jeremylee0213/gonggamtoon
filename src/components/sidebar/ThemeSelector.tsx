import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { themeMetaList, THEME_CATEGORIES } from '../../data/themes';

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

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
          3
        </span>
        <span className="text-sm font-bold text-muted">공감 주제</span>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`px-2 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
            activeCategory === null
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          전체
        </button>
        {THEME_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            className={`px-2 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors ${
              activeCategory === cat.key
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="주제 검색..."
          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 dark:bg-gray-800 dark:border-gray-600"
          aria-label="주제 검색"
        />
      </div>

      {/* Theme chips */}
      <div
        className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1"
        role="radiogroup"
        aria-label="공감 주제 선택"
      >
        {filtered.map((theme) => {
          const isSelected = selectedTheme?.key === theme.key;
          return (
            <button
              key={theme.key}
              type="button"
              onClick={() => setTheme(theme)}
              className={`
                px-2 py-1 rounded-lg text-xs cursor-pointer transition-all border
                ${
                  isSelected
                    ? 'border-[#4A90A4] bg-[#E8F4F8] text-[#2C7A92] font-semibold dark:bg-[#4A90A4]/20 dark:text-[#7EC8E3]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                }
              `}
              role="radio"
              aria-checked={isSelected}
              title={theme.description}
            >
              {theme.emoji} {theme.name}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <span className="text-xs text-gray-400 py-2">검색 결과가 없습니다</span>
        )}
      </div>

      {/* Custom input */}
      <div className="mt-2">
        <input
          type="text"
          value={customThemeInput}
          onChange={(e) => setCustomThemeInput(e.target.value)}
          placeholder="직접 입력 (예: 시험 기간 스트레스)"
          className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 dark:bg-gray-800 dark:border-gray-600"
          aria-label="커스텀 주제 입력"
        />
      </div>
    </div>
  );
}
