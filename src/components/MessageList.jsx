import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { MessageSkeleton } from './LoadingSkeleton.jsx';
import { formatDateSeparator, isSameDay } from '../utils/formatters';

export default function MessageList({
  messages,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  currentUserId,
  onDeleteMessage,
  onReact,
  typingUser,
  highlightedMessageId,
  otherUser,
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const prevScrollHeightRef = useRef(0);
  const isInitialLoad = useRef(true);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!loading && messages.length > 0 && isInitialLoad.current) {
      scrollToBottom('auto');
      isInitialLoad.current = false;
    }
  }, [loading, messages.length, scrollToBottom]);

  useEffect(() => {
    // Auto scroll to bottom on new message if user is near the bottom
    const container = containerRef.current;
    if (!container || isInitialLoad.current) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 200) {
      scrollToBottom('smooth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, typingUser]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollButton(distanceFromBottom > 300);

    if (container.scrollTop < 80 && hasMore && !loadingMore) {
      prevScrollHeightRef.current = container.scrollHeight;
      onLoadMore?.();
    }
  };

  // Preserve scroll position after loading older messages
  useEffect(() => {
    if (!loadingMore && prevScrollHeightRef.current && containerRef.current) {
      const container = containerRef.current;
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  }, [loadingMore, messages.length]);

  if (loading) {
    return <MessageSkeleton />;
  }

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto py-4 flex flex-col gap-1"
      >
        {loadingMore && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-400">Loading earlier messages...</span>
          </div>
        )}

        {messages.map((msg, idx) => {
          const prev = messages[idx - 1];
          const showDateSeparator = !prev || !isSameDay(prev.createdAt, msg.createdAt);
          const senderId = msg.senderId?._id || msg.senderId;
          const isOwn = senderId === currentUserId;
          const nextMsg = messages[idx + 1];
          const nextSenderId = nextMsg?.senderId?._id || nextMsg?.senderId;
          const showAvatar = !nextMsg || nextSenderId !== senderId;

          return (
            <React.Fragment key={msg._id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center my-3">
                  <span className="text-[11px] font-medium text-gray-400 bg-surface-muted px-3 py-1 rounded-full">
                    {formatDateSeparator(msg.createdAt)}
                  </span>
                </div>
              )}
              <div className="py-0.5">
                <MessageBubble
                  message={msg}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  onDelete={onDeleteMessage}
                  onReact={onReact}
                  onImageClick={setLightboxUrl}
                  highlighted={msg._id === highlightedMessageId}
                />
              </div>
            </React.Fragment>
          );
        })}

        {typingUser && <TypingIndicator name={typingUser} />}

        <div ref={bottomRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-4 right-4 lg:right-6 w-9 h-9 bg-white border border-surface-border shadow-card rounded-full flex items-center justify-center text-gray-500 hover:text-primary-600 transition-colors animate-bounceIn"
          aria-label="Scroll to latest message"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      )}

      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-gray-900/80 z-[80] flex items-center justify-center p-6 animate-fadeIn"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Enlarged attachment"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
