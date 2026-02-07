/** Expanded emotion types for more nuanced comic expressions (#21) */
export const EMOTION_TYPES: Record<string, { ko: string; prompt: string }> = {
  happy: { ko: '기쁨', prompt: 'bright smiling face, sparkling eyes, upturned mouth' },
  sad: { ko: '슬픔', prompt: 'teary eyes, downturned mouth, drooping eyebrows' },
  angry: { ko: '분노', prompt: 'furrowed brows, clenched teeth, red face, vein pop' },
  surprised: { ko: '놀람', prompt: 'wide open eyes, dropped jaw, raised eyebrows' },
  thinking: { ko: '생각', prompt: 'hand on chin, tilted head, eyes looking up, thought bubble' },
  frustrated: { ko: '억울함', prompt: 'watery eyes with tight lips, flushed cheeks, trembling' },
  guilty: { ko: '찔림', prompt: 'avoiding eye contact, cold sweat, stiff posture, nervous smile' },
  embarrassed: { ko: '민망함', prompt: 'deep red blush, avoiding gaze, hand covering face, steam from head' },
  proud: { ko: '뿌듯함', prompt: 'chest puffed, satisfied smile, closed eyes, sparkle aura' },
  bittersweet: { ko: '씁쓸함', prompt: 'half-smile with sad eyes, slight head tilt, wistful gaze' },
  exhausted: { ko: '지침', prompt: 'dark circles, droopy eyes, slumped posture, soul leaving body' },
  panicked: { ko: '패닉', prompt: 'spiral eyes, flailing arms, sweat drops flying, shaking lines' },
  relieved: { ko: '안도', prompt: 'exhaling breath, relaxed shoulders, gentle smile, sparkle' },
  jealous: { ko: '질투', prompt: 'side-eye glance, pursed lips, dark aura, green tint' },
};

/** Emotion detection from dialog text — expanded version of getEmotionForDialog (#21) */
export function detectEmotion(dialog: string, phaseIndex: number, isKick: boolean): string {
  if (isKick) return 'surprised';
  if (dialog.includes('억울') || dialog.includes('왜 나만')) return 'frustrated';
  if (dialog.includes('찔') || dialog.includes('뜨끔') || dialog.includes('어...')) return 'guilty';
  if (dialog.includes('민망') || dialog.includes('창피') || dialog.includes('부끄')) return 'embarrassed';
  if (dialog.includes('뿌듯') || dialog.includes('해냈다') || dialog.includes('성공')) return 'proud';
  if (dialog.includes('씁쓸') || dialog.includes('그래도') || dialog.includes('괜찮아')) return 'bittersweet';
  if (dialog.includes('지친') || dialog.includes('피곤') || dialog.includes('힘들')) return 'exhausted';
  if (dialog.match(/[!?]{2,}|으악|어어어|헉/)) return 'panicked';
  if (dialog.includes('휴') || dialog.includes('다행') || dialog.includes('살았다')) return 'relieved';
  if (dialog.includes('부럽') || dialog.includes('좋겠다') || dialog.includes('질투')) return 'jealous';
  if (dialog.includes('!') && dialog.includes('ㅠ')) return 'sad';
  if (dialog.match(/!{2,}|으악|윽/)) return 'angry';
  if (dialog.includes('...')) return 'thinking';
  if (dialog.startsWith('(속') || dialog.includes('속마음')) return 'thinking';
  if (dialog.includes('?!') || dialog.includes('뭐') || dialog.includes('어?')) return 'surprised';
  if (phaseIndex === 0) return 'happy';
  if (phaseIndex === 3) return 'bittersweet';
  return 'happy';
}

/** Sound effects library per emotion (#28) */
export const SFX_LIBRARY: Record<string, string[]> = {
  happy: ['반짝반짝✨', '두근두근💓', '루루루♪', '야호!🎉'],
  sad: ['뚝뚝💧', '흑흑😢', '시무룩...', '쿨럭...'],
  angry: ['부글부글🔥', '으드득💢', '꽉!', '부르르💀'],
  surprised: ['헉!😱', '어?!', '뭐?!💥', '쨘!⚡'],
  thinking: ['흠...🤔', '음...', '그러니까...', '잠깐💭'],
  frustrated: ['억울해...😤', '왜 나만!', '끙...', '으으...'],
  guilty: ['뜨끔!😅', '찔림...', '어...그게...', '쿨럭😰'],
  embarrassed: ['///// 😳', '아아아!', '창피해...', '(쥐구멍)'],
  proud: ['후후후😏', '해냈다!✨', '나 좀 멋진데?', '짜잔!🎊'],
  bittersweet: ['하하...😅', '그래도...', '괜찮아...', '에잇...'],
  exhausted: ['하아...😩', '피곤...', '(영혼 이탈)', 'zzz...💤'],
  panicked: ['으아악!🚨', '어어어?!', '살려줘!', '큰일났다!'],
  relieved: ['휴~😌', '살았다...', '다행이야...', '후...😮‍💨'],
  jealous: ['치...😒', '부럽다...', '좋겠다...', '나는 언제...'],
};
