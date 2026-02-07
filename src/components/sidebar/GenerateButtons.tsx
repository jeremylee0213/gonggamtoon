import { useEffect, useRef, useCallback } from 'react';
import { Sparkles, Loader2, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { buildStoryPrompt, parseStoryResponse } from '../../prompt/storyGenerator';
import { generateTextWithProvider, abortCurrentRequest } from '../../api/factory';
import { buildPrompt } from '../../prompt/builder';
import { getLayoutForPanels } from '../../data/panelLayouts';
import { showToast } from '../common/Toast';
import { scrollToSection } from '../../hooks/useAutoScroll';

const MAX_RETRY = 2;
const BACKOFF_BASE_MS = 1000;

export default function GenerateButtons() {
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const customStyleInput = useAppStore((s) => s.customStyleInput);
  const selectedPanels = useAppStore((s) => s.selectedPanels);
  const customPanelCount = useAppStore((s) => s.customPanelCount);
  const selectedTheme = useAppStore((s) => s.selectedTheme);
  const customThemeInput = useAppStore((s) => s.customThemeInput);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const regenerateRequested = useAppStore((s) => s.regenerateRequested);
  const activeProvider = useAppStore((s) => s.activeProvider);
  const apiKeys = useAppStore((s) => s.apiKeys);
  const selectedModels = useAppStore((s) => s.selectedModels);
  const setGeneratedStories = useAppStore((s) => s.setGeneratedStories);
  const setGeneratedPrompts = useAppStore((s) => s.setGeneratedPrompts);
  const setSelectedStory = useAppStore((s) => s.setSelectedStory);
  const setGeneratingStories = useAppStore((s) => s.setGeneratingStories);
  const setGenerationPhase = useAppStore((s) => s.setGenerationPhase);
  const generationPhase = useAppStore((s) => s.generationPhase);
  const clearRegenerateRequest = useAppStore((s) => s.clearRegenerateRequest);
  const dialogLanguage = useAppStore((s) => s.dialogLanguage);
  const customLanguageInput = useAppStore((s) => s.customLanguageInput);
  const contentMode = useAppStore((s) => s.contentMode);
  const isReadyToGenerate = useAppStore((s) => s.isReadyToGenerate);
  const selectedKickType = useAppStore((s) => s.selectedKickType);
  const selectedNarrationStyle = useAppStore((s) => s.selectedNarrationStyle);
  const referenceText = useAppStore((s) => s.referenceText);
  const serialMode = useAppStore((s) => s.serialMode);
  const previousEpisodeSummary = useAppStore((s) => s.previousEpisodeSummary);
  const empathyIntensity = useAppStore((s) => s.empathyIntensity);
  const signature = useAppStore((s) => s.signature);

  const ready = isReadyToGenerate();
  const effectivePanels = customPanelCount ?? selectedPanels;
  const isGeneratingRef = useRef(false);

  const buildAllPrompts = useCallback((stories: import('../../types').GeneratedStory[]) => {
    const style = selectedStyle ?? {
      name: customStyleInput,
      en: customStyleInput,
      emoji: '',
      chars: ['주인공'],
    };
    const layout = getLayoutForPanels(effectivePanels);
    const themeName = selectedTheme?.name ?? customThemeInput;

    return stories.map((story) =>
      buildPrompt({
        style,
        character: story.character,
        theme: { name: themeName },
        story,
        panels: effectivePanels,
        cols: layout.cols,
        rows: layout.rows,
        dialogLanguage,
        contentMode,
        signature,
      }),
    );
  }, [selectedStyle, customStyleInput, selectedTheme, customThemeInput, effectivePanels, dialogLanguage, contentMode, signature]);

  const handleGenerate = useCallback(async () => {
    if (!ready || isGeneratingRef.current) return;
    isGeneratingRef.current = true;

    setGeneratingStories(true);
    setGenerationPhase('스토리 구상 중...');
    setSelectedStory(null);
    scrollToSection('section-stories');

    try {
      const prompt = buildStoryPrompt({
        style: selectedStyle,
        customStyleInput,
        theme: selectedTheme,
        customThemeInput,
        panelCount: effectivePanels,
        dialogLanguage,
        customLanguageInput,
        contentMode,
        selectedKickType,
        selectedNarrationStyle,
        referenceText,
        serialMode,
        previousEpisodeSummary,
        empathyIntensity,
      });

      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
        try {
          setGenerationPhase(attempt > 0 ? `재시도 중... (${attempt}/${MAX_RETRY})` : 'API 응답 대기 중...');

          const response = await generateTextWithProvider(
            activeProvider,
            prompt,
            apiKeys[activeProvider],
            selectedModels[activeProvider],
          );

          setGenerationPhase('스토리 파싱 중...');
          const stories = parseStoryResponse(response, effectivePanels);

          if (stories.length === 0) {
            throw new Error('스토리를 파싱하지 못했습니다.');
          }

          setGeneratedStories(stories);

          setGenerationPhase('프롬프트 생성 중...');
          const prompts = buildAllPrompts(stories);
          setGeneratedPrompts(prompts);

          showToast('3개 스토리와 프롬프트가 생성되었어요!', 'success');
          return;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (lastError.name === 'AbortError') throw lastError;
          if (lastError.message.includes('API') || lastError.message.includes('401') || lastError.message.includes('403')) {
            throw lastError;
          }
          if (attempt < MAX_RETRY) {
            const delay = BACKOFF_BASE_MS * Math.pow(2, attempt);
            showToast(`재시도 중... (${attempt + 1}/${MAX_RETRY}, ${delay / 1000}초 후)`, 'info');
            await new Promise((r) => setTimeout(r, delay));
          }
        }
      }

      throw lastError ?? new Error('스토리 생성 중 오류가 발생했습니다');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        showToast('생성이 취소되었어요', 'info');
        return;
      }
      const message = err instanceof Error ? err.message : '스토리 생성 중 오류가 발생했습니다';
      showToast(message, 'error');
    } finally {
      setGeneratingStories(false);
      setGenerationPhase('');
      isGeneratingRef.current = false;
    }
  }, [ready, selectedStyle, customStyleInput, selectedTheme, customThemeInput, effectivePanels, dialogLanguage, customLanguageInput, contentMode, activeProvider, apiKeys, selectedModels, setGeneratedStories, setGeneratedPrompts, setSelectedStory, setGeneratingStories, setGenerationPhase, buildAllPrompts, selectedKickType, selectedNarrationStyle, referenceText, serialMode, previousEpisodeSummary, empathyIntensity]);

  const handleCancel = useCallback(() => {
    abortCurrentRequest();
    setGeneratingStories(false);
    setGenerationPhase('');
    isGeneratingRef.current = false;
  }, [setGeneratingStories, setGenerationPhase]);

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
    <div className="space-y-2">
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

      {isGeneratingStories && (
        <>
          {generationPhase && (
            <p className="text-xs text-center text-muted animate-pulse">{generationPhase}</p>
          )}
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-2 rounded-xl text-sm text-error border border-error/30 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-error/5 transition-colors"
          >
            <X className="w-4 h-4" />
            취소
          </button>
        </>
      )}
    </div>
  );
}
