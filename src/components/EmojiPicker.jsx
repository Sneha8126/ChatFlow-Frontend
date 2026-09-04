import React, { useEffect, useRef } from 'react';

const EMOJI_CATEGORIES = [
  {
    label: 'Smileys',
    emojis: ['😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😜', '🤔', '😎', '🥳', '😇', '🙂', '😢', '😭', '😡', '😱', '🥺', '😴', '🤗'],
  },
  {
    label: 'Gestures',
    emojis: ['👍', '👎', '👏', '🙌', '🤝', '🙏', '💪', '👋', '✌️', '🤞', '👌', '🤙'],
  },
  {
    label: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💕', '💯'],
  },
  {
    label: 'Objects',
    emojis: ['🔥', '🎉', '🎂', '🎁', '⭐', '✅', '❌', '⚡', '☕', '📎', '📷', '🎵'],
  },
];

export const QUICK_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

export default function EmojiPicker({ onSelect, onClose, anchorClassName = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute z-50 bg-white border border-surface-border rounded-2xl shadow-popover p-3 w-72 max-h-80 overflow-y-auto animate-slideUp ${anchorClassName}`}
    >
      {EMOJI_CATEGORIES.map((cat) => (
        <div key={cat.label} className="mb-3 last:mb-0">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5 px-1">
            {cat.label}
          </p>
          <div className="grid grid-cols-8 gap-1">
            {cat.emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onSelect(emoji)}
                className="text-lg leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-muted transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
