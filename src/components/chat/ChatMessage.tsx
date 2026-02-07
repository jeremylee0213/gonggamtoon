import type { ChatMessage as ChatMessageType } from '../../types';
import CopyButton from '../common/CopyButton';
import PasteGuidance from './PasteGuidance';
import { Bot, User, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isFirstPrompt?: boolean;
}

export default function ChatMessage({ message, isFirstPrompt = false }: ChatMessageProps) {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex gap-4 animate-[fadeIn_0.3s_ease-in-out] ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
        isBot ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'
      }`}>
        {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      <div className={`max-w-[85%] ${isBot ? '' : 'text-right'}`}>
        {message.type === 'prompt' && message.prompt ? (
          <div className="bg-card rounded-2xl border border-border p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            {isFirstPrompt && <PasteGuidance />}

            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold">AI 프롬프트</span>
              <CopyButton text={message.prompt} label="프롬프트 복사" />
            </div>

            <pre className="bg-surface rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap border border-border max-h-[50vh] overflow-y-auto font-mono">
              {message.prompt}
            </pre>

            <div className="mt-4 flex justify-center">
              <CopyButton text={message.prompt} label="프롬프트 복사하기" />
            </div>
          </div>
        ) : message.type === 'error' ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 dark:bg-red-900/20 dark:border-red-800">
            <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <p className="text-base text-error">{message.content}</p>
          </div>
        ) : (
          <div className={`rounded-2xl px-5 py-3 text-base leading-relaxed ${
            isBot
              ? 'bg-card border border-border shadow-sm'
              : 'bg-primary text-white shadow-[0_2px_8px_rgba(0,122,255,0.2)]'
          }`}>
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}
