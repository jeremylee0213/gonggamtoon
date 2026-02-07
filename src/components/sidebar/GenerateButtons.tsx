import { useEffect, useRef, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { buildStoryPrompt, parseStoryResponse } from '../../prompt/storyGenerator';
import { generateTextWithProvider, abortCurrentRequest } from '../../api/factory';
import { buildPrompt } from '../../prompt/builder';
import { getLayoutForPanels } from '../../data/panelLayouts';
import { showToast } from '../common/Toast';

const MAX_RETRY = 1;

export default function GenerateButtons() {
  const store = useAppStore();
  const {
    selectedStyle,
    customStyleInput,
    selectedPanels,
    customPanelCount,
    selectedTheme,
    customThemeInput,
    selectedStory,
    isGeneratingStories,
    regenerateRequested,
    activeProvider,
    apiKeys,
    selectedModels,
    setGeneratedStories,
    setSelectedStory,
    setGeneratingStories,
    clearRegenerateRequest,
    addMessage,
    isReadyToGenerate,
  } = store;

  const ready = isReadyToGenerate();
  const effectivePanels = customPanelCount ?? selectedPanels;
  const prevSelectedStoryRef = useRef(selectedStory);

  // When a story is selected, automatically generate prompt and add to chat
  useEffect(() => {
    if (
      selectedStory &&
      selectedStory !== prevSelectedStoryRef.current
    ) {
      const style = selectedStyle ?? {
        name: customStyleInput,
        en: customStyleInput,
        emoji: '',
        chars: ['주인공'],
      };

      const layout = getLayoutForPanels(effectivePanels);
      const themeName = selectedTheme?.name ?? customThemeInput;

      const prompt = buildPrompt({
        style,
        character: selectedStory.character,
        theme: { name: themeName },
        story: selectedStory,
        panels: effectivePanels,
        cols: layout.cols,
        rows: layout.rows,
      });

      addMessage({
        role: 'user',
        content: `${style.emoji ? style.emoji + ' ' : ''}${style.name} + ${themeName} + ${selectedStory.title} (${effectivePanels}컷)`,
        type: 'text',
      });

      addMessage({
        role: 'bot',
        content: '프롬프트를 생성했어요!',
        type: 'prompt',
        prompt,
      });

      showToast('프롬프트가 생성되었어요! 복사해서 나노바나나 프로에 붙여넣으세요.', 'success');
    }
    prevSelectedStoryRef.current = selectedStory;
  }, [selectedStory, selectedStyle, customStyleInput, selectedTheme, customThemeInput, effectivePanels, addMessage]);

  const handleGenerate = useCallback(async () => {
    if (!ready) return;

    setGeneratingStories(true);
    setSelectedStory(null);

    try {
      const prompt = buildStoryPrompt({
        style: selectedStyle,
        customStyleInput,
        theme: selectedTheme,
        customThemeInput,
        panelCount: effectivePanels,
      });

      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
        try {
          const response = await generateTextWithProvider(
            activeProvider,
            prompt,
            apiKeys[activeProvider],
            selectedModels[activeProvider],
          );

          const stories = parseStoryResponse(response, effectivePanels);

          if (stories.length === 0) {
            throw new Error('스토리를 파싱하지 못했습니다.');
          }

          setGeneratedStories(stories);
          return;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          // Don't retry on abort
          if (lastError.name === 'AbortError') throw lastError;
          // Don't retry on API errors (only retry on JSON parse failures)
          if (lastError.message.includes('API') || lastError.message.includes('401') || lastError.message.includes('403')) {
            throw lastError;
          }
          if (attempt < MAX_RETRY) {
            showToast('JSON 파싱 실패, 재시도 중...', 'info');
          }
        }
      }

      throw lastError ?? new Error('스토리 생성 중 오류가 발생했습니다');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Silently ignore aborted requests
      }
      const message = err instanceof Error ? err.message : '스토리 생성 중 오류가 발생했습니다';
      showToast(message, 'error');
    } finally {
      setGeneratingStories(false);
    }
  }, [ready, selectedStyle, customStyleInput, selectedTheme, customThemeInput, effectivePanels, activeProvider, apiKeys, selectedModels, setGeneratedStories, setSelectedStory, setGeneratingStories]);

  // Listen for regenerate requests from StorySelector
  useEffect(() => {
    if (regenerateRequested && !isGeneratingStories) {
      clearRegenerateRequest();
      handleGenerate();
    }
  }, [regenerateRequested, isGeneratingStories, clearRegenerateRequest, handleGenerate]);

  // Cleanup: abort on unmount
  useEffect(() => {
    return () => abortCurrentRequest();
  }, []);

  return (
    <div className="mt-4">
      <button
        id="btn-generate-stories"
        type="button"
        onClick={handleGenerate}
        disabled={!ready || isGeneratingStories}
        className={`
          w-full py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors
          ${
            !ready || isGeneratingStories
              ? 'bg-[#F5A623] opacity-50 cursor-not-allowed text-white'
              : 'bg-[#F5A623] hover:bg-[#D4860A] cursor-pointer text-white'
          }
        `}
      >
        {isGeneratingStories ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            스토리 생성 중...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            스토리 생성
          </>
        )}
      </button>
    </div>
  );
}
