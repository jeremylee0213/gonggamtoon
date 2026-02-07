/**
 * 스타일별 추천 폰트 매핑
 * AI 이미지 생성 시 각 스타일에 어울리는 폰트를 프롬프트에 명시
 */

// 만화 스타일별 메인 폰트
export const styleFonts: Record<string, { title: string; dialog: string; narration: string; effect: string }> = {
  // 일본 애니메이션
  'Demon Slayer chibi': { title: 'bold brush stroke calligraphy', dialog: 'rounded gothic', narration: 'elegant serif', effect: 'sharp angular impact font' },
  'Naruto SD style': { title: 'bold brush ink calligraphy', dialog: 'thick rounded sans-serif', narration: 'handwritten brush', effect: 'explosive jagged font' },
  'One Piece chibi': { title: 'bold adventure display font', dialog: 'thick comic sans style', narration: 'treasure map serif', effect: 'bold impact with outline' },
  'Dragon Ball chibi': { title: 'ultra bold display', dialog: 'thick rounded', narration: 'clean serif', effect: 'explosive starburst font' },
  'Pokemon anime': { title: 'playful rounded bold', dialog: 'cute rounded sans-serif', narration: 'clean modern sans', effect: 'electric spark font' },
  'Crayon Shin-chan': { title: 'childlike crayon handwriting', dialog: 'messy childlike handwriting', narration: 'casual handwritten', effect: 'wobbly comic font' },
  'Doraemon': { title: 'friendly rounded bold', dialog: 'soft rounded sans-serif', narration: 'gentle serif', effect: 'puffy cloud-like font' },
  'Spy x Family chibi': { title: 'elegant spy thriller font', dialog: 'clean modern sans-serif', narration: 'sophisticated serif', effect: 'sharp mission-style font' },
  'Jujutsu Kaisen chibi': { title: 'dark gothic brush', dialog: 'modern sans-serif', narration: 'mystical serif', effect: 'cursed energy distorted font' },
  'Studio Ghibli': { title: 'watercolor brush calligraphy', dialog: 'soft handwritten', narration: 'elegant flowing serif', effect: 'magical sparkle font' },
  'Hunter x Hunter': { title: 'bold gothic display', dialog: 'clean rounded', narration: 'thin elegant serif', effect: 'nen energy glowing font' },
  'Kirby style': { title: 'super cute bubbly font', dialog: 'round puffy sans-serif', narration: 'soft cute handwritten', effect: 'star-shaped pop font' },
  'Slam Dunk': { title: 'athletic bold condensed', dialog: 'strong sans-serif', narration: 'sports commentary serif', effect: 'basketball scoreboard font' },
  'Oshi no Ko': { title: 'idol sparkle display', dialog: 'trendy modern sans', narration: 'dramatic italic serif', effect: 'star glitter font' },
  'Chainsaw Man': { title: 'grungy distressed bold', dialog: 'rough sans-serif', narration: 'dark narrow serif', effect: 'blood splatter horror font' },
  'Attack on Titan chibi': { title: 'military stencil bold', dialog: 'condensed sans-serif', narration: 'historical serif', effect: 'titan rumble impact font' },
  'Bleach chibi': { title: 'elegant dark calligraphy', dialog: 'modern sans-serif', narration: 'soul society brush', effect: 'spiritual energy flowing font' },
  'Haikyuu': { title: 'dynamic sports display', dialog: 'energetic rounded', narration: 'clean modern serif', effect: 'volleyball spike impact font' },
  'Detective Conan': { title: 'mystery thriller display', dialog: 'clean modern sans', narration: 'newspaper serif', effect: 'magnifying glass reveal font' },
  'Gintama': { title: 'casual messy handwriting', dialog: 'loose comic font', narration: 'sarcastic italic', effect: 'comedic explosion font' },
  // 서양 카툰
  'Disney style': { title: 'magical fairy tale script', dialog: 'friendly rounded sans', narration: 'storybook serif', effect: 'sparkle magic font' },
  'Pixar style': { title: '3D bold playful font', dialog: 'modern friendly sans', narration: 'warm serif', effect: 'popping 3D impact font' },
  'The Simpsons': { title: 'chunky yellow cartoon font', dialog: 'thick comic sans', narration: 'TV narration serif', effect: 'doh! explosion font' },
  'Adventure Time': { title: 'wobbly adventure handwriting', dialog: 'quirky handwritten', narration: 'fantasy storybook', effect: 'mathematical! pop font' },
  'SpongeBob': { title: 'bubbly underwater font', dialog: 'bouncy comic sans', narration: 'nautical serif', effect: 'bubble pop font' },
  'Powerpuff Girls': { title: 'girly pop bold', dialog: 'cute sans-serif', narration: 'narrator dramatic serif', effect: 'POW! action font' },
  'Rick and Morty': { title: 'sci-fi distorted font', dialog: 'messy handwritten', narration: 'scientific mono', effect: 'portal swirl font' },
  'Marvel chibi': { title: 'heroic bold display', dialog: 'classic comic book font', narration: 'dramatic serif italic', effect: 'KAPOW! superhero impact' },
  'Minions style': { title: 'playful banana font', dialog: 'gibberish cute rounded', narration: 'clean sans-serif', effect: 'banana split pop font' },
  'Sanrio style': { title: 'adorable rounded pastel', dialog: 'super cute rounded', narration: 'sweet handwritten', effect: 'heart sparkle cute font' },
};

// 감정/상황별 폰트 효과
export const emotionFonts: Record<string, string> = {
  happy: 'bouncy rounded font with slight upward tilt, warm color',
  sad: 'thin drooping font with teardrops, blue-gray tone',
  angry: 'bold jagged sharp font, red/dark color, trembling effect',
  scared: 'shaky thin wobbly font, pale color, decreasing size',
  surprised: 'large expanding font with exclamation, bold outline',
  thinking: 'italic flowing font in thought bubble, lighter opacity',
  whisper: 'tiny thin font with dotted outline, light gray',
  shouting: 'ultra bold expanded font, red/orange, with speed lines',
  sarcastic: 'italic with quotation marks, slightly tilted',
  narration: 'elegant serif italic in caption box, muted tone',
};

// 기/승/전/결 단계별 분위기 폰트
export const phaseFonts: Record<string, string> = {
  '도입': 'clean and inviting font, medium weight, warm neutral tone',
  '전개': 'slightly dynamic font, medium-bold, engaging rhythm',
  '절정': 'dramatic bold font with effects, high contrast, maximum impact',
  '결말': 'reflective serif with warmth, medium weight, gentle closure tone',
};
