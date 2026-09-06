import React from 'react';
import { MessageSquareText, Users, SearchX } from 'lucide-react';

export function EmptyChat() {
  return (
    <div className="empty-chat-shell flex-1 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <div className="empty-chat-blob empty-chat-blob-a" aria-hidden="true" />
      <div className="empty-chat-blob empty-chat-blob-b" aria-hidden="true" />
      <div className="empty-illustration relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-5">
        <MessageSquareText className="w-9 h-9 text-white" strokeWidth={1.5} />
      </div>
      <h2 className="relative z-10 text-lg font-semibold text-gray-900 mb-1.5">Welcome to ChatFlow</h2>
      <p className="relative z-10 text-sm text-gray-500 max-w-xs">
        Select a conversation to start chatting.
      </p>
    </div>
  );
}

export function EmptyConversations({ onFindPeople }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="empty-illustration empty-illustration-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
        <Users className="w-7 h-7 text-white" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">No conversations yet</h3>
      <p className="text-xs text-gray-500 max-w-[220px] mb-4">
        Find someone and start a conversation.
      </p>
      {onFindPeople && (
        <button
          onClick={onFindPeople}
          className="find-people-btn text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
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
      <div className="empty-illustration empty-illustration-sm w-12 h-12 rounded-xl flex items-center justify-center mb-3">
        <SearchX className="w-5 h-5 text-white" strokeWidth={1.5} />
      </div>
      <p className="text-sm text-gray-500">No people found matching your search.</p>
    </div>
  );
}
