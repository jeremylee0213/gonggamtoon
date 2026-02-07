import type { ProviderType } from '../types';
import { generateTextWithGemini } from './gemini';
import { generateTextWithOpenAI } from './openai';
import { generateTextWithClaude } from './claude';

// Shared AbortController for cancellable requests
let currentController: AbortController | null = null;

export function abortCurrentRequest() {
  if (currentController) {
    currentController.abort();
    currentController = null;
  }
}

export async function generateTextWithProvider(
  provider: ProviderType,
  prompt: string,
  apiKey: string,
  model: string,
): Promise<string> {
  // Cancel any previous request
  abortCurrentRequest();
  currentController = new AbortController();
  const { signal } = currentController;

  try {
    let result: string;
    switch (provider) {
      case 'gemini':
        result = await generateTextWithGemini(prompt, apiKey, model, signal);
        break;
      case 'openai':
        result = await generateTextWithOpenAI(prompt, apiKey, model, signal);
        break;
      case 'claude':
        result = await generateTextWithClaude(prompt, apiKey, model, signal);
        break;
      default:
        throw new Error(`지원하지 않는 Provider: ${provider}`);
    }
    return result;
  } finally {
    currentController = null;
  }
}
