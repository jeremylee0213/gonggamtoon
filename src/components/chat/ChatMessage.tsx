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
    <div className={`flex gap-3 animate-[fadeIn_0.3s_ease-in-out] ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isBot ? 'bg-primary-light text-primary' : 'bg-accent-light text-accent'
      }`}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className={`max-w-[85%] ${isBot ? '' : 'text-right'}`}>
        {message.type === 'prompt' && message.prompt ? (
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            {isFirstPrompt && <PasteGuidance />}

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">AI 프롬프트</span>
              <CopyButton text={message.prompt} label="프롬프트 복사" />
            </div>

            <pre className="bg-surface rounded-lg p-3 text-xs leading-relaxed whitespace-pre-wrap border border-border max-h-[50vh] overflow-y-auto font-mono">
              {message.prompt}
            </pre>

            <div className="mt-3 flex justify-center">
              <CopyButton text={message.prompt} label="프롬프트 복사하기" />
            </div>
          </div>
        ) : message.type === 'error' ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
            <p className="text-sm text-error">{message.content}</p>
          </div>
        ) : (
          <div className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
            isBot
              ? 'bg-card border border-border'
              : 'bg-accent text-white'
          }`}>
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}
