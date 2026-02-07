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

  // 스토리 생성 상태
  generatedStories: GeneratedStory[];
  generatedPrompts: string[];
  selectedStory: GeneratedStory | null;
  isGeneratingStories: boolean;
  regenerateRequested: boolean;

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

  // 액션 - 스토리
  setGeneratedStories: (stories: GeneratedStory[]) => void;
  setGeneratedPrompts: (prompts: string[]) => void;
  setSelectedStory: (story: GeneratedStory | null) => void;
  setGeneratingStories: (loading: boolean) => void;
  requestRegenerate: () => void;
  clearRegenerateRequest: () => void;

  // 액션 - 즐겨찾기
  addFavorite: (story: GeneratedStory, prompt: string) => void;
  removeFavorite: (savedAt: number) => void;

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

  generatedStories: [],
  generatedPrompts: [],
  selectedStory: null,
  isGeneratingStories: false,
  regenerateRequested: false,

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

  setStyle: (style) => set({ selectedStyle: style, customStyleInput: '', generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setCustomStyleInput: (text) => set({ customStyleInput: text, selectedStyle: null, generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setPanels: (panels) => set({ selectedPanels: panels, customPanelCount: null, generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setCustomPanelCount: (count) => set({ customPanelCount: count, generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setTheme: (theme) => set({ selectedTheme: theme, customThemeInput: '', generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setCustomThemeInput: (text) => set({ customThemeInput: text, selectedTheme: null, generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setDialogLanguage: (lang) => set({ dialogLanguage: lang, customLanguageInput: '', generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setCustomLanguageInput: (text) => set({ customLanguageInput: text, dialogLanguage: 'custom', generatedStories: [], generatedPrompts: [], selectedStory: null }),
  setContentMode: (mode) => set({ contentMode: mode, generatedStories: [], generatedPrompts: [], selectedStory: null }),

  setGeneratedStories: (stories) => set({ generatedStories: stories, selectedStory: null, generatedPrompts: [] }),
  setGeneratedPrompts: (prompts) => set({ generatedPrompts: prompts }),
  setSelectedStory: (story) => set({ selectedStory: story }),
  setGeneratingStories: (loading) => set({ isGeneratingStories: loading }),
  requestRegenerate: () => set({ regenerateRequested: true }),
  clearRegenerateRequest: () => set({ regenerateRequested: false }),

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

  setActiveProvider: (provider) => set({ activeProvider: provider }),
  setApiKey: (provider, key) => {
    saveApiKey(provider, key);
    set((state) => ({ apiKeys: { ...state.apiKeys, [provider]: key } }));
  },
  setSelectedModel: (provider, model) => {
    // Validate model exists for provider
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
      // Cap messages to prevent memory issues
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
    generatedStories: [],
    generatedPrompts: [],
    selectedStory: null,
    isGeneratingStories: false,
    regenerateRequested: false,
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
