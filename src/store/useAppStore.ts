import { create } from 'zustand';
import type { ChatMessage, GeneratedStory, ProviderType, Style, ThemeMeta } from '../types';
import { defaultModels, providerModels } from '../data/models';
import { DEFAULT_PANELS } from '../data/panelLayouts';
import { getApiKey, setApiKey as saveApiKey } from '../utils/storage';

const MAX_MESSAGES = 50;

export type DialogLanguage = 'ko' | 'en' | 'ja' | 'zh' | 'custom';
export type ContentMode = 'kids' | '15' | '19' | '49';

interface AppState {
  // 선택 상태
  selectedStyle: Style | null;
  customStyleInput: string;
  selectedPanels: number;
  customPanelCount: number | null;
  selectedTheme: ThemeMeta | null;
  customThemeInput: string;
  dialogLanguage: DialogLanguage;
  customLanguageInput: string;
  contentMode: ContentMode;

  // 고급 옵션 (#23, #24, #25, #27, #29, #30)
  selectedKickType: string;
  selectedNarrationStyle: string;
  signature: string;
  referenceText: string;
  serialMode: boolean;
  previousEpisodeSummary: string;
  empathyIntensity: number;

  // 스토리 생성 상태
  generatedStories: GeneratedStory[];
  generatedPrompts: string[];
  selectedStory: GeneratedStory | null;
  isGeneratingStories: boolean;
  regenerateRequested: boolean;
  generationPhase: string; // #12 progress phase

  // 대사 편집 (#26)
  editedDialogs: Record<number, string[]>;

  // 복사 추적 (#13)
  hasEverCopied: boolean;

  // API 상태
  activeProvider: ProviderType;
  apiKeys: Record<ProviderType, string>;
  selectedModels: Record<ProviderType, string>;

  // 즐겨찾기
  favorites: { story: GeneratedStory; prompt: string; savedAt: number }[];

  // 채팅 상태
  messages: ChatMessage[];

  // 액션 - 선택
  setStyle: (style: Style | null) => void;
  setCustomStyleInput: (text: string) => void;
  setPanels: (panels: number) => void;
  setCustomPanelCount: (count: number | null) => void;
  setTheme: (theme: ThemeMeta | null) => void;
  setCustomThemeInput: (text: string) => void;
  setDialogLanguage: (lang: DialogLanguage) => void;
  setCustomLanguageInput: (text: string) => void;
  setContentMode: (mode: ContentMode) => void;

  // 액션 - 고급 옵션
  setSelectedKickType: (type: string) => void;
  setSelectedNarrationStyle: (style: string) => void;
  setSignature: (name: string) => void;
  setReferenceText: (text: string) => void;
  setSerialMode: (on: boolean) => void;
  setPreviousEpisodeSummary: (text: string) => void;
  setEmpathyIntensity: (level: number) => void;

  // 액션 - 스토리
  setGeneratedStories: (stories: GeneratedStory[]) => void;
  setGeneratedPrompts: (prompts: string[]) => void;
  setSelectedStory: (story: GeneratedStory | null) => void;
  setGeneratingStories: (loading: boolean) => void;
  setGenerationPhase: (phase: string) => void;
  requestRegenerate: () => void;
  clearRegenerateRequest: () => void;

  // 액션 - 대사 편집
  setEditedDialogs: (index: number, dialogs: string[]) => void;
  clearEditedDialogs: () => void;

  // 액션 - 복사 추적
  markCopied: () => void;

  // 액션 - 즐겨찾기
  addFavorite: (story: GeneratedStory, prompt: string) => void;
  removeFavorite: (savedAt: number) => void;
  exportFavorites: () => string;
  importFavorites: (json: string) => void;

  // 액션 - API
  setActiveProvider: (provider: ProviderType) => void;
  setApiKey: (provider: ProviderType, key: string) => void;
  setSelectedModel: (provider: ProviderType, model: string) => void;

  // 액션 - 채팅
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // 액션 - 리셋
  resetFlow: () => void;

  // 헬퍼
  getEffectiveStyle: () => string;
  getEffectiveTheme: () => string;
  isReadyToGenerate: () => boolean;
  hasActiveApiKey: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedStyle: null,
  customStyleInput: '',
  selectedPanels: DEFAULT_PANELS,
  customPanelCount: null,
  selectedTheme: null,
  customThemeInput: '',
  dialogLanguage: 'ko',
  customLanguageInput: '',
  contentMode: '19',

  // 고급 옵션
  selectedKickType: 'auto',
  selectedNarrationStyle: 'auto',
  signature: (() => localStorage.getItem('gonggamtoon_signature') ?? 'Jeremy')(),
  referenceText: '',
  serialMode: false,
  previousEpisodeSummary: '',
  empathyIntensity: 3,

  generatedStories: [],
  generatedPrompts: [],
  selectedStory: null,
  isGeneratingStories: false,
  regenerateRequested: false,
  generationPhase: '',

  editedDialogs: {},
  hasEverCopied: false,

  activeProvider: 'openai',
  apiKeys: {
    gemini: getApiKey('gemini'),
    openai: getApiKey('openai'),
    claude: getApiKey('claude'),
  },
  selectedModels: { ...defaultModels },

  favorites: (() => {
    try {
      const raw = localStorage.getItem('gonggamtoon_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })(),

  messages: [],

  setStyle: (style) => set({ selectedStyle: style, customStyleInput: '', generatedStories: [], generatedPrompts: [], selectedStory: null, editedDialogs: {} }),
  setCustomStyleInput: (text) => set({ customStyleInput: text, selectedStyle: null, generatedStories: [], generatedPrompts: [], selectedStory: null, editedDialogs: {} }),
  setPanels: (panels) => set({ selectedPanels: panels, customPanelCount: null, generatedStories: [], generatedPrompts: [], selectedStory: null, editedDialogs: {} }),
  setCustomPanelCount: (count) => set({ customPanelCount: count, generatedStories: [], generatedPrompts: [], selectedStory: null, editedDialogs: {} }),
  setTheme: (theme) => set({ selectedTheme: theme, customThemeInput: '', generatedStories: [], generatedPrompts: [], selectedStory: null, editedDialogs: {} }),
  setCustomThemeInput: (text) => set({ customThemeInput: text, selectedTheme: null, generatedStories: [], generatedPrompts: [], selectedStory: null, editedDialogs: {} }),
  setDialogLanguage: (lang) => set({ dialogLanguage: lang, customLanguageInput: '', generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setCustomLanguageInput: (text) => set({ customLanguageInput: text, dialogLanguage: 'custom', generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setContentMode: (mode) => set({ contentMode: mode, generatedStories: [], generatedPrompts: [], selectedStory: null }),

  // 고급 옵션 액션
  setSelectedKickType: (type) => set({ selectedKickType: type }),
  setSelectedNarrationStyle: (style) => set({ selectedNarrationStyle: style }),
  setSignature: (name) => {
    localStorage.setItem('gonggamtoon_signature', name);
    set({ signature: name });
  },
  setReferenceText: (text) => set({ referenceText: text }),
  setSerialMode: (on) => set({ serialMode: on }),
  setPreviousEpisodeSummary: (text) => set({ previousEpisodeSummary: text }),
  setEmpathyIntensity: (level) => set({ empathyIntensity: Math.max(1, Math.min(5, level)) }),

  setGeneratedStories: (stories) => set({ generatedStories: stories, selectedStory: null, generatedPrompts: [], editedDialogs: {} }),
  setGeneratedPrompts: (prompts) => set({ generatedPrompts: prompts }),
  setSelectedStory: (story) => set({ selectedStory: story }),
  setGeneratingStories: (loading) => set({ isGeneratingStories: loading, generationPhase: loading ? 'API 요청 중...' : '' }),
  setGenerationPhase: (phase) => set({ generationPhase: phase }),
  requestRegenerate: () => set({ regenerateRequested: true }),
  clearRegenerateRequest: () => set({ regenerateRequested: false }),

  // 대사 편집
  setEditedDialogs: (index, dialogs) => set((state) => ({
    editedDialogs: { ...state.editedDialogs, [index]: dialogs },
  })),
  clearEditedDialogs: () => set({ editedDialogs: {} }),

  // 복사 추적
  markCopied: () => set({ hasEverCopied: true }),

  addFavorite: (story, prompt) => {
    set((state) => {
      const updated = [...state.favorites, { story, prompt, savedAt: Date.now() }].slice(-20);
      localStorage.setItem('gonggamtoon_favorites', JSON.stringify(updated));
      return { favorites: updated };
    });
  },
  removeFavorite: (savedAt) => {
    set((state) => {
      const updated = state.favorites.filter((f) => f.savedAt !== savedAt);
      localStorage.setItem('gonggamtoon_favorites', JSON.stringify(updated));
      return { favorites: updated };
    });
  },
  exportFavorites: () => {
    const { favorites } = get();
    return JSON.stringify(favorites, null, 2);
  },
  importFavorites: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');
      const valid = parsed.filter((f: { story?: unknown; prompt?: unknown; savedAt?: unknown }) =>
        f.story && typeof f.prompt === 'string' && typeof f.savedAt === 'number'
      );
      localStorage.setItem('gonggamtoon_favorites', JSON.stringify(valid.slice(-20)));
      set({ favorites: valid.slice(-20) });
    } catch {
      throw new Error('즐겨찾기 데이터 형식이 올바르지 않습니다.');
    }
  },

  setActiveProvider: (provider) => set({ activeProvider: provider }),
  setApiKey: (provider, key) => {
    saveApiKey(provider, key);
    set((state) => ({ apiKeys: { ...state.apiKeys, [provider]: key } }));
  },
  setSelectedModel: (provider, model) => {
    const models = providerModels[provider];
    if (models.some((m) => m.id === model)) {
      set((state) => ({ selectedModels: { ...state.selectedModels, [provider]: model } }));
    }
  },

  addMessage: (message) =>
    set((state) => {
      const newMessages = [
        ...state.messages,
        { ...message, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: Date.now() },
      ];
      return { messages: newMessages.length > MAX_MESSAGES ? newMessages.slice(-MAX_MESSAGES) : newMessages };
    }),
  clearMessages: () => set({ messages: [] }),

  resetFlow: () => set({
    selectedStyle: null,
    customStyleInput: '',
    selectedPanels: DEFAULT_PANELS,
    customPanelCount: null,
    selectedTheme: null,
    customThemeInput: '',
    dialogLanguage: 'ko',
    customLanguageInput: '',
    contentMode: '19',
    selectedKickType: 'auto',
    selectedNarrationStyle: 'auto',
    referenceText: '',
    serialMode: false,
    previousEpisodeSummary: '',
    empathyIntensity: 3,
    generatedStories: [],
    generatedPrompts: [],
    selectedStory: null,
    isGeneratingStories: false,
    regenerateRequested: false,
    generationPhase: '',
    editedDialogs: {},
    messages: [],
  }),

  getEffectiveStyle: () => {
    const s = get();
    return s.selectedStyle?.name ?? s.customStyleInput;
  },
  getEffectiveTheme: () => {
    const s = get();
    return s.selectedTheme?.name ?? s.customThemeInput;
  },
  isReadyToGenerate: () => {
    const s = get();
    const hasStyle = !!(s.selectedStyle || s.customStyleInput.trim());
    const hasTheme = !!(s.selectedTheme || s.customThemeInput.trim());
    const hasApiKey = !!s.apiKeys[s.activeProvider];
    return hasStyle && hasTheme && hasApiKey;
  },
  hasActiveApiKey: () => {
    const s = get();
    return !!s.apiKeys[s.activeProvider];
  },
}));
