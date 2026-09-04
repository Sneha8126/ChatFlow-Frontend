import React, { useState, useCallback } from 'react';
import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import MessageInput from './MessageInput.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useChat } from '../context/ChatContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ChatWindow({ onBack, onOpenProfile }) {
  const { user } = useAuth();
  const {
    activeConversation,
    messages,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    loadMoreMessages,
    sendMessage,
    deleteMessage,
    reactToMessage,
    emitTypingStart,
    emitTypingStop,
    typingUserForActive,
  } = useChat();

  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleDeleteRequest = useCallback((messageId) => {
    setPendingDeleteId(messageId);
  }, []);

  const confirmDelete = () => {
    if (pendingDeleteId) {
      deleteMessage(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-surface-soft">
      <ChatHeader
        otherUser={activeConversation.otherUser}
        onBack={onBack}
        onOpenProfile={onOpenProfile}
        typing={!!typingUserForActive}
      />
      <MessageList
        messages={messages}
        loading={loadingMessages}
        loadingMore={loadingMoreMessages}
        hasMore={hasMoreMessages}
        onLoadMore={loadMoreMessages}
        currentUserId={user?._id}
        onDeleteMessage={handleDeleteRequest}
        onReact={reactToMessage}
        typingUser={typingUserForActive}
        otherUser={activeConversation.otherUser}
      />
      <MessageInput
        onSend={sendMessage}
        onTypingStart={emitTypingStart}
        onTypingStop={emitTypingStop}
      />

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete this message?"
        message="This action cannot be undone. The message will be removed for everyone in this conversation."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
