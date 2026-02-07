import { lazy, Suspense } from 'react';
import ApiSettings from '../sidebar/ApiSettings';
import StyleSelector from '../sidebar/StyleSelector';
import PanelSelector from '../sidebar/PanelSelector';
import ThemeSelector from '../sidebar/ThemeSelector';
import GenerateButtons from '../sidebar/GenerateButtons';
import ProgressStepper from '../common/ProgressStepper';
import EmptyState from '../chat/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';
import MobileStickyButton from '../common/MobileStickyButton';
import { useAppStore } from '../../store/useAppStore';

const StorySelector = lazy(() => import('../sidebar/StorySelector'));
const ChatContainer = lazy(() => import('../chat/ChatContainer'));

export default function MainContent() {
  const messages = useAppStore((s) => s.messages);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const generatedStories = useAppStore((s) => s.generatedStories);
  const hasRightContent = messages.length > 0 || isGeneratingStories || generatedStories.length > 0;

  return (
    <div className="max-w-[1400px] mx-auto w-full px-6 py-6">
      <div className="mb-6">
        <ProgressStepper />
      </div>

      <div className="flex gap-6 max-lg:flex-col">
        {/* Left: Settings */}
        <aside className="w-[420px] min-w-[420px] max-lg:w-full max-lg:min-w-0 space-y-5 shrink-0">
          <section id="section-api">
            <ApiSettings />
          </section>

          <section id="section-style">
            <StyleSelector />
          </section>

          <section id="section-theme">
            <ThemeSelector />
          </section>

          <section id="section-generate" className="flex items-end gap-4">
            <div className="flex-1">
              <PanelSelector />
            </div>
            <div className="flex-1">
              <GenerateButtons />
            </div>
          </section>
        </aside>

        {/* Right: Stories + Prompts (newest first) */}
        <main className="flex-1 min-w-0 space-y-5">
          {hasRightContent ? (
            <Suspense fallback={<LoadingSpinner />}>
              <section id="section-stories">
                <StorySelector />
              </section>

              <section id="section-prompt">
                <ChatContainer />
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
