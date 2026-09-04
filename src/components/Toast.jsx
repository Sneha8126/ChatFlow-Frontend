import React from 'react';
import { CheckCircle2, XCircle, Info, MessageCircle, X } from 'lucide-react';

const iconMap = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-rose-500" />,
  info: <Info className="w-5 h-5 text-primary-500" />,
  message: <MessageCircle className="w-5 h-5 text-primary-500" />,
};

export default function Toast({ message, type = 'info', title, onClose }) {
  return (
    <div className="pointer-events-auto animate-slideInRight bg-white border border-surface-border shadow-popover rounded-xl px-4 py-3 flex items-start gap-3 min-w-[280px] max-w-sm">
      <div className="mt-0.5">{iconMap[type] || iconMap.info}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold text-gray-900">{title}</p>}
        <p className="text-sm text-gray-600 leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
