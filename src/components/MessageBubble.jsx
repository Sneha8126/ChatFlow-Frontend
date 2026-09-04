import React, { useState } from 'react';
import { Check, CheckCheck, Copy, Trash2, SmilePlus, MoreHorizontal } from 'lucide-react';
import { formatMessageTime } from '../utils/formatters';
import { MessageAttachment } from './AttachmentPreview.jsx';
import EmojiPicker, { QUICK_REACTIONS } from './EmojiPicker.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function MessageBubble({
  message,
  isOwn,
  showAvatar,
  onDelete,
  onReact,
  onImageClick,
  highlighted,
}) {
  const { toast } = useToast();
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || '');
      toast.success('Message copied to clipboard.');
    } catch (err) {
      toast.error('Could not copy message.');
    }
  };

  const handleDeleteClick = () => {
    onDelete(message._id);
  };

  const reactionCounts = (message.reactions || []).reduce((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className={`message-row group flex gap-2 px-4 lg:px-6 ${isOwn ? 'justify-end' : 'justify-start'} ${
        highlighted ? 'bg-amber-50 -mx-2 px-6 rounded-lg' : ''
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowReactionPicker(false);
      }}
    >
      <div className={`flex items-end gap-1.5 max-w-[78%] lg:max-w-[65%] ${isOwn ? 'flex-row-reverse' : ''}`}>
        {/* Actions */}
        <div
          className={`flex items-center gap-0.5 mb-1 transition-opacity ${
            showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="relative">
            <button
              onClick={() => setShowReactionPicker((v) => !v)}
              className="message-actions p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              aria-label="React to message"
            >
              <SmilePlus className="w-4 h-4" />
            </button>
            {showReactionPicker && (
              <div className="absolute bottom-full mb-1 bg-white border border-surface-border rounded-full shadow-popover px-2 py-1.5 flex gap-1 z-30 whitespace-nowrap animate-slideUp"
                style={isOwn ? { right: 0 } : { left: 0 }}
              >
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact(message._id, emoji);
                      setShowReactionPicker(false);
                    }}
                    className="text-base hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          {message.content && !message.isDeleted && (
            <button
              onClick={handleCopy}
              className="message-actions p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              aria-label="Copy message"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          {isOwn && !message.isDeleted && (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-rose-600 hover:bg-white"
              aria-label="Delete message"
              title="Delete message"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bubble */}
        <div>
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              message.isDeleted
                ? 'bg-gray-100 text-gray-400 italic'
                : isOwn
                ? 'message-bubble-own text-white rounded-br-md'
                : 'message-bubble-other text-gray-800 rounded-bl-md'
            }`}
          >
            {message.attachment && !message.isDeleted && (
              <div className={message.content ? 'mb-1.5' : ''}>
                <MessageAttachment
                  attachment={message.attachment}
                  messageType={message.messageType}
                  onImageClick={onImageClick}
                />
              </div>
            )}
            {message.content && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
          </div>

          <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-[11px] text-gray-400">{formatMessageTime(message.createdAt)}</span>
            {isOwn && !message.isDeleted && (
              <span className="text-gray-400">
                {message.status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-primary-500" />
                ) : message.status === 'delivered' ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </div>

          {Object.keys(reactionCounts).length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
              {Object.entries(reactionCounts).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReact(message._id, emoji)}
                  className="flex items-center gap-0.5 bg-white border border-surface-border rounded-full px-1.5 py-0.5 text-xs shadow-soft hover:bg-surface-muted transition-colors"
                >
                  <span>{emoji}</span>
                  {count > 1 && <span className="text-[10px] text-gray-500">{count}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
