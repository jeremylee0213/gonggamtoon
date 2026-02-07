import { useState } from 'react';
import { Search, Check, Flame } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { styleData, STYLE_CATEGORIES } from '../../data/styles';
import { scrollToSection } from '../../hooks/useAutoScroll';

const POPULAR_STYLES = ['짱구', '포켓몬', '지브리', '원피스', '귀멸의 칼날', '스파이패밀리'];

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

  // Category count badges
  const categoryCounts = STYLE_CATEGORIES.map((cat) => ({
    ...cat,
    count: styleData.filter((s) => s.category === cat.key).length,
  }));

  const handleSelect = (style: typeof styleData[0]) => {
    setStyle(style);
    scrollToSection('section-theme');
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(0,122,255,0.3)]">
          2
        </span>
        <span className="text-lg font-bold text-text">만화 스타일</span>
      </div>

      {/* Popular picks */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {POPULAR_STYLES.map((name) => {
          const style = styleData.find((s) => s.name === name);
          if (!style) return null;
          const isSelected = selectedStyle?.name === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => handleSelect(style)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl cursor-pointer transition-all border min-w-[60px] shrink-0
                ${isSelected
                  ? 'border-primary bg-primary-light shadow-sm'
                  : 'border-border bg-surface hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              <span className="text-2xl">{style.emoji}</span>
              <span className={`text-xs font-medium ${isSelected ? 'text-primary-dark' : 'text-text'}`}>{style.name}</span>
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
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-muted hover:bg-surface/80'
          }`}
        >
          전체 <span className="opacity-60 ml-0.5">{styleData.length}</span>
        </button>
        {categoryCounts.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
              activeCategory === cat.key
                ? 'bg-primary text-white shadow-sm'
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
          placeholder="스타일 검색..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-primary dark:bg-card"
          aria-label="스타일 검색"
        />
      </div>

      <div
        className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1"
        role="radiogroup"
        aria-label="만화 스타일 선택"
      >
        {filtered.map((style) => {
          const isSelected = selectedStyle?.name === style.name;
          return (
            <button
              key={style.name}
              type="button"
              onClick={() => handleSelect(style)}
              className={`
                px-3 py-1.5 rounded-xl text-sm cursor-pointer transition-all border
                ${
                  isSelected
                    ? 'border-primary bg-primary-light text-primary-dark font-semibold shadow-[0_2px_8px_rgba(0,122,255,0.15)] scale-105'
                    : 'border-border bg-white text-text hover:shadow-md hover:-translate-y-0.5 dark:bg-card'
                }
              `}
              role="radio"
              aria-checked={isSelected}
            >
              {isSelected && <Check className="w-3.5 h-3.5 inline mr-1" />}
              {style.emoji} {style.name}
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
          value={customStyleInput}
          onChange={(e) => setCustomStyleInput(e.target.value)}
          placeholder="직접 입력 (예: 미야자키 하야오 풍)"
          className="w-full px-4 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-primary dark:bg-card"
          aria-label="커스텀 스타일 입력"
        />
      </div>
    </div>
  );
}
