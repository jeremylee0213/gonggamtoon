import type { GeneratedStory, Style, ThemeMeta } from '../types';
import { STORY_GENERATION_COUNT } from '../data/panelLayouts';

interface StoryGenConfig {
  style: Style | null;
  customStyleInput: string;
  theme: ThemeMeta | null;
  customThemeInput: string;
  panelCount: number;
}

// 반전 유형 목록 (다양한 kick 유도)
const KICK_TYPES = [
  '웃긴 반전 (코미디)',
  '찔리는 반전 (자기 성찰)',
  '감동적 반전 (눈물)',
  '아이러니 반전 (상황 역전)',
];

// 톤 분배 (4개 스토리 각각 다른 톤)
const TONE_PRESETS = [
  '밝고 유쾌한 톤 (ㅋㅋ 웃기는 상황)',
  '잔잔하고 공감되는 톤 (아.. 나도 그래)',
  '약간 씁쓸한 톤 (웃프다)',
  '따뜻하고 감성적인 톤 (힐링)',
];

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

  return `당신은 시니어 공감 웹툰 스토리 작가입니다. 수백만 독자의 "아 나도!" 공감을 이끌어낸 경력 10년 차.
아래 조건에 맞는 공감툰 스토리를 정확히 ${STORY_GENERATION_COUNT}개 생성해주세요.

=== 조건 ===
• 만화 스타일: ${styleName}
• 메인 캐릭터: ${character}
• 공감 주제: ${themeName}${themeDesc ? ` — ${themeDesc}` : ''}
• 컷 수: ${panelCount}컷 (각 컷에 대사 1개씩)

=== 공감 트리거 가이드 ===
• 독자가 "이거 완전 나잖아!" 하고 소리칠 만한 초구체적 일상 상황을 선택
• 누구나 한 번쯤 경험했지만 말로 표현 못했던 순간을 포착
• 한국 일상 소품/배경 활용: 편의점, 카페, 지하철, 이불 속, 핸드폰, 카톡, 배달앱, 알람시계 등
• SNS에서 "이거 공유 필수ㅋㅋ" 반응이 나올 수준의 공감도

=== 기승전결 컷 배분 (${panelCount}컷) ===
• 도입 (${intro}컷): 평화로운 일상, 캐릭터 소개, 밝은 분위기
• 전개 (${develop}컷): 상황에 빠져드는 과정, 점진적 몰입
• 절정 (${climax}컷): 예상 못한 반전! 가장 임팩트 있는 순간
• 결말 (${ending}컷): 여운 있는 마무리, 내레이션으로 감성 마무리

=== 스토리 작성 규칙 ===
1. 공감 핵심: "${themeName}" 경험자가 무릎을 탁 칠 만한 초구체적 상황
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
4. 대사 다양성: 감탄사, 독백, 대화, 속마음, 효과음 등 다양하게 활용
   - 좋은 예: "하...오늘도 이불 밖은 위험해" / "(속마음) 제발 나한테 말 걸지 마..." / "뭐?! 벌써 3시간?!"
   - 나쁜 예: 모든 컷이 "~했다" "~이다" 형태의 단조로운 서술
5. dialog 배열은 정확히 ${panelCount}개 (각 컷마다 1개의 대사)
6. summary: 스토리의 가장 웃기거나 공감되는 핵심 장면을 한 문장으로 압축
   - 좋은 예: "라면 끓이다 과집중해서 라면이 죽이 된 사연"
   - 좋은 예: "약속 취소 문자에 이불 속에서 만세 부르는 내향인"
   - 좋은 예: "면접에서 자기소개 하다가 갑자기 실존적 위기 온 사람"
   - 나쁜 예: "ADHD인 사람의 이야기" (너무 추상적)
7. narration: 마지막 컷의 감성 내레이션 (독자의 마음을 울리는 한 문장)
   - 좋은 예: "그의 타이머는 오늘도 무시당했다... 그리고 라면은 죽이 되었다."
   - 좋은 예: "그렇게 오늘도 내일의 나에게 모든 것을 위임했다."
8. 4개 스토리는 각각 완전히 다른 상황, 다른 톤, 다른 반전 (중복 절대 금지)

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

중요: 순수 JSON 배열만 출력하세요. 백틱(\`\`\`)이나 다른 텍스트를 포함하지 마세요.`;
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
