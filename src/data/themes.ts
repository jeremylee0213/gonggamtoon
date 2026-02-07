import type { Theme, ThemeMeta } from '../types';

export const THEME_CATEGORIES = [
  { key: '심리', label: '심리/성향', emoji: '🧠' },
  { key: '감정', label: '감정/관계', emoji: '💭' },
  { key: '일상', label: '일상/직장', emoji: '🏢' },
  { key: '19금', label: '19금 (섹드립)', emoji: '🔞' },
] as const;

export const themeMetaList: ThemeMeta[] = [
  // 심리/성향
  { key: 'ADHD', name: 'ADHD', emoji: '🧠', description: '과집중, 산만함, 시간감각 상실', category: '심리' },
  { key: 'HSP', name: 'HSP', emoji: '🌸', description: '고민감성, 감각 과부하, 감정 스펀지', category: '심리' },
  { key: 'INFJ', name: 'INFJ', emoji: '🔮', description: '에너지 방전, 이상주의, 겉바속촉', category: '심리' },
  { key: '조용한ADHD', name: '조용한ADHD', emoji: '🤫', description: '겉은 조용 속은 카오스, 감정 지연', category: '심리' },
  { key: '내향형', name: '내향형', emoji: '🏠', description: '혼자가 편해, 약속 취소 환호', category: '심리' },
  { key: '완벽주의', name: '완벽주의', emoji: '💎', description: '시작 못 함, 끝없는 수정, 비교 지옥', category: '심리' },
  { key: '가면증후군', name: '가면증후군', emoji: '🎭', description: '나만 사기꾼 같아, 성공해도 불안', category: '심리' },
  { key: '선택장애', name: '선택장애', emoji: '🤔', description: '메뉴 고르기 30분, 결정 후 후회', category: '심리' },
  // 감정/관계
  { key: '사회불안', name: '사회불안', emoji: '😰', description: '발표 공포, 시선 의식, 주문 공포', category: '감정' },
  { key: '감정조절', name: '감정조절', emoji: '🎭', description: '감정 폭발, 분노 조절, 눈물 스위치', category: '감정' },
  { key: '자존감', name: '자존감', emoji: '💔', description: '자기 비하, 칭찬 거부, 남과 비교', category: '감정' },
  { key: '연애', name: '연애', emoji: '💕', description: '읽씹 불안, 밀당, 감정 롤러코스터', category: '감정' },
  { key: '외로움', name: '외로움', emoji: '🌧️', description: '혼자인 밤, 연락 없는 주말, 공허함', category: '감정' },
  // 일상/직장
  { key: '번아웃', name: '번아웃', emoji: '🔥', description: '무감각, 동기 상실, 만성 피로', category: '일상' },
  { key: '미루기', name: '미루기', emoji: '⏰', description: '내일의 나에게 맡기기, 마감 부스터', category: '일상' },
  { key: '수면장애', name: '수면장애', emoji: '🌙', description: '불면, 낮밤 전환, 알람 무효', category: '일상' },
  { key: '육아스트레스', name: '육아스트레스', emoji: '👶', description: '수면 부족, 자유 상실, 체력 방전', category: '일상' },
  { key: '직장생활', name: '직장생활', emoji: '💼', description: '야근, 눈치, 회의 지옥, 월요병', category: '일상' },
  { key: '시험불안', name: '시험불안', emoji: '📝', description: '벼락치기, 머리 백지, 시험 후 자책', category: '일상' },
  { key: '코딩번아웃', name: '코딩번아웃', emoji: '💻', description: '버그 지옥, 야근, 기술 부채', category: '일상' },
  // 19금 (섹드립 수준 — 이미지 생성 가능한 수위)
  { key: '야한상상', name: '야한 상상', emoji: '🫣', description: '은밀한 망상, 갑자기 떠오르는 야릇한 생각', category: '19금' },
  { key: '야한실수', name: '야한 실수', emoji: '😳', description: '의도치 않은 신체 접촉, 민망한 순간', category: '19금' },
  { key: '썸탈때', name: '썸 탈 때', emoji: '🫠', description: '설레는 스킨십, 심쿵 순간, 야릇한 눈빛', category: '19금' },
  { key: '커플밤문화', name: '커플 밤문화', emoji: '🌙', description: '둘만의 비밀, 은밀한 데이트, 야한 장난', category: '19금' },
  { key: '직장섹드립', name: '직장 섹드립', emoji: '💼', description: '회식 후 분위기, 엘리베이터 긴장감', category: '19금' },
  { key: '혼자만의밤', name: '혼자만의 밤', emoji: '🛏️', description: '야한 영상 들킬 뻔, 혼자 부끄러운 순간', category: '19금' },
  { key: '수영장에피소드', name: '수영장 에피소드', emoji: '👙', description: '비키니 시선 강탈, 선크림 발라주기', category: '19금' },
  { key: '오해받는상황', name: '오해받는 상황', emoji: '🤭', description: '야한 소리로 오해, 엉뚱한 자세 들킴', category: '19금' },
];

// 기존 themeData는 참고용으로 유지
export const themeData: Record<string, Theme> = {
  ADHD: {
    name: 'ADHD',
    stories: [
      { title: '과집중 모드', desc: '좋아하는 일에 시간이 사라짐', kick: '라면이 죽이 됨 🍜', dialog: ['이거 재밌다!', '5분만 더...', '어? 밤이야?!', '내 라면...ㅠㅠ'], narration: '그의 라면은 오늘도 죽이 되었다.' },
      { title: '청각 과민', desc: '작은 소리가 천둥처럼', kick: '모기에 방 반파 💥', dialog: ['오늘은 꿀잠~', '위이잉...?!', '으악!!', '적어도 잡았으니...'], narration: '빈대 잡다 초가삼간 태움.' },
    ],
  },
  HSP: {
    name: 'HSP',
    stories: [
      { title: '감각 과부하', desc: '밝은 빛, 큰 소리, 강한 냄새', kick: '마트가 던전 🏪', dialog: ['마트만 갔다올게', '(쾅쾅 찌직)', '머리가...', '집 가고 싶어...'], narration: '마트 10분이 보스전 같다.' },
    ],
  },
};
