import { useState, useEffect } from 'react';
import { RotateCcw, X, Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Header() {
  const resetFlow = useAppStore((s) => s.resetFlow);
  const messages = useAppStore((s) => s.messages);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('gonggamtoon_dark') === 'true' ||
      (!localStorage.getItem('gonggamtoon_dark') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('gonggamtoon_dark', String(dark));
  }, [dark]);

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

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-border/50 h-16 flex items-center justify-between px-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]" role="banner">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-2xl mr-1.5" aria-hidden="true">🍌</span>
          공감툰 프롬프트 봇
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDark(!dark)}
            className="p-2 rounded-xl text-muted hover:text-text hover:bg-surface transition-all cursor-pointer"
            aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
