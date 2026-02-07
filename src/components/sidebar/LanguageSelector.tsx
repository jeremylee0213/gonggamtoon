import { useAppStore } from '../../store/useAppStore';
import type { DialogLanguage } from '../../store/useAppStore';

const LANGUAGES: { key: DialogLanguage; label: string; flag: string }[] = [
  { key: 'ko', label: '한국어', flag: '🇰🇷' },
  { key: 'en', label: '영어', flag: '🇺🇸' },
  { key: 'ja', label: '일본어', flag: '🇯🇵' },
  { key: 'zh', label: '중국어', flag: '🇨🇳' },
];

export default function LanguageSelector() {
  const dialogLanguage = useAppStore((s) => s.dialogLanguage);
  const customLanguageInput = useAppStore((s) => s.customLanguageInput);
  const setDialogLanguage = useAppStore((s) => s.setDialogLanguage);
  const setCustomLanguageInput = useAppStore((s) => s.setCustomLanguageInput);

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-base font-bold text-text">대사 언어</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.key}
            type="button"
            onClick={() => setDialogLanguage(lang.key)}
            className={`
              px-3 py-1.5 rounded-xl text-sm font-medium cursor-pointer transition-all border
              ${dialogLanguage === lang.key
                ? 'border-primary bg-primary-light text-primary-dark font-semibold shadow-[0_2px_8px_rgba(76,175,80,0.15)]'
                : 'border-border bg-white text-text hover:shadow-md hover:-translate-y-0.5 dark:bg-card'
              }
            `}
          >
            {lang.flag} {lang.label}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={dialogLanguage === 'custom' ? customLanguageInput : ''}
        onChange={(e) => setCustomLanguageInput(e.target.value)}
        placeholder="기타 언어 직접 입력 (예: 스페인어)"
        className={`
          mt-2 w-full px-3 py-2 text-sm border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-primary dark:bg-card
          ${dialogLanguage === 'custom' ? 'border-primary' : 'border-border'}
        `}
        aria-label="기타 언어 입력"
      />
    </div>
  );
}
