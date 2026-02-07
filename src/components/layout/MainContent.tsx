import { lazy, Suspense } from 'react';
import ApiSettings from '../sidebar/ApiSettings';
import StyleSelector from '../sidebar/StyleSelector';
import PanelSelector from '../sidebar/PanelSelector';
import ThemeSelector from '../sidebar/ThemeSelector';
import LanguageSelector from '../sidebar/LanguageSelector';
import ModeSelector from '../sidebar/ModeSelector';
import GenerateButtons from '../sidebar/GenerateButtons';
import AdvancedOptions from '../sidebar/AdvancedOptions';
import ProgressStepper from '../common/ProgressStepper';
import SettingsSummaryBar from '../common/SettingsSummaryBar';
import EmptyState from '../chat/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import MobileStickyButton from '../common/MobileStickyButton';
import { useAppStore } from '../../store/useAppStore';

const StorySelector = lazy(() => import('../sidebar/StorySelector'));
const PromptCards = lazy(() => import('../sidebar/PromptCards'));

export default function MainContent() {
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const generatedPrompts = useAppStore((s) => s.generatedPrompts);
  const hasRightContent = isGeneratingStories || generatedStories.length > 0 || generatedPrompts.length > 0;

  return (
    <div className="max-w-[1400px] mx-auto w-full px-4 py-3">
      <div className="mb-3">
        <ProgressStepper />
      </div>

      <SettingsSummaryBar />

      <div className="flex gap-4 max-lg:flex-col">
        {/* Left: Settings */}
        <aside className="w-[380px] min-w-[380px] max-lg:w-full max-lg:min-w-0 space-y-3 shrink-0">
          <section id="section-api">
            <ApiSettings />
          </section>

          <section id="section-style">
            <StyleSelector />
          </section>

          <section id="section-theme">
            <ThemeSelector />
          </section>

          {/* Language + Panels + Mode: single compact row */}
          <section className="bg-card border border-border rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-center">
              <LanguageSelector />
              <PanelSelector />
              <ModeSelector />
            </div>
          </section>

          <section id="section-generate">
            <GenerateButtons />
          </section>

          <section>
            <AdvancedOptions />
          </section>
        </aside>

        {/* Right: Stories + Prompts */}
        <main className="flex-1 min-w-0 space-y-4">
          {hasRightContent ? (
            <Suspense fallback={<LoadingSpinner />}>
              <section id="section-stories">
                <StorySelector />
              </section>

              <section id="section-prompts">
                <PromptCards />
              </section>
            </Suspense>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      <MobileStickyButton />
    </div>
  );
}
