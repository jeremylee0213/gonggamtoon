import type { Model, PromptConfig, ProviderType, Theme } from './index';

export interface StorySuggestion {
  title: string;
  desc: string;
  kick: string;
  dialog: string[];
  narration: string;
}

export interface ApiProvider {
  name: string;
  type: ProviderType;
  models: Model[];
  validateKey(key: string): Promise<boolean>;
  generatePrompt(config: PromptConfig, apiKey: string, model: string): Promise<string>;
  generateText(prompt: string, apiKey: string, model: string): Promise<string>;
  suggestStory(theme: Theme, apiKey: string, model: string): Promise<StorySuggestion>;
}

export interface ApiRequestOptions {
  signal?: AbortSignal;
  onProgress?: (text: string) => void;
}
