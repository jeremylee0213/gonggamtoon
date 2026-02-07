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
  const dialogLanguage = useAppStore((s) => s.dialogLanguage);
  const customLanguageInput = useAppStore((s) => s.customLanguageInput);
  const setDialogLanguage = useAppStore((s) => s.setDialogLanguage);
  const setCustomLanguageInput = useAppStore((s) => s.setCustomLanguageInput);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          4
        </span>
        <span className="text-sm font-bold text-text shrink-0">대사 언어</span>
        <select
          value={dialogLanguage}
          onChange={(e) => setDialogLanguage(e.target.value as DialogLanguage)}
          className="min-w-0 flex-1 px-2.5 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:border-primary dark:bg-card"
          aria-label="대사 언어 선택"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.key} value={lang.key}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>
      </div>

      {dialogLanguage === 'custom' && (
        <input
          type="text"
          value={customLanguageInput}
          onChange={(e) => setCustomLanguageInput(e.target.value)}
          placeholder="기타 언어 입력 (예: 스페인어)"
          className="w-full px-3 py-1.5 text-sm border border-primary rounded-lg bg-white focus:outline-none focus:border-primary dark:bg-card"
          aria-label="기타 언어 입력"
        />
      )}
    </div>
  );
}
