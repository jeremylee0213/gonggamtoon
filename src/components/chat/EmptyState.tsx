import { Palette, Heart, Sparkles, MousePointerClick, ClipboardCopy } from 'lucide-react';
import { scrollToSection } from '../../hooks/useAutoScroll';

const steps = [
  { icon: <Palette className="w-5 h-5" />, text: '만화 스타일 선택', desc: '46가지 스타일 중 선택', target: 'section-style' },
  { icon: <Heart className="w-5 h-5" />, text: '공감 주제 선택', desc: '20가지 주제 또는 직접 입력', target: 'section-theme' },
  { icon: <Sparkles className="w-5 h-5" />, text: '스토리 생성', desc: 'AI가 4개 스토리 추천', target: 'section-generate' },
  { icon: <MousePointerClick className="w-5 h-5" />, text: '스토리 선택', desc: '마음에 드는 스토리 클릭', target: 'section-stories' },
  { icon: <ClipboardCopy className="w-5 h-5" />, text: '프롬프트 복사', desc: '나노바나나 프로에 붙여넣기', target: 'section-prompt' },
];

export default function EmptyState() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center max-w-lg animate-[fadeIn_0.5s_ease-in-out]">
        <div className="relative inline-block mb-6">
          <div className="text-8xl animate-[bounce_2s_ease-in-out_infinite]">🎨</div>
          <div className="absolute -top-1 -right-4 text-3xl animate-[fadeIn_1s_ease-in-out]">✨</div>
        </div>

        <h2 className="text-3xl font-bold text-text mb-2">공감툰 프롬프트 봇</h2>
        <p className="text-lg text-muted mb-8">
          왼쪽에서 스타일과 주제를 선택하면<br />
          공감툰 프롬프트를 자동으로 만들어 드려요.
        </p>

        <div className="text-left relative bg-card rounded-2xl p-6 border border-border shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="absolute left-[30px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10" />

          <div className="space-y-5">
            {steps.map((step, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSection(step.target)}
                className="flex items-start gap-4 relative w-full text-left cursor-pointer group hover:bg-primary-light/30 rounded-xl px-2 py-1.5 -mx-2 transition-colors"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold z-10 border-2 border-card group-hover:bg-primary group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <div className="pt-0.5">
                  <div className="flex items-center gap-2 text-base font-medium text-text">
                    <span className="text-primary">{step.icon}</span>
                    <span>{step.text}</span>
                  </div>
                  <p className="text-sm text-muted mt-0.5">{step.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
