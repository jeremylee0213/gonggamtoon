export interface Style {
  name: string;
  en: string;
  emoji: string;
  chars: string[];
  category?: string;
}

export interface ThemeCategory {
  label: string;
  emoji: string;
}

export interface Story {
  title: string;
  desc: string;
  kick: string;
  dialog: string[];
  narration: string;
}

export interface GeneratedStory extends Story {
  summary: string;
  character: string;
  theme?: string;
  episode?: number;
}

export interface ThemeMeta {
  key: string;
  name: string;
  emoji: string;
  description: string;
  category?: string;
}

export interface Theme {
  name: string;
  stories: Story[];
}

export type ThemeKey = string;

export interface PanelLayout {
  panels: number;
  cols: number;
  rows: number;
}

export type ProviderType = 'gemini' | 'openai' | 'claude';

export interface Model {
  id: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  type: 'text' | 'prompt' | 'error';
  prompt?: string;
  timestamp: number;
}

export interface PromptConfig {
  style: Style;
  character: string;
  theme: { name: string };
  story: Story;
  panels: number;
  cols: number;
  rows: number;
  dialogLanguage?: string;
  contentMode?: string;
  signature?: string;
}
