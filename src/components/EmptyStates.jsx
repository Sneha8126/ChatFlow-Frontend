import React from 'react';
import { MessageSquareText, Users } from 'lucide-react';

export function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-surface-soft">
      <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
        <MessageSquareText className="w-9 h-9 text-primary-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1.5">Welcome to ChatFlow</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Select a conversation to start chatting.
      </p>
    </div>
  );
}

export function EmptyConversations({ onFindPeople }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        <Users className="w-7 h-7 text-primary-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">No conversations yet</h3>
      <p className="text-xs text-gray-500 max-w-[220px] mb-4">
        Find someone and start a conversation.
      </p>
      {onFindPeople && (
        <button
          onClick={onFindPeople}
          className="text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3.5 py-2 rounded-lg transition-colors"
        >
          Search people
        </button>
      )}
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-10">
      <p className="text-sm text-gray-500">No people found matching your search.</p>
    </div>
  );
}
