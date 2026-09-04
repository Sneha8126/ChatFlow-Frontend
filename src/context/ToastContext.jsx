import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast.jsx';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', options = {}) => {
      const id = ++idCounter;
      const toast = { id, message, type, ...options };
      setToasts((prev) => [...prev, toast]);
      const duration = options.duration ?? 4000;
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (msg, opts) => showToast(msg, 'success', opts),
    error: (msg, opts) => showToast(msg, 'error', opts),
    info: (msg, opts) => showToast(msg, 'info', opts),
    message: (msg, opts) => showToast(msg, 'message', opts),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
