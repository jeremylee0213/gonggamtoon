import { useState } from 'react';
import { Edit3, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { GeneratedStory } from '../../types';
import { showToast } from '../common/toastBus';

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
        className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-accent border border-accent/40 bg-accent-light rounded-xl cursor-pointer hover:shadow-sm"
      >
        <Edit3 className="w-4 h-4" />
        대사 편집
        {editedDialogs[index] && <span className="text-[11px] text-warning">(수정됨)</span>}
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
            className="flex-1 text-sm px-3 py-2 border border-border rounded-xl bg-white focus:outline-none focus:border-accent dark:bg-card"
          />
        </div>
      ))}
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={save}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-accent text-white rounded-xl cursor-pointer hover:opacity-90"
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
