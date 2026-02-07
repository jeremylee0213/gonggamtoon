import { useState } from 'react';
import { ChevronDown, ChevronUp, Languages } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { DialogLanguage } from '../../store/useAppStore';

const LANGUAGES: { key: DialogLanguage; label: string; flag: string }[] = [
  { key: 'ko', label: '한국어', flag: '🇰🇷' },
  { key: 'en', label: '영어', flag: '🇺🇸' },
  { key: 'ja', label: '일본어', flag: '🇯🇵' },
  { key: 'zh', label: '중국어', flag: '🇨🇳' },
  { key: 'custom', label: '기타', flag: '🌐' },
];

export default function LanguageSelector() {
  const [collapsed, setCollapsed] = useState(true);
  const dialogLanguage = useAppStore((s) => s.dialogLanguage);
  const customLanguageInput = useAppStore((s) => s.customLanguageInput);
  const setDialogLanguage = useAppStore((s) => s.setDialogLanguage);
  const setCustomLanguageInput = useAppStore((s) => s.setCustomLanguageInput);
  const currentLanguage = LANGUAGES.find((lang) => lang.key === dialogLanguage);

  return (
    <div className="bg-card border border-border rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(0,122,255,0.3)]">
            4
          </span>
          <span className="text-base font-bold text-text flex items-center gap-1.5">
            <Languages className="w-4.5 h-4.5 text-primary" />
            대사 언어
          </span>
          {collapsed && (
            <span className="text-xs text-muted font-normal ml-1">
              {currentLanguage?.flag} {currentLanguage?.label}
              {dialogLanguage === 'custom' && customLanguageInput.trim() ? ` · ${customLanguageInput.trim()}` : ''}
            </span>
          )}
        </span>
        {collapsed ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronUp className="w-5 h-5 text-muted" />}
      </button>

      {!collapsed && (
        <div className="mt-3 space-y-2">
          <select
            value={dialogLanguage}
            onChange={(e) => {
              const next = e.target.value as DialogLanguage;
              setDialogLanguage(next);
              if (next !== 'custom') setCollapsed(true);
            }}
            className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-white focus:outline-none focus:border-primary dark:bg-card"
            aria-label="대사 언어 선택"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.key} value={lang.key}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>

          {dialogLanguage === 'custom' && (
            <input
              type="text"
              value={customLanguageInput}
              onChange={(e) => setCustomLanguageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customLanguageInput.trim()) setCollapsed(true);
              }}
              onBlur={() => {
                if (customLanguageInput.trim()) setCollapsed(true);
              }}
              placeholder="기타 언어 입력 (예: 스페인어)"
              className="w-full px-3 py-2 text-sm border border-primary rounded-xl bg-white focus:outline-none focus:border-primary dark:bg-card"
              aria-label="기타 언어 입력"
            />
          )}
        </div>
      )}
    </div>
  );
}
