/** Narration style options for the last panel (#24) */
export interface NarrationStyle {
  key: string;
  label: string;
  emoji: string;
  desc: string;
  prompt: string;
}

export const NARRATION_STYLE_OPTIONS: NarrationStyle[] = [
  { key: 'auto', label: '자동 (AI 선택)', emoji: '🤖', desc: 'AI가 분위기에 맞는 스타일 선택', prompt: '' },
  { key: 'emotional', label: '감성적 여운', emoji: '🌅', desc: '마음을 울리는 한 문장', prompt: '감성적 여운 — 독자의 마음을 울리는 서정적인 한 문장, 잔잔한 감동' },
  { key: 'question', label: '독자에게 질문', emoji: '❓', desc: '"당신은 어떤가요?"', prompt: '독자에게 질문 던지기 — "당신도 이런 적 있지 않나요?" 형식으로 독자와 소통하는 내레이션' },
  { key: 'proverb', label: '격언/속담', emoji: '📜', desc: '짧은 격언으로 마무리', prompt: '짧은 격언/속담 — 상황에 딱 맞는 한국 속담이나 짧은 격언으로 마무리' },
  { key: 'blackhumor', label: '블랙 유머', emoji: '🖤', desc: '웃기면서 씁쓸한 한마디', prompt: '블랙 유머 — 웃기면서도 씁쓸한 자조적 유머, "그래서 오늘도 야근이다" 같은 한마디' },
  { key: 'confession', label: '자기 고백', emoji: '💬', desc: '캐릭터의 솔직한 독백', prompt: '자기 고백 — 캐릭터가 독자에게 직접 말하듯 솔직한 독백, 4th wall breaking 느낌' },
];

export const DEFAULT_NARRATION_STYLE = 'auto';
