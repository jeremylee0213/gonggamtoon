import type { GeneratedStory, Style, ThemeMeta } from '../types';
import type { DialogLanguage, ContentMode } from '../store/useAppStore';
import { STORY_GENERATION_COUNT } from '../data/panelLayouts';
import { KICK_TYPES, TONE_PRESETS, STORY_SYSTEM_ROLE, EMPATHY_GUIDE, STORY_RULES, JSON_FORMAT_INSTRUCTION } from './templates';
import { KICK_TYPE_OPTIONS } from '../data/kickTypes';
import { NARRATION_STYLE_OPTIONS } from '../data/narrationStyles';

const LANGUAGE_NAMES: Record<DialogLanguage, string> = {
  ko: '한국어',
  en: '영어 (English)',
  ja: '일본어 (日本語)',
  zh: '중국어 (中文)',
  custom: '',
};

const MODE_INSTRUCTIONS: Record<ContentMode, string> = {
  kids: `• 수위: 미취학 아동용 — 순수하고 귀여운 내용만. 폭력/무서운 장면/어려운 단어 절대 금지. 밝고 따뜻한 톤 유지.`,
  '15': `• 수위: 일반 — 일반적인 공감 스토리. 가벼운 유머, 일상 고민, 사회생활 공감. 성적/폭력 표현 자제.`,
  '19': `• 수위: 19금 — 성인 유머, 섹드립, 야한 상황 묘사 가능. 단, 이미지 생성이 가능한 수준으로 유지 (노골적 성행위 묘사 금지). 재치있는 성적 유머, 민망한 상황, 야릇한 분위기 연출 OK.`,
  '49': `• 수위: 49금 — 노골적 성인 콘텐츠. 직접적인 성적 묘사, 과감한 상황 설정, 적나라한 표현 허용. 단, 이미지 프롬프트는 생성 가능한 범위 내에서 작성.`,
};

/** #22: Theme-category-specific story phase ratios */
const PHASE_RATIOS: Record<string, [number, number, number, number]> = {
  '심리': [0.10, 0.45, 0.25, 0.20],
  '감정': [0.15, 0.40, 0.25, 0.20],
  '일상': [0.15, 0.35, 0.30, 0.20],
  '19금': [0.15, 0.25, 0.40, 0.20],
};
const DEFAULT_RATIOS: [number, number, number, number] = [0.15, 0.35, 0.30, 0.20];

/** #30: Empathy intensity descriptions */
const EMPATHY_LEVELS: Record<number, string> = {
  1: '가벼운 미소 수준 — 살짝 공감되는 정도, 부담 없이 가볍게',
  2: '고개 끄덕임 — "아 그런 적 있지" 정도의 공감',
  3: '무릎 탁 — "이거 나잖아!" 하는 중간 수준의 공감 (기본)',
  4: '소리 지름 — "아 진짜 이거 완전 나!!" 수준의 강한 공감',
  5: '극한 공감 — "이거 내 얘기 아니야?! 누가 몰카 찍었어?!" 수준, 초구체적 디테일',
};

interface StoryGenConfig {
  style: Style | null;
  customStyleInput: string;
  theme: ThemeMeta | null;
  customThemeInput: string;
  panelCount: number;
  dialogLanguage: DialogLanguage;
  customLanguageInput: string;
  contentMode: ContentMode;
  selectedKickType?: string;
  selectedNarrationStyle?: string;
  referenceText?: string;
  serialMode?: boolean;
  previousEpisodeSummary?: string;
  empathyIntensity?: number;
}

export function buildStoryPrompt(config: StoryGenConfig): string {
  const {
    style, customStyleInput, theme, customThemeInput, panelCount,
    dialogLanguage, customLanguageInput, contentMode,
    selectedKickType = 'auto', selectedNarrationStyle = 'auto',
    referenceText = '', serialMode = false, previousEpisodeSummary = '',
    empathyIntensity = 3,
  } = config;

  const styleName = style ? `${style.name} (${style.en})` : customStyleInput;
  const character = style ? style.chars[Math.floor(Math.random() * style.chars.length)] : '주인공';
  const themeName = theme ? theme.name : customThemeInput;
  const themeDesc = theme ? theme.description : '';
  const themeCategory = theme?.category ?? '';
  const langName = dialogLanguage === 'custom' ? customLanguageInput : LANGUAGE_NAMES[dialogLanguage];

  // #22: Theme-specific ratios
  const ratios = PHASE_RATIOS[themeCategory] ?? DEFAULT_RATIOS;
  const intro = Math.max(1, Math.round(panelCount * ratios[0]));
  const develop = Math.max(1, Math.round(panelCount * ratios[1]));
  const climax = Math.max(1, Math.round(panelCount * ratios[2]));
  const ending = Math.max(1, panelCount - intro - develop - climax);

  // #23: Kick type instruction
  const kickOption = KICK_TYPE_OPTIONS.find((k) => k.key === selectedKickType);
  const kickInstruction = kickOption && kickOption.key !== 'auto'
    ? `\n• 반전(kick) 유형: 모든 스토리에 "${kickOption.prompt}" 유형 적용`
    : '';

  // #24: Narration style instruction
  const narrationOption = NARRATION_STYLE_OPTIONS.find((n) => n.key === selectedNarrationStyle);
  const narrationInstruction = narrationOption && narrationOption.key !== 'auto'
    ? `\n• 내레이션 스타일: "${narrationOption.prompt}"`
    : '';

  // #30: Empathy intensity
  const empathyLevel = EMPATHY_LEVELS[empathyIntensity] ?? EMPATHY_LEVELS[3];

  let prompt = `${STORY_SYSTEM_ROLE}
아래 조건에 맞는 공감툰 스토리를 정확히 ${STORY_GENERATION_COUNT}개 생성해주세요.

=== 조건 ===
• 만화 스타일: ${styleName}
• 메인 캐릭터: ${character}
• 공감 주제: ${themeName}${themeDesc ? ` — ${themeDesc}` : ''}
• 컷 수: ${panelCount}컷 (각 컷에 대사 1개씩)
• 대사 언어: ${langName} — 모든 dialog, title, desc, kick, narration, summary를 ${langName}로 작성
• 공감 강도: ${empathyIntensity}/5 — ${empathyLevel}${kickInstruction}${narrationInstruction}
${MODE_INSTRUCTIONS[contentMode]}

${EMPATHY_GUIDE}`;

  // #27: Reference text
  if (referenceText.trim()) {
    prompt += `\n\n=== 참고 레퍼런스 ===\n사용자가 제공한 참고 텍스트입니다. 이 느낌/분위기/패턴을 참고하여 스토리를 생성하세요:\n"${referenceText.trim()}"`;
  }

  // #29: Serial mode
  if (serialMode && previousEpisodeSummary.trim()) {
    prompt += `\n\n=== 연재 모드 (다음 회차) ===\n이전 회차 요약: "${previousEpisodeSummary.trim()}"
이전 회차와 자연스럽게 이어지는 다음 회차 스토리를 생성하세요. 캐릭터와 세계관 유지, 새로운 사건 전개.`;
  }

  prompt += `

=== 기승전결 컷 배분 (${panelCount}컷) ===
• 도입 (${intro}컷): 평화로운 일상, 캐릭터 소개, 밝은 분위기
• 전개 (${develop}컷): 상황에 빠져드는 과정, 점진적 몰입
• 절정 (${climax}컷): 예상 못한 반전! 가장 임팩트 있는 순간
• 결말 (${ending}컷): 여운 있는 마무리, 내레이션으로 감성 마무리

${STORY_RULES}
2. 각 스토리별 톤 분배:
   - 스토리1: ${TONE_PRESETS[0]}
   - 스토리2: ${TONE_PRESETS[1]}
   - 스토리3: ${TONE_PRESETS[2]}`;

  if (selectedKickType === 'auto') {
    prompt += `
3. 반전(kick) 유형 분배 (각각 다르게):
   - 스토리1: ${KICK_TYPES[0]}
   - 스토리2: ${KICK_TYPES[1]}
   - 스토리3: ${KICK_TYPES[2]}`;
  }

  prompt += `
5. dialog 배열은 정확히 ${panelCount}개 (각 컷마다 1개의 대사)

=== 출력 형식 ===
반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 설명이나 마크다운은 절대 포함하지 마세요.
모든 텍스트 필드(title, desc, kick, dialog, narration, summary)는 반드시 ${langName}로 작성하세요.

[
  {
    "title": "스토리 제목 (짧고 임팩트있게, 5~10자)",
    "desc": "상황 한 줄 설명 (어떤 상황인지 구체적으로)",
    "kick": "반전 포인트 + 이모지",
    "dialog": [${Array.from({ length: panelCount }, (_, i) => `"컷${i + 1} 대사"`).join(', ')}],
    "narration": "마지막 내레이션 (감성적 여운, 독자 마음을 울리는 한 문장)",
    "summary": "핵심 요약 (가장 공감되는 장면을 한 문장으로)",
    "character": "${character}"
  }
]

${JSON_FORMAT_INSTRUCTION}`;

  return prompt;
}

export function parseStoryResponse(text: string, panelCount: number): GeneratedStory[] {
  let jsonStr = text.trim();

  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  if (!jsonStr.startsWith('[')) {
    const start = jsonStr.indexOf('[');
    const end = jsonStr.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      jsonStr = jsonStr.substring(start, end + 1);
    }
  }

  jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1');

  const parsed = JSON.parse(jsonStr);

  if (!Array.isArray(parsed)) {
    throw new Error('응답이 JSON 배열 형식이 아닙니다.');
  }

  return parsed
    .filter((story): story is GeneratedStory => {
      return (
        typeof story.title === 'string' &&
        typeof story.desc === 'string' &&
        typeof story.kick === 'string' &&
        Array.isArray(story.dialog) &&
        typeof story.narration === 'string' &&
        typeof story.summary === 'string' &&
        typeof story.character === 'string'
      );
    })
    .map((story) => ({
      ...story,
      dialog: story.dialog.length >= panelCount
        ? story.dialog.slice(0, panelCount)
        : [...story.dialog, ...Array(panelCount - story.dialog.length).fill('...')],
    }));
}
