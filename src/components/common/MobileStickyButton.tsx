import { useState } from 'react';
import { Sparkles, Loader2, ChevronUp, X, Copy, Check, Palette, Heart, Hash } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { scrollToSection } from '../../hooks/useAutoScroll';
import { showToast } from './Toast';

const PROMPT_COLORS = [
  { bg: 'bg-primary', label: '스토리 1' },
  { bg: 'bg-accent', label: '스토리 2' },
  { bg: 'bg-warning', label: '스토리 3' },
];

const NAV_ITEMS = [
  { id: 'section-style', icon: Palette, label: '스타일' },
  { id: 'section-theme', icon: Heart, label: '주제' },
  { id: 'section-generate', icon: Hash, label: '컷수' },
];

export default function MobileStickyButton() {
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const generatedPrompts = useAppStore((s) => s.generatedPrompts);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const selectedThemes = useAppStore((s) => s.selectedThemes);
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

      {/* Mobile bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-card/95 backdrop-blur-lg border-t border-border safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {/* Quick nav buttons */}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.id === 'section-style' && !!selectedStyle) ||
              (item.id === 'section-theme' && selectedThemes.length > 0);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                  isActive ? 'text-primary' : 'text-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* Prompt sheet button */}
          {hasPrompts && (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl cursor-pointer text-accent transition-all"
            >
              <ChevronUp className="w-5 h-5" />
              <span className="text-[10px] font-medium">프롬프트</span>
            </button>
          )}

          {/* Generate button */}
          <button
            type="button"
            onClick={() => scrollToSection('btn-generate-stories')}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-full font-bold text-sm shadow-[0_2px_12px_rgba(0,122,255,0.4)] cursor-pointer transition-all"
          >
            {isGeneratingStories ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                생성 중
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                생성
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
