import { ClipboardList } from 'lucide-react';

export default function PasteGuidance() {
  return (
    <div className="bg-[#E8F4F7] border border-[#4A90A4]/30 rounded-xl p-4 mb-3">
      <div className="flex items-center gap-2 mb-2.5">
        <ClipboardList className="w-4 h-4 text-[#4A90A4]" />
        <span className="text-sm font-bold text-[#2C6E7E]">프롬프트 사용 방법</span>
      </div>
      <ol className="space-y-1.5 text-xs text-[#3A7A8A]">
        <li className="flex items-start gap-2">
          <span className="font-bold shrink-0">1.</span>
          <span>아래 <strong>[복사]</strong> 버튼 클릭</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-bold shrink-0">2.</span>
          <span>나노바나나 프로 열기</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-bold shrink-0">3.</span>
          <span>프롬프트 입력창에 붙여넣기 (Ctrl+V / Cmd+V)</span>
        </li>
      </ol>
    </div>
  );
}
