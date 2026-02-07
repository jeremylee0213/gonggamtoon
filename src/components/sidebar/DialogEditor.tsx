import { useState } from 'react';
import { Edit3, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { GeneratedStory } from '../../types';
import { showToast } from '../common/Toast';

/** Dialog editor for manual dialog editing (#26) */
interface DialogEditorProps {
  story: GeneratedStory;
  index: number;
}

export default function DialogEditor({ story, index }: DialogEditorProps) {
  const editedDialogs = useAppStore((s) => s.editedDialogs);
  const setEditedDialogs = useAppStore((s) => s.setEditedDialogs);
  const [editing, setEditing] = useState(false);
  const [drafts, setDrafts] = useState<string[]>([]);

  const currentDialogs = editedDialogs[index] ?? story.dialog;

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDrafts([...currentDialogs]);
    setEditing(true);
  };

  const save = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedDialogs(index, drafts);
    setEditing(false);
    showToast('대사가 수정되었어요! 프롬프트에 반영됩니다.', 'success');
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
        className="flex items-center gap-1 text-xs text-accent cursor-pointer hover:underline mt-1"
      >
        <Edit3 className="w-3 h-3" />
        대사 편집
        {editedDialogs[index] && <span className="text-[10px] text-warning">(수정됨)</span>}
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-1.5" onClick={(e) => e.stopPropagation()}>
      {drafts.map((d, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted w-5 shrink-0">{i + 1}</span>
          <input
            type="text"
            value={d}
            onChange={(e) => {
              const next = [...drafts];
              next[i] = e.target.value;
              setDrafts(next);
            }}
            className="flex-1 text-xs px-2 py-1 border border-border rounded-lg bg-white focus:outline-none focus:border-accent dark:bg-card"
          />
        </div>
      ))}
      <div className="flex gap-1.5 mt-1">
        <button
          type="button"
          onClick={save}
          className="flex items-center gap-1 px-2.5 py-1 text-xs bg-accent text-white rounded-lg cursor-pointer hover:opacity-90"
        >
          <Check className="w-3 h-3" />
          저장
        </button>
        <button
          type="button"
          onClick={cancel}
          className="flex items-center gap-1 px-2.5 py-1 text-xs border border-border text-muted rounded-lg cursor-pointer hover:bg-surface"
        >
          <X className="w-3 h-3" />
          취소
        </button>
      </div>
    </div>
  );
}
