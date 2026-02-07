import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { showToast } from './Toast';
import confetti from 'canvas-confetti';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = '복사' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast('클립보드에 복사했어요!', 'success');

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#007AFF', '#5856D6', '#34C759', '#FF9500'],
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('복사에 실패했어요', 'error');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-bold cursor-pointer transition-all
        ${copied
          ? 'bg-success text-white shadow-[0_2px_8px_rgba(102,187,106,0.3)]'
          : 'bg-primary text-white hover:bg-primary-dark shadow-[0_2px_8px_rgba(76,175,80,0.3)] hover:shadow-[0_4px_12px_rgba(76,175,80,0.4)] hover:-translate-y-0.5'
        }
      `}
    >
      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      {copied ? '복사 완료!' : label}
    </button>
  );
}
