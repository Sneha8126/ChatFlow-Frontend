import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Paperclip, Smile, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from './EmojiPicker.jsx';
import { PendingAttachment } from './AttachmentPreview.jsx';
import { uploadService } from '../services/uploadService';
import { useToast } from '../context/ToastContext.jsx';

export default function MessageInput({ onSend, onTypingStart, onTypingStop, disabled }) {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);

    if (e.target.value && !isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      onTypingStop?.();
    }, 1500);

    // auto-resize
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTypingStop?.();
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  }, [onTypingStop]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB.');
      return;
    }
    setPendingFile(file);
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
    e.target.value = '';
  };

  const removeAttachment = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPendingFile(null);
    setPreviewUrl(null);
    setUploadProgress(null);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if ((!trimmed && !pendingFile) || sending) return;

    setSending(true);
    stopTyping();

    try {
      let attachment = null;
      let messageType = 'text';

      if (pendingFile) {
        setUploadProgress(0);
        const data = await uploadService.uploadFile(pendingFile, setUploadProgress);
        attachment = data.attachment;
        messageType = pendingFile.type.startsWith('image/') ? 'image' : 'file';
      }

      await onSend({ content: trimmed, attachment, messageType });

      setText('');
      removeAttachment();
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = (text.trim().length > 0 || pendingFile) && !sending;

  return (
    <div className="border-t border-surface-border bg-white px-3 lg:px-6 py-3">
      {pendingFile && (
        <PendingAttachment
          file={pendingFile}
          previewUrl={previewUrl}
          progress={uploadProgress}
          onRemove={removeAttachment}
        />
      )}
      <div className="flex items-end gap-1.5">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-surface-muted rounded-xl transition-colors shrink-0"
          aria-label="Attach file"
          disabled={disabled}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <div className="flex items-end bg-surface-muted rounded-2xl px-3 py-1.5 min-h-[44px]">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={stopTyping}
              placeholder={disabled ? 'Select a conversation to start chatting' : 'Type a message...'}
              disabled={disabled}
              className="flex-1 bg-transparent resize-none py-1.5 text-sm text-gray-800 placeholder:text-gray-400 max-h-[120px] disabled:cursor-not-allowed"
            />
            <div className="relative shrink-0">
              <button
                onClick={() => setShowEmoji((v) => !v)}
                className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-colors"
                aria-label="Insert emoji"
                disabled={disabled}
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmoji && (
                <EmojiPicker
                  anchorClassName="bottom-full right-0 mb-2"
                  onSelect={(emoji) => {
                    setText((t) => t + emoji);
                    textareaRef.current?.focus();
                  }}
                  onClose={() => setShowEmoji(false)}
                />
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend || disabled}
          className={`p-2.5 rounded-xl transition-all shrink-0 ${
            canSend && !disabled
              ? 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'
              : 'bg-surface-muted text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
