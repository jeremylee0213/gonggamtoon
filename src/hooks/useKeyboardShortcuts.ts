import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const state = useAppStore.getState();

      // 1/2/3 keys to select story
      if (e.key === '1' || e.key === '2' || e.key === '3') {
        const idx = parseInt(e.key) - 1;
        const story = state.generatedStories[idx];
        if (story) {
          e.preventDefault();
          state.setSelectedStory(story);

          // Auto-copy prompt
          const prompt = state.generatedPrompts[idx];
          if (prompt && navigator.clipboard) {
            navigator.clipboard.writeText(prompt);
          }
        }
        return;
      }

      // Space to trigger generation
      if (e.key === ' ' && !state.isGeneratingStories) {
        const ready = state.isReadyToGenerate();
        if (ready) {
          e.preventDefault();
          document.getElementById('btn-generate-stories')?.click();
        }
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
