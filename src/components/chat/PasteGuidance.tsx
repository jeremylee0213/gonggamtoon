import { ClipboardList } from 'lucide-react';

export default function PasteGuidance() {
  return (
    <div className="bg-primary-light border border-primary/20 rounded-2xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-5 h-5 text-primary" />
        <span className="text-base font-bold text-primary-dark">프롬프트 사용 방법</span>
      </div>
      <ol className="space-y-2 text-sm text-primary-dark/80">
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
