import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ChatPanel from './components/layout/ChatPanel';
import ToastContainer from './components/common/Toast';

export default function App() {
  return (
    <div className="min-h-screen bg-surface text-text">
      <Header />
      <div className="flex max-w-[1400px] mx-auto h-[calc(100vh-56px)] max-md:flex-col">
        <Sidebar />
        <ChatPanel />
      </div>
      <ToastContainer />
    </div>
  );
}
