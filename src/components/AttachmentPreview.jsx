import React from 'react';
import { FileText, X, Download, File as FileIcon } from 'lucide-react';
import { formatFileSize } from '../utils/formatters';

// Used in the message composer before sending
export function PendingAttachment({ file, previewUrl, progress, onRemove }) {
  const isImage = file.type?.startsWith('image/');
  return (
    <div className="relative inline-flex items-center gap-2 bg-surface-muted border border-surface-border rounded-xl p-2 pr-3 mb-2 animate-slideUp">
      {isImage && previewUrl ? (
        <img src={previewUrl} alt={file.name} className="w-12 h-12 rounded-lg object-cover" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-500" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-800 truncate max-w-[140px]">{file.name}</p>
        <p className="text-[11px] text-gray-400">{formatFileSize(file.size)}</p>
        {typeof progress === 'number' && progress < 100 && (
          <div className="h-1 bg-gray-200 rounded-full mt-1 w-24 overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors"
        aria-label="Remove attachment"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// Used inside a message bubble to render a sent attachment
export function MessageAttachment({ attachment, messageType, onImageClick }) {
  if (!attachment) return null;

  if (messageType === 'image') {
    return (
      <img
        src={attachment.url}
        alt={attachment.fileName || 'image'}
        onClick={() => onImageClick?.(attachment.url)}
        className="rounded-xl max-w-[240px] max-h-[280px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
      />
    );
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      download={attachment.fileName}
      className="flex items-center gap-3 bg-white/60 hover:bg-white rounded-xl p-2.5 pr-3 transition-colors min-w-[200px]"
    >
      <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
        <FileIcon className="w-4 h-4 text-primary-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-800 truncate">{attachment.fileName}</p>
        <p className="text-[11px] text-gray-400">{formatFileSize(attachment.fileSize)}</p>
      </div>
      <Download className="w-4 h-4 text-gray-400 shrink-0" />
    </a>
  );
}
