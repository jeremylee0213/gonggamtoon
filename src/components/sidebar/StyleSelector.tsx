import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { styleData, STYLE_CATEGORIES } from '../../data/styles';

export default function StyleSelector() {
  const { selectedStyle, customStyleInput, setStyle, setCustomStyleInput } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = styleData.filter((s) => {
    const matchesSearch = !search.trim() ||
      s.name.includes(search) ||
      s.en.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
          1
        </span>
        <span className="text-sm font-bold text-muted">만화 스타일</span>
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
        {STYLE_CATEGORIES.map((cat) => (
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
          placeholder="스타일 검색..."
          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 dark:bg-gray-800 dark:border-gray-600"
          aria-label="스타일 검색"
        />
      </div>

      {/* Style chips */}
      <div
        className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1"
        role="radiogroup"
        aria-label="만화 스타일 선택"
      >
        {filtered.map((style) => {
          const isSelected = selectedStyle?.name === style.name;
          return (
            <button
              key={style.name}
              type="button"
              onClick={() => setStyle(style)}
              className={`
                px-2 py-1 rounded-lg text-xs cursor-pointer transition-all border
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
                }
              `}
              role="radio"
              aria-checked={isSelected}
            >
              {style.emoji} {style.name}
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
          value={customStyleInput}
          onChange={(e) => setCustomStyleInput(e.target.value)}
          placeholder="직접 입력 (예: 미야자키 하야오 풍)"
          className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 dark:bg-gray-800 dark:border-gray-600"
          aria-label="커스텀 스타일 입력"
        />
      </div>
    </div>
  );
}
