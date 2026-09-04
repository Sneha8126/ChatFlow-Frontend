import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * Generic, reusable empty state for any list/section in the app.
 * For the chat-specific variants already wired into the UI
 * (EmptyChat, EmptyConversations, NoSearchResults), see EmptyStates.jsx.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-gray-500 max-w-[240px] mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
