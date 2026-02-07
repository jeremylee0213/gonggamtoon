import ChatContainer from '../chat/ChatContainer';

export default function ChatPanel() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-100 bg-white shrink-0">
        <h2 className="text-sm font-bold text-text">프롬프트 결과</h2>
        <p className="text-xs text-muted">생성된 프롬프트가 여기에 표시됩니다</p>
      </div>
      <ChatContainer />
    </main>
  );
}
