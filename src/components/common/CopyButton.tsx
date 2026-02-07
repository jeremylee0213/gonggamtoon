import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { showToast } from './Toast';

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
        flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold cursor-pointer transition-colors
        ${copied
          ? 'bg-success text-white'
          : 'bg-accent text-white hover:bg-accent/90'
        }
      `}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? '복사 완료!' : label}
    </button>
  );
}
