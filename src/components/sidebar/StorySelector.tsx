import { RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import StoryCard from './StoryCard';

function ShimmerCard() {
  return (
    <div className="w-full p-4 rounded-2xl border border-border bg-card overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10 animate-[shimmer_1.5s_ease-in-out_infinite] bg-[length:200%_100%]" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-16 bg-border rounded-full" />
        <div className="h-5 w-14 bg-border rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-border rounded mb-3" />
      <div className="h-14 w-full bg-surface rounded-lg mb-3" />
      <div className="h-4 w-full bg-surface rounded mb-1.5" />
      <div className="h-4 w-2/3 bg-surface rounded" />
    </div>
  );
}

export default function StorySelector() {
  const generatedStories = useAppStore((s) => s.generatedStories);
  const selectedStory = useAppStore((s) => s.selectedStory);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const setSelectedStory = useAppStore((s) => s.setSelectedStory);
  const getEffectiveTheme = useAppStore((s) => s.getEffectiveTheme);
  const requestRegenerate = useAppStore((s) => s.requestRegenerate);

  const themeName = getEffectiveTheme();

  if (generatedStories.length === 0 && !isGeneratingStories) return null;

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="bg-warning text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(255,149,0,0.3)]">
          4
        </span>
        <span className="text-lg font-bold text-text">스토리 선택</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup" aria-label="스토리 선택">
        {isGeneratingStories ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : (
          generatedStories.map((story, idx) => (
            <StoryCard
              key={`${story.title}-${idx}`}
              story={story}
              selected={selectedStory?.title === story.title && selectedStory?.summary === story.summary}
              onSelect={() => setSelectedStory(story)}
              themeName={themeName}
            />
          ))
        )}
      </div>

      {!isGeneratingStories && generatedStories.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setSelectedStory(null);
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
