import type { CodexReasoningEffort, Model, ProviderType } from '../types';

export const providerModels: Record<ProviderType, Model[]> = {
  codex: [
    { id: 'gpt-5.5', name: 'Codex GPT-5.5' },
    { id: 'gpt-5.4', name: 'Codex GPT-5.4' },
    { id: 'gpt-5.4-mini', name: 'Codex GPT-5.4 Mini' },
    { id: 'gpt-5.3-codex-spark', name: 'Codex GPT-5.3 Spark' },
  ],
  gemini: [
    { id: 'gemini-2.5-pro-preview-06-05', name: 'Gemini 2.5 Pro' },
    { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'gpt-4.1', name: 'GPT-4.1' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
    { id: 'o4-mini', name: 'o4-mini' },
    { id: 'gpt-5.2', name: 'GPT-5.2' },
  ],
  claude: [
    { id: 'claude-sonnet-4-5-20250929', name: 'Claude Sonnet 4.5' },
    { id: 'claude-haiku-4-5-20251001', name: 'Claude Haiku 4.5' },
    { id: 'claude-opus-4-6', name: 'Claude Opus 4.6' },
  ],
};

export const defaultModels: Record<ProviderType, string> = {
  codex: 'gpt-5.5',
  gemini: 'gemini-2.5-pro-preview-06-05',
  openai: 'gpt-5.2',
  claude: 'claude-sonnet-4-5-20250929',
};

export const codexReasoningEfforts: { id: CodexReasoningEffort; name: string }[] = [
  { id: 'low', name: 'Low' },
  { id: 'medium', name: 'Medium' },
  { id: 'high', name: 'High' },
  { id: 'xhigh', name: 'XHigh' },
];

export const defaultCodexReasoningEffort: CodexReasoningEffort = 'xhigh';
