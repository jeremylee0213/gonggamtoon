import { useState, useEffect, useCallback } from 'react';
import { RotateCcw, X, Sun, Moon, Monitor } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

type ThemeMode = 'light' | 'dark' | 'system';

function getSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getSavedMode(): ThemeMode {
  const saved = localStorage.getItem('gonggamtoon_theme');
  if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  return 'system';
}

export default function Header() {
  const resetFlow = useAppStore((s) => s.resetFlow);
  const messages = useAppStore((s) => s.messages);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mode, setMode] = useState<ThemeMode>(getSavedMode);

  const applyTheme = useCallback((m: ThemeMode) => {
    const isDark = m === 'dark' || (m === 'system' && getSystemDark());
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem('gonggamtoon_theme', mode);
  }, [mode, applyTheme]);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode, applyTheme]);

  const hasContent = messages.length > 0 || generatedStories.length > 0;

  const handleReset = () => {
    if (hasContent) {
      setShowConfirm(true);
    } else {
      resetFlow();
    }
  };

  const confirmReset = () => {
    resetFlow();
    setShowConfirm(false);
  };

  const cycleMode = () => {
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const modeIcon = mode === 'light' ? <Sun className="w-5 h-5" /> : mode === 'dark' ? <Moon className="w-5 h-5" /> : <Monitor className="w-5 h-5" />;
  const modeLabel = mode === 'light' ? '라이트 모드' : mode === 'dark' ? '다크 모드' : '시스템 따름';

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-border/50 h-16 flex items-center justify-between px-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]" role="banner">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-2xl mr-1.5" aria-hidden="true">🎨</span>
          공감툰 프롬프트 봇
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cycleMode}
            className="flex items-center gap-1.5 p-2 rounded-xl text-muted hover:text-text hover:bg-surface transition-all cursor-pointer"
            aria-label={modeLabel}
            title={modeLabel}
          >
            {modeIcon}
            <span className="text-xs font-medium hidden sm:inline">{modeLabel}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium text-muted hover:text-text hover:bg-surface transition-all cursor-pointer"
            aria-label="모든 설정 초기화하고 새로 시작"
          >
            <RotateCcw className="w-5 h-5" />
            새로 시작
          </button>
        </div>
      </header>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="초기화 확인">
          <div className="bg-card rounded-3xl p-8 max-w-md w-full mx-4 shadow-[0_8px_40px_rgba(0,0,0,0.15)] animate-[fadeIn_0.2s_ease-in-out]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">새로 시작할까요?</h3>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="p-2 rounded-xl hover:bg-surface cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>
            <p className="text-base text-muted mb-6">
              선택한 스타일, 주제, 생성된 스토리, 프롬프트가 모두 초기화됩니다.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-border text-base font-medium text-muted cursor-pointer hover:bg-surface transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="flex-1 py-3 rounded-xl bg-error text-white text-base font-bold cursor-pointer hover:bg-error/90 shadow-[0_2px_8px_rgba(255,59,48,0.3)] transition-all"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
