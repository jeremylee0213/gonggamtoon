import { useState, useCallback, memo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { showToast } from '../common/Toast';
import { copyToClipboard } from '../../utils/clipboard';
import confetti from 'canvas-confetti';
import StoryCard from './StoryCard';

const ShimmerCard = memo(function ShimmerCard() {
  return (
    <div className="w-full p-4 rounded-2xl border border-border bg-card overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10 animate-[shimmer_1.5s_ease-in-out_infinite] bg-[length:200%_100%]" />
      <div className="flex gap-2 mb-3">
        <div className="h-6 w-6 bg-border rounded-full" />
        <div className="h-5 w-14 bg-border rounded-full" />
        <div className="h-5 w-12 bg-border rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-border rounded mb-2" />
      <div className="h-4 w-full bg-surface rounded" />
    </div>
  );
});

export default function StorySelector() {
  const generatedStories = useAppStore((s) => s.generatedStories);
  const generatedPrompts = useAppStore((s) => s.generatedPrompts);
  const selectedStory = useAppStore((s) => s.selectedStory);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const setSelectedStory = useAppStore((s) => s.setSelectedStory);
  const getEffectiveTheme = useAppStore((s) => s.getEffectiveTheme);
  const requestRegenerate = useAppStore((s) => s.requestRegenerate);
  const hasEverCopied = useAppStore((s) => s.hasEverCopied);
  const markCopied = useAppStore((s) => s.markCopied);

  const themeName = getEffectiveTheme();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSelectStory = useCallback(async (story: import('../../types').GeneratedStory, index: number) => {
    setSelectedStory(story);

    const prompt = generatedPrompts[index];
    if (!prompt) return;

    try {
      await copyToClipboard(prompt);
      setCopiedIndex(index);
      showToast(`스토리 ${index + 1} 프롬프트가 복사되었어요!`, 'success');

      if (!hasEverCopied) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#4CAF50', '#00897B', '#66BB6A', '#FF8F00'],
        });
        markCopied();
      }

      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      showToast('복사에 실패했어요', 'error');
    }
  }, [generatedPrompts, setSelectedStory, hasEverCopied, markCopied]);

  if (generatedStories.length === 0 && !isGeneratingStories) return null;

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="bg-warning text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(255,143,0,0.3)]">
          4
        </span>
        <span className="text-lg font-bold text-text">스토리 선택</span>
        {!isGeneratingStories && generatedStories.length > 0 && (
          <span className="text-sm text-muted ml-1">클릭하면 프롬프트가 자동 복사돼요</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3" role="radiogroup" aria-label="스토리 선택">
        {isGeneratingStories ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : (
          generatedStories.map((story, idx) => (
            <div
              key={`${story.title}-${idx}`}
              className="animate-[flipIn_0.4s_ease-out_both]"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <StoryCard
                story={story}
                index={idx}
                selected={selectedStory?.title === story.title && selectedStory?.character === story.character}
                onSelect={() => handleSelectStory(story, idx)}
                themeName={themeName}
                copied={copiedIndex === idx}
              />
            </div>
          ))
        )}
      </div>

      {!isGeneratingStories && generatedStories.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setSelectedStory(null);
            setCopiedIndex(null);
            requestRegenerate();
          }}
          className="mt-3 flex items-center gap-2 text-sm text-muted border border-border rounded-xl px-4 py-2.5 cursor-pointer hover:bg-surface hover:shadow-sm transition-all w-full justify-center"
        >
          <RefreshCw className="w-4 h-4" />
          다시 생성
        </button>
      )}
    </div>
  );
}
