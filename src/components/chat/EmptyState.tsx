import { Palette, Heart, Sparkles, MousePointerClick, ClipboardCopy } from 'lucide-react';

const steps = [
  { icon: <Palette className="w-4 h-4" />, text: '만화 스타일 선택', desc: '46가지 스타일 중 선택' },
  { icon: <Heart className="w-4 h-4" />, text: '공감 주제 선택', desc: '20가지 주제 또는 직접 입력' },
  { icon: <Sparkles className="w-4 h-4" />, text: '스토리 생성', desc: 'AI가 4개 스토리 추천' },
  { icon: <MousePointerClick className="w-4 h-4" />, text: '스토리 선택', desc: '마음에 드는 스토리 클릭' },
  { icon: <ClipboardCopy className="w-4 h-4" />, text: '프롬프트 복사', desc: '나노바나나 프로에 붙여넣기' },
];

export default function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md animate-[fadeIn_0.5s_ease-in-out]">
        {/* Hero illustration */}
        <div className="relative inline-block mb-5">
          <div className="text-7xl animate-[bounce_2s_ease-in-out_infinite]">🍌</div>
          <div className="absolute -top-1 -right-3 text-2xl animate-[fadeIn_1s_ease-in-out]">✨</div>
        </div>

        <h2 className="text-xl font-bold text-text mb-1">공감툰 프롬프트 봇</h2>
        <p className="text-sm text-muted mb-6">
          왼쪽에서 스타일과 주제를 선택하면<br />
          공감툰 프롬프트를 자동으로 만들어 드려요.
        </p>

        {/* Steps with connecting line */}
        <div className="text-left relative">
          {/* Vertical line */}
          <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent/30 via-accent/20 to-accent/10" />

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 relative"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 text-xs font-bold z-10 border-2 border-white">
                  {i + 1}
                </div>
                <div className="pt-0.5">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-text">
                    <span className="text-accent">{step.icon}</span>
                    <span>{step.text}</span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
