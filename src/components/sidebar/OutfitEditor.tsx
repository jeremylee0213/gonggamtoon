import { useState } from 'react';
import { Shirt, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { GeneratedStory } from '../../types';
import { showToast } from '../common/Toast';

interface OutfitEditorProps {
  story: GeneratedStory;
  index: number;
}

export default function OutfitEditor({ story, index }: OutfitEditorProps) {
  const editedOutfits = useAppStore((s) => s.editedOutfits);
  const setEditedOutfits = useAppStore((s) => s.setEditedOutfits);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<string[]>([]);

  const currentOutfits = editedOutfits[index] ?? Array(story.dialog.length).fill('');

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDrafts([...currentOutfits]);
    setEditing(true);
  };

  const save = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedOutfits(index, drafts);
    setEditing(false);
    showToast('컷별 복장 설정이 저장되었어요! 프롬프트에 반영됩니다.', 'success');
  };

  const cancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={startEditing}
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-warning border border-warning/40 bg-[#FFF8EC] rounded-xl cursor-pointer hover:shadow-sm"
      >
        <Shirt className="w-4 h-4" />
        복장 편집
        {editedOutfits[index] && <span className="text-[11px] text-warning">(수정됨)</span>}
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
      {drafts.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs text-muted w-8 shrink-0">컷{i + 1}</span>
          <input
            type="text"
            value={d}
            onChange={(e) => {
              const next = [...drafts];
              next[i] = e.target.value;
              setDrafts(next);
            }}
            placeholder="예: 검정 정장 + loosen tie"
            className="flex-1 text-sm px-3 py-2 border border-border rounded-xl bg-white focus:outline-none focus:border-warning dark:bg-card"
          />
        </div>
      ))}
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={save}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-warning text-white rounded-xl cursor-pointer hover:opacity-90"
        >
          <Check className="w-4 h-4" />
          저장
        </button>
        <button
          type="button"
          onClick={cancel}
          className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border text-muted rounded-xl cursor-pointer hover:bg-surface"
        >
          <X className="w-4 h-4" />
          취소
        </button>
      </div>
    </div>
  );
}

