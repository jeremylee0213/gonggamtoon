import { memo } from 'react';
import { Copy, Check, Star } from 'lucide-react';
import type { GeneratedStory } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import EmotionCurve from '../common/EmotionCurve';
import DialogEditor from './DialogEditor';
import OutfitEditor from './OutfitEditor';

interface StoryCardProps {
  story: GeneratedStory;
  index: number;
  selected: boolean;
  onSelect: () => void;
  themeName: string;
  copied: boolean;
  episodeLabel?: string;
}

const CARD_COLORS = [
  { border: 'border-primary', bg: 'bg-primary', light: 'bg-primary-light/50' },
  { border: 'border-accent', bg: 'bg-accent', light: 'bg-accent-light/50' },
  { border: 'border-warning', bg: 'bg-warning', light: 'bg-[#FFF8EC]' },
];

export default memo(function StoryCard({ story, index, selected, onSelect, themeName, copied, episodeLabel }: StoryCardProps) {
  const color = CARD_COLORS[index % CARD_COLORS.length];
  const favorites = useAppStore((s) => s.favorites);
  const addFavorite = useAppStore((s) => s.addFavorite);
  const removeFavorite = useAppStore((s) => s.removeFavorite);
  const generatedPrompts = useAppStore((s) => s.generatedPrompts);

  const favEntry = favorites.find((f) => f.story.title === story.title && f.story.character === story.character);
  const isFavorited = !!favEntry;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorited && favEntry) {
      removeFavorite(favEntry.savedAt);
    } else {
      addFavorite(story, generatedPrompts[index] ?? '');
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
      className={`
        w-full text-left p-4 rounded-2xl cursor-pointer transition-all
        ${
          selected
            ? `border-2 ${color.border} ${color.light} shadow-[0_4px_16px_rgba(0,0,0,0.1)] scale-[1.02]`
            : 'border border-border bg-card hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5'
        }
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`${color.bg} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold`}>
            {index + 1}
          </span>
          <span className="bg-char text-white rounded-full px-2.5 py-0.5 text-sm font-medium">
            {story.character}
          </span>
          <span className="bg-accent text-white rounded-full px-2.5 py-0.5 text-sm font-medium">
            {themeName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            role="button"
            tabIndex={0}
            onClick={handleFavoriteClick}
            onKeyDown={(e) => { if (e.key === 'Enter') handleFavoriteClick(e as unknown as React.MouseEvent); }}
            className={`cursor-pointer transition-transform hover:scale-125 ${isFavorited ? 'text-warning' : 'text-muted/40 hover:text-warning/60'}`}
            aria-label={isFavorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <Star className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
          </span>
          {selected && (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '복사됨' : '복사하기'}
            </span>
          )}
        </div>
      </div>

      <div className="font-bold text-base mb-1 flex items-center gap-2">
        <span>{story.title}</span>
        {episodeLabel && (
          <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full">
            {episodeLabel}
          </span>
        )}
      </div>
      <p className="text-sm text-primary font-medium">{story.kick}</p>

      {story.dialog.length >= 2 && (
        <div className="mt-2">
          <EmotionCurve dialogs={story.dialog} />
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        <DialogEditor story={story} index={index} />
        <OutfitEditor story={story} index={index} />
      </div>
    </div>
  );
});
