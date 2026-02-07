import type { ProviderType } from '../types';

const KEY_PREFIX = 'gonggamtoon_api_key_';

export function getApiKey(provider: ProviderType): string {
  return sessionStorage.getItem(`${KEY_PREFIX}${provider}`) ?? '';
}

export function setApiKey(provider: ProviderType, key: string): void {
  if (key) {
    sessionStorage.setItem(`${KEY_PREFIX}${provider}`, key);
  } else {
    sessionStorage.removeItem(`${KEY_PREFIX}${provider}`);
  }
}

export function clearAllApiKeys(): void {
  (['gemini', 'openai', 'claude'] as ProviderType[]).forEach((p) => {
    sessionStorage.removeItem(`${KEY_PREFIX}${p}`);
  });
}

export function hasApiKey(provider: ProviderType): boolean {
  return !!getApiKey(provider);
}
