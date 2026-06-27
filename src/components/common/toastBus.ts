export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

type ToastListener = (toast: ToastData) => void;

let toastListener: ToastListener | null = null;

export function showToast(message: string, type: ToastData['type'] = 'info') {
  const toast: ToastData = {
    id: `toast-${Date.now()}`,
    message,
    type,
  };
  toastListener?.(toast);
}

export function subscribeToast(listener: ToastListener) {
  toastListener = listener;

  return () => {
    if (toastListener === listener) {
      toastListener = null;
    }
  };
}
