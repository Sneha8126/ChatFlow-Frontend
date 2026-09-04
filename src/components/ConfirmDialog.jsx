import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm animate-fadeIn"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-popover w-full max-w-sm p-6 animate-bounceIn">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${
            danger ? 'bg-rose-50' : 'bg-primary-50'
          }`}
        >
          <AlertTriangle className={`w-5 h-5 ${danger ? 'text-rose-500' : 'text-primary-500'}`} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1.5">{title}</h3>
        {message && <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${
              danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
