import { create } from 'zustand';
import type { ChatMessage, GeneratedStory, ProviderType, Style, ThemeMeta } from '../types';
import { defaultModels, providerModels } from '../data/models';
import { DEFAULT_PANELS } from '../data/panelLayouts';
import { getApiKey, setApiKey as saveApiKey } from '../utils/storage';

const MAX_MESSAGES = 50;

interface AppState {
  // 선택 상태
  selectedStyle: Style | null;
  customStyleInput: string;
  selectedPanels: number;
  customPanelCount: number | null;
  selectedTheme: ThemeMeta | null;
  customThemeInput: string;

  // 스토리 생성 상태
  generatedStories: GeneratedStory[];
  selectedStory: GeneratedStory | null;
  isGeneratingStories: boolean;
  regenerateRequested: boolean;

  // API 상태
  activeProvider: ProviderType;
  apiKeys: Record<ProviderType, string>;
  selectedModels: Record<ProviderType, string>;

  // 채팅 상태
  messages: ChatMessage[];

  // 액션 - 선택
  setStyle: (style: Style | null) => void;
  setCustomStyleInput: (text: string) => void;
  setPanels: (panels: number) => void;
  setCustomPanelCount: (count: number | null) => void;
  setTheme: (theme: ThemeMeta | null) => void;
  setCustomThemeInput: (text: string) => void;

  // 액션 - 스토리
  setGeneratedStories: (stories: GeneratedStory[]) => void;
  setSelectedStory: (story: GeneratedStory | null) => void;
  setGeneratingStories: (loading: boolean) => void;
  requestRegenerate: () => void;
  clearRegenerateRequest: () => void;

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

  generatedStories: [],
  selectedStory: null,
  isGeneratingStories: false,
  regenerateRequested: false,

  activeProvider: 'gemini',
  apiKeys: {
    gemini: getApiKey('gemini'),
    openai: getApiKey('openai'),
    claude: getApiKey('claude'),
  },
  selectedModels: { ...defaultModels },

  messages: [],

  setStyle: (style) => set({ selectedStyle: style, customStyleInput: '', generatedStories: [], selectedStory: null }),
  setCustomStyleInput: (text) => set({ customStyleInput: text, selectedStyle: null, generatedStories: [], selectedStory: null }),
  setPanels: (panels) => set({ selectedPanels: panels, customPanelCount: null, generatedStories: [], selectedStory: null }),
  setCustomPanelCount: (count) => set({ customPanelCount: count, generatedStories: [], selectedStory: null }),
  setTheme: (theme) => set({ selectedTheme: theme, customThemeInput: '', generatedStories: [], selectedStory: null }),
  setCustomThemeInput: (text) => set({ customThemeInput: text, selectedTheme: null, generatedStories: [], selectedStory: null }),

  setGeneratedStories: (stories) => set({ generatedStories: stories, selectedStory: null }),
  setSelectedStory: (story) => set({ selectedStory: story }),
  setGeneratingStories: (loading) => set({ isGeneratingStories: loading }),
  requestRegenerate: () => set({ regenerateRequested: true }),
  clearRegenerateRequest: () => set({ regenerateRequested: false }),

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
    generatedStories: [],
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
