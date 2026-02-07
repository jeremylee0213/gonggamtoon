import { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

const TOUR_STEPS = [
  {
    target: 'section-api',
    title: 'API 설정',
    desc: '먼저 AI 서비스의 API 키를 입력하세요. Gemini, OpenAI, Claude 중 선택할 수 있어요.',
  },
  {
    target: 'section-style',
    title: '만화 스타일 선택',
    desc: '46가지 인기 만화 스타일 중 원하는 스타일을 선택하거나 직접 입력하세요.',
  },
  {
    target: 'section-theme',
    title: '공감 주제 선택',
    desc: '20가지 공감 주제 중 선택하세요. ADHD, HSP, 번아웃 등 다양한 주제가 있어요.',
  },
  {
    target: 'section-generate',
    title: '스토리 생성',
    desc: '컷 수를 정하고 스토리 생성 버튼을 누르면 AI가 4개의 스토리를 추천해드려요.',
  },
];

const TOUR_KEY = 'gonggamtoon_tour_done';

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(TOUR_KEY, 'true');
  };

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
      const target = TOUR_STEPS[step + 1].target;
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      handleClose();
    }
  };

  if (!visible) return null;

  const current = TOUR_STEPS[step];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/30 pointer-events-auto" onClick={handleClose} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-[0_8px_40px_rgba(0,0,0,0.2)] animate-[fadeIn_0.3s_ease-in-out]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
                {step + 1}
              </span>
              <span className="text-lg font-bold text-text">{current.title}</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg hover:bg-surface cursor-pointer"
              aria-label="투어 닫기"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </div>

          <p className="text-base text-muted mb-4">{current.desc}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-primary-dark transition-colors"
            >
              {step < TOUR_STEPS.length - 1 ? '다음' : '시작하기'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
