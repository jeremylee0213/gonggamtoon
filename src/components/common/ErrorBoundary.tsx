import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-error mx-auto mb-3" />
          <p className="text-base font-bold text-error mb-2">
            {this.props.fallbackMessage ?? '오류가 발생했어요'}
          </p>
          <p className="text-sm text-muted mb-4">{this.state.error?.message}</p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-primary-dark transition-colors shadow-[0_2px_8px_rgba(76,175,80,0.3)]"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
