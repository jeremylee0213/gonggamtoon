import type { GeneratedStory, Style, ThemeMeta } from '../types';
import { STORY_GENERATION_COUNT } from '../data/panelLayouts';
import { KICK_TYPES, TONE_PRESETS, STORY_SYSTEM_ROLE, EMPATHY_GUIDE, STORY_RULES, JSON_FORMAT_INSTRUCTION } from './templates';

interface StoryGenConfig {
  style: Style | null;
  customStyleInput: string;
  theme: ThemeMeta | null;
  customThemeInput: string;
  panelCount: number;
}

export function buildStoryPrompt(config: StoryGenConfig): string {
  const { style, customStyleInput, theme, customThemeInput, panelCount } = config;

  const styleName = style ? `${style.name} (${style.en})` : customStyleInput;
  const character = style ? style.chars[Math.floor(Math.random() * style.chars.length)] : '주인공';
  const themeName = theme ? theme.name : customThemeInput;
  const themeDesc = theme ? theme.description : '';

  // 기승전결 비율 계산
  const intro = Math.max(1, Math.round(panelCount * 0.15));
  const develop = Math.max(1, Math.round(panelCount * 0.35));
  const climax = Math.max(1, Math.round(panelCount * 0.30));
  const ending = Math.max(1, panelCount - intro - develop - climax);

  return `${STORY_SYSTEM_ROLE}
아래 조건에 맞는 공감툰 스토리를 정확히 ${STORY_GENERATION_COUNT}개 생성해주세요.

=== 조건 ===
• 만화 스타일: ${styleName}
• 메인 캐릭터: ${character}
• 공감 주제: ${themeName}${themeDesc ? ` — ${themeDesc}` : ''}
• 컷 수: ${panelCount}컷 (각 컷에 대사 1개씩)

${EMPATHY_GUIDE}

=== 기승전결 컷 배분 (${panelCount}컷) ===
• 도입 (${intro}컷): 평화로운 일상, 캐릭터 소개, 밝은 분위기
• 전개 (${develop}컷): 상황에 빠져드는 과정, 점진적 몰입
• 절정 (${climax}컷): 예상 못한 반전! 가장 임팩트 있는 순간
• 결말 (${ending}컷): 여운 있는 마무리, 내레이션으로 감성 마무리

${STORY_RULES}
2. 각 스토리별 톤 분배:
   - 스토리1: ${TONE_PRESETS[0]}
   - 스토리2: ${TONE_PRESETS[1]}
   - 스토리3: ${TONE_PRESETS[2]}
   - 스토리4: ${TONE_PRESETS[3]}
3. 반전(kick) 유형 분배 (각각 다르게):
   - 스토리1: ${KICK_TYPES[0]}
   - 스토리2: ${KICK_TYPES[1]}
   - 스토리3: ${KICK_TYPES[2]}
   - 스토리4: ${KICK_TYPES[3]}
5. dialog 배열은 정확히 ${panelCount}개 (각 컷마다 1개의 대사)

=== 출력 형식 ===
반드시 아래 JSON 배열 형식으로만 응답하세요. 다른 설명이나 마크다운은 절대 포함하지 마세요.

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
}

export function parseStoryResponse(text: string, panelCount: number): GeneratedStory[] {
  let jsonStr = text.trim();

  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Try to find JSON array brackets
  if (!jsonStr.startsWith('[')) {
    const start = jsonStr.indexOf('[');
    const end = jsonStr.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      jsonStr = jsonStr.substring(start, end + 1);
    }
  }

  // Fix common JSON issues (trailing commas)
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
      // Ensure dialog count matches panel count
      dialog: story.dialog.length >= panelCount
        ? story.dialog.slice(0, panelCount)
        : [...story.dialog, ...Array(panelCount - story.dialog.length).fill('...')],
    }));
}
