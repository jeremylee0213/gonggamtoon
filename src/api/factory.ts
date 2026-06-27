import type { ProviderType } from '../types';
import type { CodexReasoningEffort } from '../types';
import { generateTextWithGemini } from './gemini';
import { generateTextWithOpenAI } from './openai';
import { generateTextWithClaude } from './claude';
import { generateTextWithCodex } from './codex';

const REQUEST_TIMEOUT_MS = 60_000;
const LOCAL_CODEX_TIMEOUT_MS = 300_000;

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
  codexReasoningEffort: CodexReasoningEffort = 'xhigh',
): Promise<string> {
  abortCurrentRequest();
  currentController = new AbortController();
  const { signal } = currentController;

  const timeoutId = setTimeout(() => {
    currentController?.abort();
  }, provider === 'codex' ? LOCAL_CODEX_TIMEOUT_MS : REQUEST_TIMEOUT_MS);

  try {
    let result: string;
    switch (provider) {
      case 'codex':
        result = await generateTextWithCodex(prompt, model, codexReasoningEffort, signal);
        break;
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
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다. 다시 시도해 주세요.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    currentController = null;
  }
}
