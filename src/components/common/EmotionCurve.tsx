import { memo } from 'react';

/** Mini sparkline for story emotion curve (#17) */
const PHASE_LABELS = ['기', '승', '전', '결'];

interface EmotionCurveProps {
  dialogs: string[];
}

function getEmotionValue(dialog: string, index: number, total: number): number {
  const phase = Math.floor(index / Math.ceil(total / 4));
  // Base curve: rising → peak → falling
  const baseCurve = [0.4, 0.6, 0.9, 0.5];
  let base = baseCurve[Math.min(phase, 3)];

  // Adjust by dialog content
  if (dialog.match(/[!?]{2,}/)) base = Math.min(1, base + 0.2);
  if (dialog.includes('...')) base = Math.max(0, base - 0.15);
  if (dialog.includes('ㅠ')) base = Math.max(0, base - 0.2);

  return base;
}

export default memo(function EmotionCurve({ dialogs }: EmotionCurveProps) {
  if (dialogs.length < 2) return null;

  const values = dialogs.map((d, i) => getEmotionValue(d, i, dialogs.length));
  const width = 80;
  const height = 24;
  const padding = 2;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - v * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Find peak
  const peakIdx = values.indexOf(Math.max(...values));
  const peakX = padding + (peakIdx / (values.length - 1)) * (width - padding * 2);
  const peakY = height - padding - values[peakIdx] * (height - padding * 2);

  return (
    <div className="flex items-center gap-1.5">
      <svg width={width} height={height} className="shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke="url(#curve-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={peakX} cy={peakY} r="2.5" fill="var(--color-warning)" />
        <defs>
          <linearGradient id="curve-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="50%" stopColor="var(--color-warning)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex gap-0.5 text-[9px] text-muted">
        {PHASE_LABELS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
});
