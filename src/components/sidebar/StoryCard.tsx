import { useState } from 'react';
import type { GeneratedStory } from '../../types';

interface StoryCardProps {
  story: GeneratedStory;
  selected: boolean;
  onSelect: () => void;
  themeName: string;
}

export default function StoryCard({ story, selected, onSelect, themeName }: StoryCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          w-full text-left p-4 rounded-2xl cursor-pointer transition-all
          ${
            selected
              ? 'border-2 border-primary bg-primary-light/50 shadow-[0_4px_16px_rgba(0,122,255,0.15)] scale-[1.02]'
              : 'border border-border bg-card hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5'
          }
        `}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-char text-white rounded-full px-2.5 py-0.5 text-sm font-medium">
            {story.character}
          </span>
          <span className="bg-accent text-white rounded-full px-2.5 py-0.5 text-sm font-medium">
            {themeName}
          </span>
        </div>

        <div className="font-bold text-base mb-2">{story.title}</div>

        <div className="bg-primary-light border-l-4 border-primary p-3 text-base font-semibold mb-2 rounded-r-lg">
          {story.summary}
        </div>

        <p className="text-sm text-muted mb-1 line-clamp-2">{story.desc}</p>
        <p className="text-sm text-primary font-medium">{story.kick}</p>
      </button>

      {/* Hover preview tooltip */}
      {hovered && !selected && (
        <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-card border border-border rounded-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] pointer-events-none animate-[fadeIn_0.15s_ease-in-out]">
          <p className="text-sm font-bold text-text mb-1">{story.title}</p>
          <p className="text-xs text-muted mb-2">{story.desc}</p>
          <div className="text-xs text-primary font-medium">{story.kick}</div>
        </div>
      )}
    </div>
  );
}
