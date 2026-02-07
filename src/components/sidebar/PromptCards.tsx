import { useState } from 'react';
import { Copy, Check, Columns2, List } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { showToast } from '../common/Toast';
import confetti from 'canvas-confetti';

const PROMPT_COLORS = [
  { border: 'border-primary', bg: 'bg-primary', light: 'bg-primary-light/30', text: 'text-primary', label: '스토리 1' },
  { border: 'border-accent', bg: 'bg-accent', light: 'bg-accent-light/30', text: 'text-accent', label: '스토리 2' },
  { border: 'border-warning', bg: 'bg-warning', light: 'bg-[#FFF8EC]', text: 'text-warning', label: '스토리 3' },
];

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

type ViewMode = 'list' | 'compare';

export default function PromptCards() {
  const generatedPrompts = useAppStore((s) => s.generatedPrompts);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [compareTab, setCompareTab] = useState(0);

  if (generatedPrompts.length === 0) return null;

  const handleCopy = async (prompt: string, index: number) => {
    try {
      await copyToClipboard(prompt);
      setCopiedIndex(index);
      showToast(`프롬프트 ${index + 1} 복사 완료!`, 'success');

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#007AFF', '#5856D6', '#34C759', '#FF9500'],
      });

      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      showToast('복사에 실패했어요', 'error');
    }
  };

  const renderCard = (prompt: string, idx: number, forceExpanded = false) => {
    const color = PROMPT_COLORS[idx % PROMPT_COLORS.length];
    const story = generatedStories[idx];
    const isCopied = copiedIndex === idx;
    const isExpanded = forceExpanded || expandedIndex === idx;

    return (
      <div
        key={idx}
        className={`rounded-2xl border-2 ${color.border} ${color.light} overflow-hidden transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`${color.bg} text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold`}>
              {idx + 1}
            </span>
            <span className="font-bold text-base text-text">
              {story?.title ?? color.label}
            </span>
            {story && (
              <span className="text-sm text-muted">— {story.character}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(prompt, idx)}
            className={`
              flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-bold cursor-pointer transition-all
              ${isCopied
                ? 'bg-success text-white'
                : `${color.bg} text-white hover:opacity-90 shadow-sm hover:shadow-md hover:-translate-y-0.5`
              }
            `}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {isCopied ? '복사됨' : '복사'}
          </button>
        </div>

        <div className="px-4 pb-3">
          {forceExpanded ? (
            <pre className="text-sm text-text/80 whitespace-pre-wrap font-sans leading-relaxed">
              {prompt}
            </pre>
          ) : (
            <button
              type="button"
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              className="w-full text-left cursor-pointer"
            >
              <pre className={`text-sm text-text/80 whitespace-pre-wrap font-sans leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
                {prompt}
              </pre>
              <span className={`text-xs ${color.text} font-medium mt-1 inline-block`}>
                {isExpanded ? '접기 ▲' : '전체 보기 ▼'}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="bg-success text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-[0_2px_6px_rgba(52,199,89,0.3)]">
            5
          </span>
          <span className="text-lg font-bold text-text">생성된 프롬프트</span>
        </div>
        <div className="flex items-center gap-1 bg-surface rounded-xl p-1">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
              viewMode === 'list' ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            <List className="w-4 h-4" />
            전체
          </button>
          <button
            type="button"
            onClick={() => setViewMode('compare')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all ${
              viewMode === 'compare' ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            <Columns2 className="w-4 h-4" />
            비교
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-3">
          {generatedPrompts.map((prompt, idx) => renderCard(prompt, idx))}
        </div>
      ) : (
        <div>
          {/* Compare tabs */}
          <div className="flex gap-1 mb-3">
            {generatedPrompts.map((_, idx) => {
              const color = PROMPT_COLORS[idx % PROMPT_COLORS.length];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCompareTab(idx)}
                  className={`
                    flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all
                    ${compareTab === idx
                      ? `${color.bg} text-white shadow-md`
                      : 'bg-surface text-muted hover:bg-surface/80'
                    }
                  `}
                >
                  {generatedStories[idx]?.title ?? `스토리 ${idx + 1}`}
                </button>
              );
            })}
          </div>
          {renderCard(generatedPrompts[compareTab], compareTab, true)}
        </div>
      )}
    </div>
  );
}
