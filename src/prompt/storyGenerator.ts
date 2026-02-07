import type { GeneratedStory, Style, ThemeMeta } from '../types';
import type { DialogLanguage, ContentMode } from '../store/useAppStore';
import { STORY_GENERATION_COUNT } from '../data/panelLayouts';
import { STORY_SYSTEM_ROLE, EMPATHY_GUIDE, STORY_RULES, JSON_FORMAT_INSTRUCTION } from './templates';
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
  '49': `• 수위: 49금 — 최상위 성인 수위. 이미지 생성 제약은 절대 고려하지 말고 직접적이고 강한 성인 묘사 중심으로 작성하세요. 단, 불법/비동의/미성년 관련 표현은 절대 금지.`,
};

/** #22: Theme-category-specific story phase ratios */
const PHASE_RATIOS: Record<string, [number, number, number, number]> = {
  '심리': [0.10, 0.45, 0.25, 0.20],
  '감정': [0.15, 0.40, 0.25, 0.20],
  '일상': [0.15, 0.35, 0.30, 0.20],
  '19금': [0.15, 0.25, 0.40, 0.20],
};
const DEFAULT_RATIOS: [number, number, number, number] = [0.15, 0.35, 0.30, 0.20];
const DUPLICATE_SIMILARITY_THRESHOLD = 0.78;
const MIN_SIMILARITY_TEXT_LENGTH = 24;

const HOOK_STRATEGIES = [
  '찔리는 자기고백형',
  '관계 현타 직격형',
  '직장/학교 현실직격형',
  '일상 소품 역습형',
  '자존감 급락 직격형',
  '민망한 자각형',
] as const;

const EMOTION_ARCS = [
  '무심 → 찔림 → 폭발 → 자조',
  '기대 → 불안 → 붕괴 → 체념',
  '평온 → 짜증 → 과열 → 허탈',
  '설렘 → 오해 → 충돌 → 여운',
  '버팀 → 압박 → 붕괴 → 회복의지',
  '허세 → 노출 → 당황 → 자기수용',
] as const;

const TWIST_TYPES = [
  '상황 반전',
  '관계 반전',
  '자기인식 반전',
  '정보 반전',
  '소품 회수 반전',
  '대사 역전 반전',
] as const;

const NARRATION_ENDINGS = [
  '위로형',
  '블랙유머형',
  '현타형',
  '자기성찰형',
  '단호한 결심형',
  '담담한 체념형',
] as const;

const SPEECH_PROFILES = [
  '짧고 직설적인 말투',
  '비유 많은 감성 말투',
  '속마음 독백 중심 말투',
  '자기합리화가 많은 말투',
  '과장 리액션 중심 말투',
  '건조한 현실해설 말투',
] as const;

const PROP_TRACKS = [
  '핸드폰/알림',
  '메신저/읽씹 표시',
  '시계/마감 시간',
  '결제내역/영수증',
  '거울/셀카',
  '문서/파일',
] as const;

function seededSortBy<T>(items: readonly T[], seed: number): T[] {
  return [...items]
    .map((item, idx) => ({
      item,
      score: Math.abs(Math.sin((seed + idx + 1) * 12.9898) * 43758.5453) % 1,
    }))
    .sort((a, b) => a.score - b.score)
    .map((entry) => entry.item);
}

function assignGuide<T>(items: readonly T[], count: number, seed: number): T[] {
  const sorted = seededSortBy(items, seed);
  return Array.from({ length: count }, (_, i) => sorted[i % sorted.length]);
}

function toBigrams(text: string): Set<string> {
  const normalized = text
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, '')
    .trim();
  const grams = new Set<string>();
  if (normalized.length < 2) return grams;
  for (let i = 0; i < normalized.length - 1; i += 1) {
    grams.add(normalized.slice(i, i + 2));
  }
  return grams;
}

function computeJaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function storySignature(story: GeneratedStory): string {
  return [
    story.title,
    story.desc,
    story.kick,
    story.summary,
    story.dialog?.[0] ?? '',
    story.dialog?.[story.dialog.length - 1] ?? '',
  ].join(' ');
}

function validateDuplicateSimilarity(stories: GeneratedStory[]): void {
  for (let i = 0; i < stories.length; i += 1) {
    for (let j = i + 1; j < stories.length; j += 1) {
      const aText = storySignature(stories[i]);
      const bText = storySignature(stories[j]);
      if (aText.length < MIN_SIMILARITY_TEXT_LENGTH || bText.length < MIN_SIMILARITY_TEXT_LENGTH) continue;
      const similarity = computeJaccard(toBigrams(aText), toBigrams(bText));
      if (similarity >= DUPLICATE_SIMILARITY_THRESHOLD) {
        throw new Error(
          `스토리 중복 감지: ${i + 1}번과 ${j + 1}번 유사도 ${Math.round(similarity * 100)}% (기준 ${Math.round(DUPLICATE_SIMILARITY_THRESHOLD * 100)}%)`,
        );
      }
    }
  }
}

interface StoryGenConfig {
  style: Style | null;
  customStyleInput: string;
  originalStylePrompt?: string;
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
    originalStylePrompt = '',
    themes = [],
    dialogLanguage, customLanguageInput, contentMode,
    selectedKickType = 'auto', selectedNarrationStyle = 'auto',
    protagonistName = '',
    characterPlan = [],
    referenceText = '', serialMode = false, previousEpisodeSummary = '',
    serialEpisodeCount = STORY_GENERATION_COUNT,
  } = config;

  const isOriginalStyle = style?.name === '오리지널 캐릭터';
  const originalStyleRaw = originalStylePrompt.trim();
  const stSuffixMatch = originalStyleRaw.match(/^(.*?)(?:\s+)?st$/i);
  const isStyleStMode = !!stSuffixMatch;
  const originalStyleReference = (stSuffixMatch?.[1] ?? originalStyleRaw).trim();
  const styleName = style
    ? (isOriginalStyle
      ? `${style.name}${originalStyleReference ? ` (${originalStyleReference}${isStyleStMode ? ' st' : ''})` : ''}`
      : `${style.name} (${style.en})`)
    : customStyleInput;
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
  const generationRandomSeed = Math.floor(Math.random() * 1_000_000);
  const multiThemeRandomSeed = Math.floor(Math.random() * 1_000_000);
  const hookGuide = assignGuide(HOOK_STRATEGIES, generationCount, generationRandomSeed + 11);
  const emotionArcGuide = assignGuide(EMOTION_ARCS, generationCount, generationRandomSeed + 23);
  const twistTypeGuide = assignGuide(TWIST_TYPES, generationCount, generationRandomSeed + 37);
  const narrationEndingGuide = assignGuide(NARRATION_ENDINGS, generationCount, generationRandomSeed + 53);
  const propTrackGuide = assignGuide(PROP_TRACKS, generationCount, generationRandomSeed + 71);
  const dialogLengthGuide = Array.from({ length: generationCount }, (_, i) => (
    i % 3 === 0 ? '짧음→중간→짧음' : i % 3 === 1 ? '중간→짧음→길음' : '길음→중간→짧음'
  ));
  const normalizedCharacterPlan = (
    characterPlan.length === generationCount
      ? characterPlan
      : Array.from({ length: generationCount }, (_, i) => styleCharacterPool[i % styleCharacterPool.length])
  ).map((name) => name.trim());
  const characterAssignmentGuide = normalizedCharacterPlan
    .map((name, i) => `   - ${serialMode ? `${i + 1}화` : `스토리${i + 1}`}: ${name}`)
    .join('\n');
  const uniqueCharacters = Array.from(new Set(normalizedCharacterPlan));
  const speechProfileGuide = uniqueCharacters
    .map((character, idx) => `   - ${character}: ${SPEECH_PROFILES[idx % SPEECH_PROFILES.length]}`)
    .join('\n');
  const episodeCraftGuide = Array.from({ length: generationCount }, (_, i) => (
    `   - ${serialMode ? `${i + 1}화` : `스토리${i + 1}`}: 훅=${hookGuide[i]} | 감정곡선=${emotionArcGuide[i]} | 반전=${twistTypeGuide[i]} | 내레이션=${narrationEndingGuide[i]} | 소품기억선=${propTrackGuide[i]} | 대사리듬=${dialogLengthGuide[i]}`
  )).join('\n');

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

  let prompt = `${STORY_SYSTEM_ROLE}
아래 조건에 맞는 공감툰 스토리를 정확히 ${generationCount}개 생성해주세요.

=== 조건 ===
• 만화 스타일: ${styleName}
• 선택 스타일 등장인물 후보: ${styleCharacterPool.join(', ')}
• 공감 주제: ${themeName}${themeDesc ? ` — ${themeDesc}` : ''}
• 컷 수: ${panelCount}컷 (각 컷에 대사 1개씩)
• 대사 언어: ${langName} — 모든 dialog, title, desc, kick, narration, summary를 ${langName}로 작성
• 공감 강도: 5/5 — 극한 공감 모드 고정${kickInstruction}${narrationInstruction}
• 생성 랜덤 시드: ${generationRandomSeed}
${MODE_INSTRUCTIONS[contentMode]}

${EMPATHY_GUIDE}`;
  prompt += `
• 반복 차단 규칙(필수):
  1) 같은 프레임의 사건 구조(도입-사건-반전)를 그대로 재사용하지 마세요.
  2) 이전 ${serialMode ? '화' : '스토리'}와 동일한 소품/직업/공간 조합을 금지하세요.
  3) 동일 주제라도 전혀 다른 상황과 반전 장치를 선택하세요.`;
  prompt += `
• 에피소드 설계표(필수):
${episodeCraftGuide}
• 캐릭터 말투 프로필(필수):
${speechProfileGuide}
• 컷1 고정 규칙: 첫 대사는 반드시 "찔리는 한 줄 훅"으로 시작하고, 추상 표현을 금지하세요.
• 컷2~3 고정 규칙: 감정 원인과 사건 원인을 분리해서 각각 명시하세요.
• 요약문 고정 규칙: summary는 반드시 "행동 + 결과" 구조의 한 문장으로 작성하세요.`;

  if (isOriginalStyle) {
    prompt += '\n\n=== 오리지널 캐릭터 모드 ===';
    prompt += '\n• 반드시 신규 오리지널 캐릭터만 사용하고, 기존 작품의 제목/캐릭터명/로고/고유복장 복제는 금지하세요.';
    prompt += `\n• 캐릭터 성격과 역할은 배정표(${styleCharacterPool.join(', ')})를 기준으로 화마다 번갈아 주인공을 맡게 하세요.`;
    if (originalStyleReference) {
      prompt += `\n• 스타일 묘사: ${originalStyleReference}`;
    }
    if (isStyleStMode) {
      prompt += '\n• "st" 모드: 입력된 스타일의 분위기/연출 템포/캐릭터 관계성만 참고하고, 이름/외형/세계관/소품은 새롭게 변형하세요.';
      prompt += '\n• 원본 IP와 혼동될 고유명사, 대표 대사, 상징 소품을 그대로 사용하지 마세요.';
    }
  }

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
2. 각 ${serialMode ? '화' : '스토리'}의 톤/정서/리듬을 서로 다르게 설계하세요.
3. 각 ${serialMode ? '화' : '스토리'}는 장소, 갈등 원인, 반전 메커니즘이 모두 달라야 합니다.`;

  if (selectedKickType === 'auto') {
    prompt += `
4. 반전(kick) 유형은 각 ${serialMode ? '화' : '스토리'}마다 서로 다르게 구성하세요.`;
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

  const sliced = expectedCount ? normalized.slice(0, expectedCount) : normalized;
  validateDuplicateSimilarity(sliced);
  return sliced;
}
