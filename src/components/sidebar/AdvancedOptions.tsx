import { useState } from 'react';
import { ChevronDown, ChevronUp, Settings2, Download, Upload } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { KICK_TYPE_OPTIONS } from '../../data/kickTypes';
import { NARRATION_STYLE_OPTIONS } from '../../data/narrationStyles';
import { showToast } from '../common/Toast';

export default function AdvancedOptions() {
  const [open, setOpen] = useState(false);
  const selectedKickType = useAppStore((s) => s.selectedKickType);
  const setSelectedKickType = useAppStore((s) => s.setSelectedKickType);
  const selectedNarrationStyle = useAppStore((s) => s.selectedNarrationStyle);
  const setSelectedNarrationStyle = useAppStore((s) => s.setSelectedNarrationStyle);
  const protagonistName = useAppStore((s) => s.protagonistName);
  const setProtagonistName = useAppStore((s) => s.setProtagonistName);
  const signature = useAppStore((s) => s.signature);
  const setSignature = useAppStore((s) => s.setSignature);
  const referenceText = useAppStore((s) => s.referenceText);
  const setReferenceText = useAppStore((s) => s.setReferenceText);
  const exportFavorites = useAppStore((s) => s.exportFavorites);
  const importFavorites = useAppStore((s) => s.importFavorites);
  const favorites = useAppStore((s) => s.favorites);

  const handleExport = () => {
    const json = exportFavorites();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gonggamtoon-favorites-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${favorites.length}개 즐겨찾기 내보내기 완료!`, 'success');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        importFavorites(text);
        showToast('즐겨찾기 가져오기 완료!', 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : '가져오기 실패', 'error');
      }
    };
    input.click();
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-base font-bold text-text">
          <Settings2 className="w-5 h-5 text-accent" />
          고급 옵션
          {!open && (selectedKickType !== 'auto' || selectedNarrationStyle !== 'auto' || protagonistName.trim()) && (
            <span className="text-xs font-normal text-accent bg-accent-light px-2 py-0.5 rounded-full">커스텀</span>
          )}
        </span>
        {open ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
          <p className="text-xs text-muted bg-accent-light/60 rounded-lg px-3 py-2">
            공감 강도는 고정으로 극한 공감 모드가 적용됩니다.
          </p>

          {/* #23: Kick Type */}
          <div>
            <label className="text-sm font-bold text-text block mb-2">반전 유형</label>
            <div className="flex flex-wrap gap-1.5">
              {KICK_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedKickType(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all border ${
                    selectedKickType === opt.key
                      ? 'border-accent bg-accent-light text-accent font-semibold'
                      : 'border-border bg-white text-text hover:shadow-sm dark:bg-card'
                  }`}
                  title={opt.desc}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* #24: Narration Style */}
          <div>
            <label className="text-sm font-bold text-text block mb-2">내레이션 스타일</label>
            <div className="flex flex-wrap gap-1.5">
              {NARRATION_STYLE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedNarrationStyle(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all border ${
                    selectedNarrationStyle === opt.key
                      ? 'border-accent bg-accent-light text-accent font-semibold'
                      : 'border-border bg-white text-text hover:shadow-sm dark:bg-card'
                  }`}
                  title={opt.desc}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* #31: Protagonist override */}
          <div>
            <label className="text-sm font-bold text-text block mb-2">주인공 이름/설정 (선택)</label>
            <input
              type="text"
              value={protagonistName}
              onChange={(e) => setProtagonistName(e.target.value)}
              placeholder="예: 민지(29세, 스타트업 디자이너)"
              className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-accent dark:bg-card"
            />
          </div>

          {/* #25: Signature */}
          <div>
            <label className="text-sm font-bold text-text block mb-2">서명 (워터마크)</label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Jeremy"
              className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-accent dark:bg-card"
            />
          </div>

          {/* #27: Reference Text */}
          <div>
            <label className="text-sm font-bold text-text block mb-2">참고 레퍼런스 (선택)</label>
            <textarea
              value={referenceText}
              onChange={(e) => setReferenceText(e.target.value)}
              placeholder="참고할 공감툰 내용이나 분위기를 입력하세요..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-border rounded-xl bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] focus:outline-none focus:border-accent dark:bg-card resize-none"
            />
          </div>

          {/* #8: Favorites export/import */}
          {favorites.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <span className="text-sm text-muted">즐겨찾기 ({favorites.length}개)</span>
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-accent border border-accent/30 rounded-lg cursor-pointer hover:bg-accent-light transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                내보내기
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-accent border border-accent/30 rounded-lg cursor-pointer hover:bg-accent-light transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                가져오기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
