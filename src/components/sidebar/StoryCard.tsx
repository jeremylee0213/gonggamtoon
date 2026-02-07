import type { GeneratedStory } from '../../types';

interface StoryCardProps {
  story: GeneratedStory;
  selected: boolean;
  onSelect: () => void;
  themeName: string;
}

export default function StoryCard({ story, selected, onSelect, themeName }: StoryCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left p-3 rounded-xl cursor-pointer transition-all
        ${
          selected
            ? 'border-2 border-[#F5A623] bg-[#FFF3D6]/30 shadow-md'
            : 'border border-gray-200 hover:shadow-sm'
        }
      `}
    >
      {/* Badges */}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="bg-[#9B59B6] text-white rounded-full px-2 text-xs">
          {story.character}
        </span>
        <span className="bg-[#4A90A4] text-white rounded-full px-2 text-xs">
          {themeName}
        </span>
      </div>

      {/* Title */}
      <div className="font-bold text-sm mb-1.5">{story.title}</div>

      {/* Summary - most prominent */}
      <div className="bg-[#FFF3D6] border-l-4 border-[#F5A623] p-2 text-sm font-semibold mb-1.5 rounded-r">
        {story.summary}
      </div>

      {/* Desc + Kick */}
      <p className="text-xs text-gray-500 mb-0.5">{story.desc}</p>
      <p className="text-xs text-orange-600">{story.kick}</p>
    </button>
  );
}
