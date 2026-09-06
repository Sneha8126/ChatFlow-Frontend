import React from 'react';

export default function TypingIndicator({ name }) {
  return (
    <div className="typing-indicator flex items-center gap-2 px-6 py-1 animate-fadeIn">
      <div className="typing-bubble bg-white border border-surface-border rounded-2xl rounded-bl-md px-4 py-2.5 shadow-soft flex items-center gap-1">
        <span className="typing-dot w-1.5 h-1.5 rounded-full animate-pulseDot" style={{ animationDelay: '0ms' }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full animate-pulseDot" style={{ animationDelay: '200ms' }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full animate-pulseDot" style={{ animationDelay: '400ms' }} />
      </div>
      {name && <span className="text-xs text-gray-400">{name} is typing...</span>}
    </div>
  );
}
