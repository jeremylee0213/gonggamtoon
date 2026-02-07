import type { ThemeMeta } from '../types';

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
  // 19금
  { key: '야한상상', name: '야한 상상', emoji: '🫣', description: '은밀한 망상, 갑자기 떠오르는 야릇한 생각', category: '19금' },
  { key: '야한실수', name: '야한 실수', emoji: '😳', description: '의도치 않은 신체 접촉, 민망한 순간', category: '19금' },
  { key: '썸탈때', name: '썸 탈 때', emoji: '🫠', description: '설레는 스킨십, 심쿵 순간, 야릇한 눈빛', category: '19금' },
  { key: '커플밤문화', name: '커플 밤문화', emoji: '🌙', description: '둘만의 비밀, 은밀한 데이트, 야한 장난', category: '19금' },
  { key: '직장섹드립', name: '직장 섹드립', emoji: '💼', description: '회식 후 분위기, 엘리베이터 긴장감', category: '19금' },
  { key: '혼자만의밤', name: '혼자만의 밤', emoji: '🛏️', description: '야한 영상 들킬 뻔, 혼자 부끄러운 순간', category: '19금' },
  { key: '수영장에피소드', name: '수영장 에피소드', emoji: '👙', description: '비키니 시선 강탈, 선크림 발라주기', category: '19금' },
  { key: '오해받는상황', name: '오해받는 상황', emoji: '🤭', description: '야한 소리로 오해, 엉뚱한 자세 들킴', category: '19금' },
  { key: '생리', name: '생리', emoji: '🩸', description: '생리통, 예민함, 컨디션 급변, 파트너 배려 이슈', category: '19금' },
  { key: '섹스', name: '섹스', emoji: '❤️‍🔥', description: '합의된 성관계 전후 긴장감, 텐션, 서로 다른 기대치', category: '19금' },
  { key: '발기부전', name: '발기부전', emoji: '🥀', description: '퍼포먼스 불안, 자존감 흔들림, 관계 대화의 어려움', category: '19금' },
  { key: '오르가즘', name: '오르가즘', emoji: '🌊', description: '절정 타이밍 차이, 만족도 차이, 소통의 필요', category: '19금' },
  { key: '피임', name: '피임', emoji: '🛡️', description: '피임 방식 선택, 책임 분담, 순간 판단의 긴장감', category: '19금' },
  { key: '성욕불일치', name: '성욕 불일치', emoji: '⚖️', description: '욕구 온도차, 거절의 상처, 타협과 조율', category: '19금' },
  { key: '애무', name: '애무', emoji: '💞', description: '전희 텐션, 호흡 맞추기, 리액션 해석의 오해', category: '19금' },
  { key: '관계후현타', name: '관계 후 현타', emoji: '🫥', description: '끝난 뒤 공허함, 애정 확인 욕구, 거리감 불안', category: '19금' },
  { key: '모텔데이트', name: '모텔 데이트', emoji: '🏩', description: '입실 전 어색함, 기대와 현실 괴리, 분위기 세팅', category: '19금' },
  { key: '콘돔실수', name: '콘돔 실수', emoji: '📦', description: '준비 부족, 타이밍 꼬임, 민망한 위기 상황', category: '19금' },
];
