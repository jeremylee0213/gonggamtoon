import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import ChatMessage from './ChatMessage';
import EmptyState from './EmptyState';
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loadingIdx, setLoadingIdx] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGeneratingStories]);

  // Rotate loading messages
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
    return <EmptyState />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ scrollbarWidth: 'thin' }}>
      {messages.map((msg, idx) => (
        <ChatMessage key={msg.id} message={msg} isFirstPrompt={msg.type === 'prompt' && !messages.slice(0, idx).some(m => m.type === 'prompt')} />
      ))}

      {isGeneratingStories && (
        <LoadingSpinner text={LOADING_MESSAGES[loadingIdx]} />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
