import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import ChatMessage from './ChatMessage';
import LoadingSpinner from '../common/LoadingSpinner';

const LOADING_MESSAGES = [
  'AI가 스토리를 구상하고 있어요...',
  '공감 포인트를 찾는 중...',
  '반전 아이디어를 떠올리는 중...',
  '캐릭터에 생명을 불어넣는 중...',
  '대사를 다듬는 중...',
  '기승전결을 맞추는 중...',
];

export default function ChatContainer() {
  const messages = useAppStore((s) => s.messages);
  const isGeneratingStories = useAppStore((s) => s.isGeneratingStories);
  const topRef = useRef<HTMLDivElement>(null);
  const [loadingIdx, setLoadingIdx] = useState(0);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages]);

  useEffect(() => {
    if (!isGeneratingStories) {
      setLoadingIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isGeneratingStories]);

  if (messages.length === 0 && !isGeneratingStories) {
    return null;
  }

  // Reverse: newest prompt first
  const reversed = [...messages].reverse();

  return (
    <div className="space-y-4">
      <div ref={topRef} />

      {isGeneratingStories && (
        <LoadingSpinner text={LOADING_MESSAGES[loadingIdx]} />
      )}

      {reversed.map((msg, idx) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isFirstPrompt={msg.type === 'prompt' && idx === reversed.findIndex(m => m.type === 'prompt')}
        />
      ))}
    </div>
  );
}
