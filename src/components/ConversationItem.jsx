import React from 'react';
import UserAvatar from './UserAvatar.jsx';
import { formatConversationTimestamp } from '../utils/formatters';
import { useSocket } from '../context/SocketContext.jsx';
import { Check, CheckCheck, Image as ImageIcon, FileText } from 'lucide-react';

export default function ConversationItem({ conversation, isActive, onClick, currentUserId }) {
  const { isUserOnline } = useSocket();
  const other = conversation.otherUser;
  const lastMessage = conversation.lastMessage;
  const online = isUserOnline(other?._id) || other?.isOnline;

  const isOwnLastMessage = lastMessage?.senderId === currentUserId || lastMessage?.senderId?._id === currentUserId;

  let preview = 'Start a conversation';
  let previewIcon = null;
  if (lastMessage) {
    if (lastMessage.isDeleted) {
      preview = 'This message was deleted';
    } else if (lastMessage.messageType === 'image') {
      preview = 'Photo';
      previewIcon = <ImageIcon className="w-3.5 h-3.5" />;
    } else if (lastMessage.messageType === 'file') {
      preview = 'File attachment';
      previewIcon = <FileText className="w-3.5 h-3.5" />;
    } else {
      preview = lastMessage.content;
    }
  }

  return (
    <button
      onClick={onClick}
      className={`conversation-item w-full flex items-center gap-3 px-4 py-3 transition-colors text-left group ${
        isActive ? 'conversation-item-active bg-primary-50' : 'hover:bg-surface-muted'
      }`}
    >
      <UserAvatar user={{ ...other, isOnline: online }} size="md" showOnline />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm truncate ${
              conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-800'
            }`}
          >
            {other?.name || 'Unknown user'}
          </p>
          <span
            className={`text-[11px] shrink-0 ${
              conversation.unreadCount > 0 ? 'text-primary-600 font-semibold' : 'text-gray-400'
            }`}
          >
            {formatConversationTimestamp(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p
            className={`text-xs truncate flex items-center gap-1 ${
              conversation.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'
            }`}
          >
            {isOwnLastMessage && lastMessage && !lastMessage.isDeleted && (
              <span className="shrink-0 text-gray-400">
                {lastMessage.status === 'read' ? (
                  <CheckCheck className="w-3.5 h-3.5 text-primary-500" />
                ) : lastMessage.status === 'delivered' ? (
                  <CheckCheck className="w-3.5 h-3.5" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </span>
            )}
            {previewIcon}
            <span className="truncate">{preview}</span>
          </p>
          {conversation.unreadCount > 0 && (
            <span className="unread-badge shrink-0 bg-primary-600 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center animate-bounceIn">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
