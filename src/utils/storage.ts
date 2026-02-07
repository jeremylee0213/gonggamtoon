import type { ProviderType } from '../types';

const KEY_PREFIX = 'gonggamtoon_api_key_';
const OBFUSCATION_KEY = 'gonggamtoon_2024';

function obfuscate(text: string): string {
  return btoa(
    text
      .split('')
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length)))
      .join(''),
  );
}

function deobfuscate(encoded: string): string {
  try {
    const decoded = atob(encoded);
    return decoded
      .split('')
      .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length)))
      .join('');
  } catch {
    return encoded;
  }
}

export function getApiKey(provider: ProviderType): string {
  const raw = sessionStorage.getItem(`${KEY_PREFIX}${provider}`);
  if (!raw) return '';
  return deobfuscate(raw);
}

export function setApiKey(provider: ProviderType, key: string): void {
  if (key) {
    sessionStorage.setItem(`${KEY_PREFIX}${provider}`, obfuscate(key));
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
