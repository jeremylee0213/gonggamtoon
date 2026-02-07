import { Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { scrollToSection } from '../../hooks/useAutoScroll';

export default function MobileStickyButton() {
  const isReadyToGenerate = useAppStore((s) => s.isReadyToGenerate);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const ready = isReadyToGenerate();

  if (!ready && !isGeneratingStories) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden">
      <button
        type="button"
        onClick={() => scrollToSection('btn-generate-stories')}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold text-base shadow-[0_4px_20px_rgba(0,122,255,0.4)] hover:shadow-[0_6px_24px_rgba(0,122,255,0.5)] transition-all cursor-pointer animate-[fadeIn_0.3s_ease-in-out]"
      >
        {isGeneratingStories ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            생성 중...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            스토리 생성하기
          </>
        )}
      </button>
    </div>
  );
}
