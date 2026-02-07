import { lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import MainContent from './components/layout/MainContent';
import ToastContainer from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const OnboardingTour = lazy(() => import('./components/common/OnboardingTour'));

export default function App() {
  useKeyboardShortcuts();

  return (
    <ErrorBoundary fallbackMessage="앱에 문제가 발생했어요">
      <div className="min-h-screen bg-surface text-text">
        <Header />
        <MainContent />
        <ToastContainer />
        <Suspense fallback={null}>
          <OnboardingTour />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
