import React, { useState } from 'react';
import { ArrowLeft, Search, MoreVertical, Menu } from 'lucide-react';
import UserAvatar from './UserAvatar.jsx';
import { formatLastSeen } from '../utils/formatters';
import { useSocket } from '../context/SocketContext.jsx';

export default function ChatHeader({ otherUser, onBack, onSearchMessages, onOpenProfile, typing }) {
  const { isUserOnline } = useSocket();
  const [menuOpen, setMenuOpen] = useState(false);
  const online = isUserOnline(otherUser?._id) || otherUser?.isOnline;

  return (
    <div className="chat-header flex items-center gap-3 px-4 lg:px-6 py-3 sticky top-0 z-10">
      <button
        onClick={onBack}
        className="lg:hidden p-1.5 -ml-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-surface-muted transition-colors"
        aria-label="Back to conversations"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <button className="chat-header-avatar flex items-center gap-3 min-w-0 flex-1 text-left" onClick={onOpenProfile}>
        <UserAvatar user={{ ...otherUser, isOnline: online }} size="sm" showOnline />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{otherUser?.name}</p>
          <p className="text-xs text-gray-400 truncate">
            {typing ? (
              <span className="text-primary-600 font-medium">typing...</span>
            ) : online ? (
              <span className="text-emerald-600">Online</span>
            ) : otherUser?.lastSeen ? (
              `Last seen ${formatLastSeen(otherUser.lastSeen)}`
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </button>

      <button
        onClick={onSearchMessages}
        className="chat-header-actions p-2 text-gray-400 hover:text-gray-700 hover:bg-surface-muted rounded-lg transition-colors"
        aria-label="Search messages"
      >
        <Search className="w-[18px] h-[18px]" />
      </button>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="chat-header-actions p-2 text-gray-400 hover:text-gray-700 hover:bg-surface-muted rounded-lg transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-[18px] h-[18px]" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-surface-border rounded-xl shadow-popover py-1 z-20 animate-slideUp">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenProfile?.();
                }}
                className="w-full text-left px-3.5 py-2 text-sm text-gray-700 hover:bg-surface-muted"
              >
                View profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
