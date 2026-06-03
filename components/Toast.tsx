import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md animate-slide-up
            ${toast.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/80 dark:border-red-800 dark:text-red-100' : ''}
            ${toast.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/80 dark:border-green-800 dark:text-green-100' : ''}
            ${toast.type === 'info' ? 'bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-900/80 dark:border-blue-800 dark:text-blue-100' : ''}
          `}
          role="alert"
        >
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <p className="text-sm font-bold flex-1">{toast.message}</p>
          <button 
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
