import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Header() {
  const resetFlow = useAppStore((s) => s.resetFlow);
  const messages = useAppStore((s) => s.messages);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const [showConfirm, setShowConfirm] = useState(false);

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
      <header className="bg-white border-b border-gray-200 shadow-sm h-14 flex items-center justify-between px-6" role="banner">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-xl mr-1" aria-hidden="true">🍌</span>
          나노바나나 프로 공감툰 프롬프트 봇
        </h1>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-text hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="모든 설정 초기화하고 새로 시작"
        >
          <RotateCcw className="w-4 h-4" />
          새로 시작
        </button>
      </header>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-label="초기화 확인">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl animate-[fadeIn_0.2s_ease-in-out]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-text">새로 시작할까요?</h3>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                aria-label="닫기"
              >
                <X className="w-4 h-4 text-muted" />
              </button>
            </div>
            <p className="text-sm text-muted mb-5">
              선택한 스타일, 주제, 생성된 스토리, 프롬프트가 모두 초기화됩니다.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-muted cursor-pointer hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmReset}
                className="flex-1 py-2 rounded-lg bg-error text-white text-sm font-bold cursor-pointer hover:bg-error/90"
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
