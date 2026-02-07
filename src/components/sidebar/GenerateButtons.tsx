import { useEffect, useRef, useCallback } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { buildStoryPrompt, parseStoryResponse } from '../../prompt/storyGenerator';
import { generateTextWithProvider, abortCurrentRequest } from '../../api/factory';
import { buildPrompt } from '../../prompt/builder';
import { getLayoutForPanels } from '../../data/panelLayouts';
import { showToast } from '../common/Toast';
import { scrollToSection } from '../../hooks/useAutoScroll';

const MAX_RETRY = 1;

export default function GenerateButtons() {
  // Zustand selector optimization: individual selectors instead of full store
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const customStyleInput = useAppStore((s) => s.customStyleInput);
  const selectedPanels = useAppStore((s) => s.selectedPanels);
  const customPanelCount = useAppStore((s) => s.customPanelCount);
  const selectedTheme = useAppStore((s) => s.selectedTheme);
  const customThemeInput = useAppStore((s) => s.customThemeInput);
  const selectedStory = useAppStore((s) => s.selectedStory);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const regenerateRequested = useAppStore((s) => s.regenerateRequested);
  const activeProvider = useAppStore((s) => s.activeProvider);
  const apiKeys = useAppStore((s) => s.apiKeys);
  const selectedModels = useAppStore((s) => s.selectedModels);
  const setGeneratedStories = useAppStore((s) => s.setGeneratedStories);
  const setSelectedStory = useAppStore((s) => s.setSelectedStory);
  const setGeneratingStories = useAppStore((s) => s.setGeneratingStories);
  const clearRegenerateRequest = useAppStore((s) => s.clearRegenerateRequest);
  const addMessage = useAppStore((s) => s.addMessage);
  const isReadyToGenerate = useAppStore((s) => s.isReadyToGenerate);

  const ready = isReadyToGenerate();
  const effectivePanels = customPanelCount ?? selectedPanels;
  const prevSelectedStoryRef = useRef(selectedStory);

  // Debounce guard for generate
  const isGeneratingRef = useRef(false);

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
      scrollToSection('section-prompt', 200);
    }
    prevSelectedStoryRef.current = selectedStory;
  }, [selectedStory, selectedStyle, customStyleInput, selectedTheme, customThemeInput, effectivePanels, addMessage]);

  const handleGenerate = useCallback(async () => {
    if (!ready || isGeneratingRef.current) return;
    isGeneratingRef.current = true;

    setGeneratingStories(true);
    setSelectedStory(null);
    scrollToSection('section-stories');

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
          if (lastError.name === 'AbortError') throw lastError;
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
        return;
      }
      const message = err instanceof Error ? err.message : '스토리 생성 중 오류가 발생했습니다';
      showToast(message, 'error');
    } finally {
      setGeneratingStories(false);
      isGeneratingRef.current = false;
    }
  }, [ready, selectedStyle, customStyleInput, selectedTheme, customThemeInput, effectivePanels, activeProvider, apiKeys, selectedModels, setGeneratedStories, setSelectedStory, setGeneratingStories]);

  useEffect(() => {
    if (regenerateRequested && !isGeneratingStories) {
      clearRegenerateRequest();
      handleGenerate();
    }
  }, [regenerateRequested, isGeneratingStories, clearRegenerateRequest, handleGenerate]);

  useEffect(() => {
    return () => abortCurrentRequest();
  }, []);

  return (
    <div>
      <button
        id="btn-generate-stories"
        type="button"
        onClick={handleGenerate}
        disabled={!ready || isGeneratingStories}
        className={`
          w-full py-3.5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all
          ${
            !ready || isGeneratingStories
              ? 'bg-primary/50 cursor-not-allowed text-white'
              : 'bg-primary hover:bg-primary-dark cursor-pointer text-white shadow-[0_4px_14px_rgba(0,122,255,0.4)] hover:shadow-[0_6px_20px_rgba(0,122,255,0.5)] hover:-translate-y-0.5'
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
