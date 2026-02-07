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

interface StoryGenConfig {
  style: Style | null;
  customStyleInput: string;
  themes?: ThemeMeta[];
  theme: ThemeMeta | null;
  customThemeInput: string;
  panelCount: number;
  dialogLanguage: DialogLanguage;
  customLanguageInput: string;
  contentMode: ContentMode;
  selectedKickType?: string;
  selectedNarrationStyle?: string;
  protagonistName?: string;
  characterPlan?: string[];
  referenceText?: string;
  serialMode?: boolean;
  serialEpisodeCount?: number;
  previousEpisodeSummary?: string;
}

export function buildStoryPrompt(config: StoryGenConfig): string {
  const {
    style, customStyleInput, theme, customThemeInput, panelCount,
    themes = [],
    dialogLanguage, customLanguageInput, contentMode,
    selectedKickType = 'auto', selectedNarrationStyle = 'auto',
    protagonistName = '',
    characterPlan = [],
    referenceText = '', serialMode = false, previousEpisodeSummary = '',
    serialEpisodeCount = STORY_GENERATION_COUNT,
  } = config;

  const styleName = style ? `${style.name} (${style.en})` : customStyleInput;
  const characterSeed = protagonistName.trim();
  const styleCharacterPool = style?.chars?.length
    ? Array.from(new Set(style.chars.map((c) => c.trim()).filter(Boolean)))
    : (characterSeed ? [characterSeed] : ['주인공A', '주인공B', '주인공C']);
  const resolvedThemes = themes.length > 0 ? themes : (theme ? [theme] : []);
  const themeName = resolvedThemes.length > 0
    ? resolvedThemes.map((t) => t.name).join(', ')
    : customThemeInput;
  const themeDesc = resolvedThemes.length > 0
    ? resolvedThemes.map((t) => `${t.name}: ${t.description}`).join(' | ')
    : '';
  const themeCategory = resolvedThemes.length === 1 ? (resolvedThemes[0].category ?? '') : '';
  const themeFrequency = resolvedThemes.reduce<Record<string, number>>((acc, item) => {
    acc[item.name] = (acc[item.name] ?? 0) + 1;
    return acc;
  }, {});
  const themePriorityLine = Object.entries(themeFrequency)
    .map(([name, count]) => `${name} x${count}`)
    .join(', ');
  const langName = dialogLanguage === 'custom' ? customLanguageInput : LANGUAGE_NAMES[dialogLanguage];
  const generationCount = serialMode ? Math.max(2, Math.min(20, serialEpisodeCount)) : STORY_GENERATION_COUNT;
  const multiThemeRandomSeed = Math.floor(Math.random() * 1_000_000);
  const normalizedCharacterPlan = (
    characterPlan.length === generationCount
      ? characterPlan
      : Array.from({ length: generationCount }, (_, i) => styleCharacterPool[i % styleCharacterPool.length])
  ).map((name) => name.trim());
  const characterAssignmentGuide = normalizedCharacterPlan
    .map((name, i) => `   - ${serialMode ? `${i + 1}화` : `스토리${i + 1}`}: ${name}`)
    .join('\n');

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

  const toneGuide = Array.from({ length: generationCount }, (_, i) => `   - ${serialMode ? `${i + 1}화` : `스토리${i + 1}`}: ${TONE_PRESETS[i % TONE_PRESETS.length]}`).join('\n');
  const kickGuide = Array.from({ length: generationCount }, (_, i) => `   - ${serialMode ? `${i + 1}화` : `스토리${i + 1}`}: ${KICK_TYPES[i % KICK_TYPES.length]}`).join('\n');

  let prompt = `${STORY_SYSTEM_ROLE}
아래 조건에 맞는 공감툰 스토리를 정확히 ${generationCount}개 생성해주세요.

=== 조건 ===
• 만화 스타일: ${styleName}
• 선택 스타일 등장인물 후보: ${styleCharacterPool.join(', ')}
• 공감 주제: ${themeName}${themeDesc ? ` — ${themeDesc}` : ''}
• 컷 수: ${panelCount}컷 (각 컷에 대사 1개씩)
• 대사 언어: ${langName} — 모든 dialog, title, desc, kick, narration, summary를 ${langName}로 작성
• 공감 강도: 5/5 — 극한 공감 모드 고정${kickInstruction}${narrationInstruction}
${MODE_INSTRUCTIONS[contentMode]}

${EMPATHY_GUIDE}`;

  if (resolvedThemes.length > 1) {
    prompt += `\n• 다중 주제 우선순위(중복 선택 반영): ${themePriorityLine || themeName}`;
    prompt += `\n• 다중 주제 랜덤 시드: ${multiThemeRandomSeed}`;
    prompt += `\n• ${serialMode ? '화' : '스토리'}별 주제 선정 규칙(필수):`;
    prompt += `\n  1) 해당 ${serialMode ? '화' : '스토리'}의 character 기준으로 선택된 주제 각각의 적합도를 1~5점으로 평가`;
    prompt += `\n  2) 최고점(동점 허용) 주제 후보군을 만든 뒤, 랜덤 시드(${multiThemeRandomSeed})와 ${serialMode ? '화' : '스토리'} 번호를 사용해 후보군에서 1개를 랜덤 선택`;
    prompt += '\n  3) 같은 주제가 연속 반복되면, 다음 후보로 바꿔 다양성을 확보(후보가 1개면 예외)';
    prompt += `\n  4) 동일 주제가 여러 번 선택되었으면(${themePriorityLine || themeName}) 그 주제의 선택 확률을 더 높게 반영`;
    prompt += '\n  5) 반드시 선택된 주제만 사용하고, 가능하면 모든 선택 주제를 최소 1회 이상 사용';
    prompt += `\n  6) 최종 선택된 주제를 각 항목의 "theme" 필드에 1개만 기록`;
  } else if (resolvedThemes.length === 1) {
    prompt += `\n• ${serialMode ? '화' : '스토리'} 공감 주제 고정: ${resolvedThemes[0].name}`;
    prompt += '\n• 각 항목의 "theme" 필드에는 위 주제를 동일하게 작성';
  }
  prompt += `\n\n=== 주인공 배정표 (필수) ===
아래 배정표를 절대 변경하지 말고 각 항목의 character를 정확히 동일하게 작성하세요.
${characterAssignmentGuide}
• 주인공 규칙: 각 ${serialMode ? '화' : '스토리'}의 character는 반드시 선택 스타일 등장인물 후보 중 하나여야 합니다.
• 주인공 규칙: 같은 character를 연속 사용하지 말고 번갈아가며 사용하세요.
• 주인공 규칙: character 외의 이름/직업/말투도 화마다 차별화하세요.`;

  // #27: Reference text
  if (referenceText.trim()) {
    prompt += `\n\n=== 참고 레퍼런스 ===\n사용자가 제공한 참고 텍스트입니다. 이 느낌/분위기/패턴을 참고하여 스토리를 생성하세요:\n"${referenceText.trim()}"`;
  }

  // #29: Serial mode
  if (serialMode) {
    prompt += `\n\n=== 연재 모드 ===
총 ${generationCount}화를 한 번에 작성하세요.
각 화는 해당 화 안에서 사건이 마무리되도록 완결성을 갖추되, 다음 화가 자연스럽게 이어지도록 연결고리를 남기세요.
1화에서 만든 캐릭터 관계/소품/감정 변화는 다음 화로 누적 반영하세요.
제목은 반드시 "${langName}"로 작성하고, 형식은 "1화: ...", "2화: ..."처럼 화차를 명시하세요.`;
    if (previousEpisodeSummary.trim()) {
      prompt += `\n\n이전 시즌/이전 화 요약: "${previousEpisodeSummary.trim()}"`;
    }
  }

  prompt += `

=== 기승전결 컷 배분 (${panelCount}컷) ===
• 도입 (${intro}컷): 평화로운 일상, 캐릭터 소개, 밝은 분위기
• 전개 (${develop}컷): 상황에 빠져드는 과정, 점진적 몰입
• 절정 (${climax}컷): 예상 못한 반전! 가장 임팩트 있는 순간
• 결말 (${ending}컷): 여운 있는 마무리, 내레이션으로 감성 마무리

${STORY_RULES}
2. 각 ${serialMode ? '화' : '스토리'}별 톤 분배:
${toneGuide}`;

  if (selectedKickType === 'auto') {
    prompt += `
3. 반전(kick) 유형 분배 (각각 다르게):
${kickGuide}`;
  }

  prompt += `
5. dialog 배열은 정확히 ${panelCount}개 (각 컷마다 1개의 대사)

=== 출력 형식 ===
반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 설명이나 마크다운은 절대 포함하지 마세요.
모든 텍스트 필드(title, desc, kick, dialog, narration, summary)는 반드시 ${langName}로 작성하세요.
JSON 배열 길이는 정확히 ${generationCount}개여야 합니다.
각 항목의 title에는 반드시 화차를 포함하세요 (예: "1화 - 제목", "2화 - 제목").
각 항목의 character는 위 주인공 배정표 값과 정확히 일치해야 합니다.
각 항목의 theme에는 해당 ${serialMode ? '화' : '스토리'}에서 실제로 적용한 공감 주제를 1개만 작성하세요.

[
  {
    "episode": 1,
    "title": "1화 - 스토리 제목 (짧고 임팩트있게, 5~10자)",
    "theme": "${resolvedThemes[0]?.name ?? (themeName || '공감 주제')}",
    "desc": "상황 한 줄 설명 (어떤 상황인지 구체적으로)",
    "kick": "반전 포인트 + 이모지",
    "dialog": [${Array.from({ length: panelCount }, (_, i) => `"컷${i + 1} 대사"`).join(', ')}],
    "narration": "마지막 내레이션 (감성적 여운, 독자 마음을 울리는 한 문장)",
    "summary": "핵심 요약 (가장 공감되는 장면을 한 문장으로)",
    "character": "${normalizedCharacterPlan[0]}"
  }
]

${JSON_FORMAT_INSTRUCTION}`;

  return prompt;
}

export function parseStoryResponse(
  text: string,
  panelCount: number,
  expectedCount?: number,
  characterPlan?: string[],
): GeneratedStory[] {
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

  const normalized = parsed
    .filter((story): story is GeneratedStory & { episode?: number } => {
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
    .map((story, index) => {
      const plannedCharacter = characterPlan?.[index]?.trim();
      const parsedCharacter = story.character.trim();
      const parsedTheme = typeof (story as { theme?: unknown }).theme === 'string'
        ? (story as { theme?: string }).theme?.trim()
        : '';

      return {
        ...story,
        episode: typeof story.episode === 'number' ? story.episode : (expectedCount ? index + 1 : undefined),
        theme: parsedTheme || undefined,
        character: plannedCharacter || parsedCharacter || `주인공${index + 1}`,
        dialog: story.dialog.length >= panelCount
          ? story.dialog.slice(0, panelCount)
          : [...story.dialog, ...Array(panelCount - story.dialog.length).fill('...')],
      };
    });

  if (expectedCount && normalized.length < expectedCount) {
    throw new Error(`응답에서 ${expectedCount}개의 스토리를 모두 파싱하지 못했습니다.`);
  }

  return expectedCount ? normalized.slice(0, expectedCount) : normalized;
}
