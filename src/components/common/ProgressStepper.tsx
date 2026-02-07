import { Palette, Heart, Hash, Sparkles, MousePointerClick, ClipboardCopy, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { scrollToSection } from '../../hooks/useAutoScroll';

const STEPS = [
  { id: 'section-style', icon: Palette, label: '스타일', color: 'primary' },
  { id: 'section-theme', icon: Heart, label: '주제', color: 'accent' },
  { id: 'section-generate', icon: Hash, label: '컷수', color: 'primary' },
  { id: 'btn-generate-stories', icon: Sparkles, label: '생성', color: 'warning' },
  { id: 'section-stories', icon: MousePointerClick, label: '스토리', color: 'warning' },
  { id: 'section-prompt', icon: ClipboardCopy, label: '프롬프트', color: 'success' },
] as const;

export default function ProgressStepper() {
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const customStyleInput = useAppStore((s) => s.customStyleInput);
  const selectedTheme = useAppStore((s) => s.selectedTheme);
  const customThemeInput = useAppStore((s) => s.customThemeInput);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const selectedStory = useAppStore((s) => s.selectedStory);
  const generatedPrompts = useAppStore((s) => s.generatedPrompts);

  const hasStyle = !!(selectedStyle || customStyleInput.trim());
  const hasTheme = !!(selectedTheme || customThemeInput.trim());
  const hasStories = generatedStories.length > 0;
  const hasSelectedStory = !!selectedStory;
  const hasPrompt = generatedPrompts.length > 0;

  const completedSteps = [hasStyle, hasTheme, true, hasStories, hasSelectedStory, hasPrompt];
  const currentStep = completedSteps.lastIndexOf(true);

  return (
    <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = completedSteps[i];
          const active = i === currentStep + 1 || (i === 0 && !hasStyle);
          const clickable = i <= currentStep + 1;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => clickable && scrollToSection(step.id)}
                className={`
                  flex flex-col items-center gap-1 transition-all cursor-pointer
                  ${done ? 'text-primary' : active ? 'text-primary animate-[pulse-glow_2s_ease-in-out_infinite]' : 'text-muted/40'}
                  ${clickable ? 'hover:scale-110' : 'cursor-default'}
                `}
                aria-label={step.label}
              >
                <div className={`
                  w-9 h-9 rounded-full flex items-center justify-center transition-all relative
                  ${done ? 'bg-primary text-white shadow-[0_2px_8px_rgba(0,122,255,0.3)]'
                    : active ? 'bg-primary-light text-primary border-2 border-primary'
                    : 'bg-surface text-muted/40 border border-border'}
                `}>
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-medium ${done ? 'text-primary' : active ? 'text-text' : 'text-muted/40'}`}>
                  {step.label}
                </span>
              </button>

              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 rounded-full overflow-hidden bg-border/40">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      completedSteps[i] ? 'bg-primary w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
