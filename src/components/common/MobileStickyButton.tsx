import { useState } from 'react';
import { Sparkles, Loader2, ChevronUp, X, Copy, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { scrollToSection } from '../../hooks/useAutoScroll';
import { showToast } from './Toast';

const PROMPT_COLORS = [
  { bg: 'bg-primary', label: '스토리 1' },
  { bg: 'bg-accent', label: '스토리 2' },
  { bg: 'bg-warning', label: '스토리 3' },
];

export default function MobileStickyButton() {
  const isReadyToGenerate = useAppStore((s) => s.isReadyToGenerate);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const generatedPrompts = useAppStore((s) => s.generatedPrompts);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const ready = isReadyToGenerate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const hasPrompts = generatedPrompts.length > 0;

  const handleCopy = async (prompt: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIdx(idx);
      showToast(`프롬프트 ${idx + 1} 복사!`, 'success');
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      showToast('복사 실패', 'error');
    }
  };

  if (!ready && !isGeneratingStories && !hasPrompts) return null;

  return (
    <>
      {/* Bottom sheet overlay */}
      {sheetOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Bottom sheet */}
      {sheetOpen && hasPrompts && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.15)] max-h-[70vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card rounded-t-3xl">
            <span className="font-bold text-lg">프롬프트 ({generatedPrompts.length})</span>
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="p-2 rounded-xl hover:bg-surface cursor-pointer"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {generatedPrompts.map((prompt, idx) => {
              const color = PROMPT_COLORS[idx % PROMPT_COLORS.length];
              const story = generatedStories[idx];
              const isCopied = copiedIdx === idx;
              return (
                <div key={idx} className="bg-surface rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`${color.bg} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-sm">{story?.title ?? color.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(prompt, idx)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        isCopied ? 'bg-success text-white' : `${color.bg} text-white`
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? '복사됨' : '복사'}
                    </button>
                  </div>
                  <pre className="text-xs text-text/70 whitespace-pre-wrap font-sans leading-relaxed line-clamp-4">
                    {prompt}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky bottom buttons */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden flex items-center gap-2">
        {hasPrompts && (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-card text-text border border-border rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
            프롬프트 보기
          </button>
        )}
        <button
          type="button"
          onClick={() => scrollToSection('btn-generate-stories')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-[0_4px_20px_rgba(76,175,80,0.4)] hover:shadow-[0_6px_24px_rgba(76,175,80,0.5)] transition-all cursor-pointer animate-[fadeIn_0.3s_ease-in-out]"
        >
          {isGeneratingStories ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              스토리 생성
            </>
          )}
        </button>
      </div>
    </>
  );
}
