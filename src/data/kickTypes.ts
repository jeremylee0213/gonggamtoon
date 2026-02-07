/** User-selectable kick (plot twist) types (#23) */
export interface KickType {
  key: string;
  label: string;
  emoji: string;
  desc: string;
  prompt: string;
}

export const KICK_TYPE_OPTIONS: KickType[] = [
  { key: 'auto', label: '자동 (AI 선택)', emoji: '🤖', desc: 'AI가 최적의 반전을 선택', prompt: '' },
  { key: 'reality', label: '현실 반전', emoji: '😱', desc: '이상과 현실의 극명한 차이', prompt: '현실 반전 (Reality Check) — 기대와 완전히 다른 현실이 드러나는 반전' },
  { key: 'boomerang', label: '자기 부메랑', emoji: '🪃', desc: '내가 한 말/행동이 돌아옴', prompt: '자기 부메랑 (Self-Boomerang) — 본인이 한 말이나 행동이 자기에게 돌아오는 반전' },
  { key: 'unexpected', label: '예상 밖 반응', emoji: '🤯', desc: '상대의 반응이 예상과 정반대', prompt: '예상 밖 반응 (Unexpected Reaction) — 예상과 정반대의 반응이 나오는 반전' },
  { key: 'timeshift', label: '시간 역전', emoji: '⏰', desc: '시간이 지나며 상황이 역전', prompt: '시간 역전 (Time Reversal) — 과거와 현재의 대비, 시간 흐름으로 상황이 역전되는 반전' },
  { key: 'perspective', label: '관점 전환', emoji: '👁️', desc: '다른 시각에서 보면 전혀 다른 상황', prompt: '관점 전환 (Perspective Shift) — 제3자 시각이나 다른 관점에서 보면 전혀 다른 상황인 반전' },
  { key: 'irony', label: '아이러니', emoji: '🎭', desc: '노력의 결과가 정반대', prompt: '아이러니 (Irony) — 열심히 노력한 결과가 정반대이거나, 피하려던 것이 더 심해지는 반전' },
];

export const DEFAULT_KICK_TYPE = 'auto';
