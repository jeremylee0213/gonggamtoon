import type { PromptConfig } from '../types';
import { STORY_PHASES } from '../data/panelLayouts';
import { styleFonts, emotionFonts, phaseFonts } from '../data/fonts';

function getDialogForPanel(panelIndex: number, totalPanels: number, dialogs: string[]): string {
  if (panelIndex === 0) return dialogs[0];
  if (panelIndex === totalPanels - 1) return dialogs[dialogs.length - 1];

  const middleDialogs = dialogs.slice(1, -1);
  const middlePanels = totalPanels - 2;
  if (middlePanels <= 0 || middleDialogs.length === 0) return dialogs[0];

  const dialogIndex = Math.floor((panelIndex - 1) * middleDialogs.length / middlePanels);
  return middleDialogs[Math.min(dialogIndex, middleDialogs.length - 1)];
}

function getEmotionForDialog(dialog: string, phaseIndex: number, isKick: boolean): string {
  if (isKick) return 'surprised';
  if (dialog.includes('!') && dialog.includes('ㅠ')) return 'sad';
  if (dialog.match(/!{2,}|으악|윽/)) return 'angry';
  if (dialog.includes('...')) return 'thinking';
  if (dialog.startsWith('(속') || dialog.includes('속마음')) return 'thinking';
  if (dialog.includes('?!') || dialog.includes('뭐') || dialog.includes('어?')) return 'surprised';
  if (phaseIndex === 0) return 'happy';
  if (phaseIndex === 3) return 'sad';
  return 'happy';
}

function getPanelComposition(panelIndex: number, totalPanels: number): string {
  if (panelIndex === 0) return 'medium shot, establishing scene, eye-level angle';
  if (panelIndex === totalPanels - 1) return 'wide shot pulling back, reflective mood, slight low angle';
  if (panelIndex === Math.ceil(totalPanels / 2) - 1) return 'dramatic close-up, dutch angle, high contrast lighting';
  if (panelIndex < totalPanels / 3) return 'medium close-up, slight over-shoulder angle';
  if (panelIndex < (totalPanels * 2) / 3) return 'close-up on expression, tight framing';
  return 'medium shot, reaction framing, natural angle';
}

const CIRCLE_NUMBERS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];

const LANG_TEXT_RULES: Record<string, string> = {
  ko: `【⚠️ 한글 필수 규칙 ⚠️】
!!! ALL Korean text MUST be PERFECTLY rendered — zero broken characters !!!
!!! 한글 절대 깨지면 안 됨. 선명하고 깨끗하게. 가독성 최우선 !!!
!!! High-contrast text color against background !!!`,
  en: `【⚠️ English Text Rules ⚠️】
!!! ALL English text MUST be perfectly legible — clean, crisp, no spelling errors !!!
!!! High-contrast text color against background !!!`,
  ja: `【⚠️ 日本語テキストルール ⚠️】
!!! ALL Japanese text (hiragana/katakana/kanji) MUST be perfectly rendered !!!
!!! 日本語を正確に、読みやすく、鮮明に表示すること !!!
!!! High-contrast text color against background !!!`,
  zh: `【⚠️ 中文文字规则 ⚠️】
!!! ALL Chinese text MUST be perfectly rendered — clear and readable !!!
!!! 中文必须清晰显示，不得出现乱码 !!!
!!! High-contrast text color against background !!!`,
};

export function buildPrompt(config: PromptConfig): string {
  const { style, character, theme, story, panels, cols, rows, dialogLanguage, contentMode } = config;
  const { dialog: dialogs, kick, narration, desc } = story;

  const font = styleFonts[style.en] ?? {
    title: 'bold display font',
    dialog: 'clean comic font',
    narration: 'elegant serif',
    effect: 'impact bold font',
  };

  let prompt = `=== 공감툰 AI 프롬프트 (나노바나나 프로 전용) ===\n\n`;

  // 【제목】
  prompt += `【📌 제목 — 첫 컷 상단에 배치】\n`;
  prompt += `메인 제목: "${story.title}" → ${font.title}, 크게, 볼드, 중앙 정렬\n`;
  prompt += `부제: "${desc}" → ${font.narration}, 작게, 연한 색, 제목 아래\n`;
  prompt += `제목 배경: ${style.en} 분위기에 맞는 장식 프레임 또는 그라데이션 배너\n\n`;

  // 【기본】
  prompt += `【🎨 기본 설정】\n`;
  prompt += `• 스타일: ${style.name} (${style.en})\n`;
  prompt += `• 주인공: ${character} — ${style.name} 원작의 시그니처 외형/의상/소품 정확히 재현\n`;
  prompt += `• 주제: [${theme.name}] ${story.title}\n`;
  prompt += `• 상황: ${desc}\n`;
  prompt += `• 그리드: ${cols}×${rows} (총 ${panels}컷)\n`;
  prompt += `• 반전: ${kick}\n\n`;

  // 【텍스트 규칙 — 언어별】
  const lang = dialogLanguage ?? 'ko';
  const textRule = LANG_TEXT_RULES[lang] ?? LANG_TEXT_RULES.ko;
  prompt += `${textRule}\n\n`;

  if (contentMode === '19' || contentMode === '49') {
    prompt += `【🔞 콘텐츠 수위】\n`;
    prompt += `이 만화는 ${contentMode === '19' ? '19금' : '49금'} 콘텐츠입니다. 섹시하고 야한 분위기 연출을 적극적으로 반영하되, 이미지 생성 가능한 범위 내에서 표현하세요.\n\n`;
  }

  // 【레이아웃】
  prompt += `【📐 레이아웃】\n`;
  prompt += `• 1:1 정사각형 전체 이미지, HIGH QUALITY\n`;
  prompt += `• ${cols}x${rows} 균등 그리드, 패널 사이 얇은 검정 테두리\n`;
  prompt += `• 각 패널 좌상단: 작은 원형 번호 (${CIRCLE_NUMBERS.slice(0, panels).join('')}) — 회색 반투명 원 위에 흰색 숫자\n`;
  prompt += `• 읽기 순서: 좌→우, 상→하\n\n`;

  // 【폰트 시스템】
  prompt += `【🔤 폰트 시스템 (${style.name} 전용)】\n`;
  prompt += `• 제목: ${font.title}\n`;
  prompt += `• 대사: ${font.dialog}\n`;
  prompt += `• 내레이션: ${font.narration}\n`;
  prompt += `• 효과음: ${font.effect}\n`;
  prompt += `• 감정별 변화: 기쁨→${emotionFonts.happy} | 슬픔→${emotionFonts.sad} | 놀람→${emotionFonts.surprised} | 속마음→${emotionFonts.thinking}\n\n`;

  // 【AI 역할】
  prompt += `【🤖 AI 적극 개입 지시】\n`;
  prompt += `당신은 시니어 공감툰 작가입니다. 각 컷의 기본 대사를 바탕으로:\n`;
  prompt += `1. 캐릭터의 구체적 행동/포즈를 상세 시각화 (손동작, 시선, 몸짓)\n`;
  prompt += `2. 표정을 세밀 묘사 (눈썹 각도, 입꼬리, 눈 크기, 동공)\n`;
  prompt += `3. 배경/환경을 구체 설정 (장소, 소품, 조명, 시간대)\n`;
  prompt += `4. 효과음/시각효과 적극 추가 (땀방울, 번개, 속도선, 꽃잎 등)\n`;
  prompt += `5. 말풍선 크기/모양을 감정에 맞게 변화\n`;
  prompt += `6. 컷 간 시각적 흐름 자연스럽게 연결\n`;
  prompt += `7. ${theme.name} 공감 포인트를 극대화하는 연출\n\n`;

  // 【컷별 상세 연출】
  prompt += `【🎬 컷별 상세 연출】\n\n`;

  for (let i = 1; i <= panels; i++) {
    const idx = i - 1;
    const phaseIndex = Math.floor(idx / Math.ceil(panels / 4));
    const phase = STORY_PHASES[Math.min(phaseIndex, 3)];
    const dialog = getDialogForPanel(idx, panels, dialogs);
    const isKick = i === Math.ceil(panels / 2);
    const isFirst = i === 1;
    const isLast = i === panels;
    const emotion = getEmotionForDialog(dialog, phaseIndex, isKick);
    const emotionStyle = emotionFonts[emotion] ?? emotionFonts.happy;
    const phaseStyle = phaseFonts[phase] ?? phaseFonts['도입'];
    const composition = getPanelComposition(idx, panels);
    const num = CIRCLE_NUMBERS[idx] ?? `(${i})`;

    prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    prompt += `[컷 ${num}] ${phase} | ${phaseStyle}\n`;
    prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    if (isFirst) {
      prompt += `📍 구도: ${composition}\n`;
      prompt += `🏷️ 제목: 패널 상단 "${story.title}" (${font.title}) + "${desc}" (작게)\n`;
      prompt += `👤 ${character}: 첫 등장 — 시그니처 포즈, 밝은 기대 표정\n`;
      prompt += `🎭 표정: 눈 반짝, 입꼬리 올라감, 기대에 찬 모습\n`;
      prompt += `🏠 배경: ${theme.name} 주제의 일상 배경, 따뜻한 색감, 소품 배치\n`;
      prompt += `💬 대사: "${dialogs[0]}" → ${emotionStyle}\n`;
      prompt += `  말풍선: 둥근 일반형, ${font.dialog}, 적당 크기\n`;
      prompt += `✨ 효과: 톤 설정용 가벼운 이펙트\n`;
      prompt += `🔢 좌상단 ${num}\n`;
    } else if (isLast) {
      prompt += `📍 구도: ${composition}\n`;
      prompt += `👤 ${character}: 반전 결과 최종 리액션\n`;
      prompt += `🎭 표정: AI가 ${kick} 결과에 맞는 표정 결정 (체념/허탈/자조적 웃음 등)\n`;
      prompt += `🏠 배경: 결과가 시각적으로 드러나는 배경 + 소품\n`;
      prompt += `💬 대사: "${dialogs[dialogs.length - 1]}" → ${emotionFonts.sad}\n`;
      prompt += `  말풍선: 감정 변형 말풍선 (울퉁불퉁/떨림 등)\n`;
      prompt += `📜 내레이션: "${narration}"\n`;
      prompt += `  → 하단 1/4, 반투명 배경, ${font.narration}, 본문보다 크게, italic, 강조색\n`;
      prompt += `✍️ 서명: "by Jeremy" → 우하단, 작은 필기체\n`;
      prompt += `🔢 좌상단 ${num}\n`;
    } else if (isKick) {
      prompt += `📍 구도: ${composition} ⭐ 핵심 반전!\n`;
      prompt += `👤 ${character}: ${kick} 순간의 극적 포즈!\n`;
      prompt += `🎭 표정: 최대 리액션 — AI가 극대화 (눈 동그래짐/턱 빠짐/얼굴 일그러짐)\n`;
      prompt += `🏠 배경: 반전 강조 (집중선/색상 반전/충격파)\n`;
      prompt += `💬 대사: "${dialog}" → ${emotionFonts.shouting}\n`;
      prompt += `  말풍선: 폭발형/찌그러진 말풍선, ${font.effect}, 크게!\n`;
      prompt += `💥 효과음: ${kick} 관련 효과음, ${font.effect}로 크게\n`;
      prompt += `✨ 시각효과: 집중선 + 속도선 + 충격 이펙트 + 땀방울\n`;
      prompt += `🔢 좌상단 ${num}\n`;
    } else {
      prompt += `📍 구도: ${composition}\n`;
      prompt += `👤 ${character}: AI가 흐름에 맞는 구체 행동 결정\n`;
      prompt += `  (예: 걷기/핸드폰 보기/고개 갸웃/한숨/손짓 등)\n`;
      prompt += `🎭 표정: ${phase}에 맞는 표정 — AI가 감정 흐름 고려\n`;
      prompt += `🏠 배경: 이전 컷과 연속 + 시간/상황 변화 반영\n`;
      prompt += `💬 대사: "${dialog}" → ${emotionStyle}\n`;
      prompt += `  말풍선: 감정에 맞는 형태, ${font.dialog}\n`;
      if (phaseIndex === 1) {
        prompt += `🎬 행동: 점점 빠져드는/몰입하는 동작\n`;
      } else if (phaseIndex === 2) {
        prompt += `🎬 행동: 긴장/위기/깨달음으로 전환되는 동작\n`;
      }
      prompt += `🔢 좌상단 ${num}\n`;
    }
    prompt += `\n`;
  }

  // 【체크리스트】
  prompt += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  prompt += `【✅ 최종 체크리스트】\n`;
  prompt += `• ${style.en}, cute chibi (2-3 등신)\n`;
  prompt += `• ${character} 외형 모든 컷 일관성 (머리색/의상/액세서리)\n`;
  prompt += `• 패널 번호 ${CIRCLE_NUMBERS.slice(0, panels).join('')} 좌상단 작은 원형\n`;
  prompt += `• 첫 컷 상단: "${story.title}" + "${desc}"\n`;
  prompt += `• ⚠️ ${lang === 'ko' ? '한글' : lang === 'ja' ? '日本語' : lang === 'zh' ? '中文' : 'Text'} 완벽 렌더링 ⚠️\n`;
  prompt += `• 마지막 컷 하단: "${narration}" 크게\n`;
  prompt += `• 서명 "by Jeremy" 필기체\n`;
  prompt += `• 감정 곡선: 밝음→몰입→충격→여운\n`;
  prompt += `• 감정별 다른 폰트 스타일 적용\n`;
  prompt += `• 효과음/이모티콘/집중선 적극 활용`;

  return prompt;
}
