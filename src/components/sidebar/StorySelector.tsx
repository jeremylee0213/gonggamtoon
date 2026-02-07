import { RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import StoryCard from './StoryCard';

function SkeletonCard() {
  return (
    <div className="w-full p-3 rounded-xl border border-gray-200 animate-pulse">
      <div className="flex gap-1.5 mb-2">
        <div className="h-4 w-14 bg-gray-200 rounded-full" />
        <div className="h-4 w-12 bg-gray-200 rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-12 w-full bg-gray-100 rounded mb-2" />
      <div className="h-3 w-full bg-gray-100 rounded mb-1" />
      <div className="h-3 w-2/3 bg-gray-100 rounded" />
    </div>
  );
}

export default function StorySelector() {
  const {
    generatedStories,
    selectedStory,
    isGeneratingStories,
    setSelectedStory,
    getEffectiveTheme,
    requestRegenerate,
  } = useAppStore();

  const themeName = getEffectiveTheme();

  if (generatedStories.length === 0 && !isGeneratingStories) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
          4
        </span>
        <span className="text-sm font-bold text-muted">스토리 선택</span>
      </div>

      <div className="space-y-2" role="radiogroup" aria-label="스토리 선택">
        {isGeneratingStories ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
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
          className="mt-2 flex items-center gap-1 text-xs text-muted border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 w-full justify-center"
        >
          <RefreshCw className="w-3 h-3" />
          다시 생성
        </button>
      )}
    </div>
  );
}
