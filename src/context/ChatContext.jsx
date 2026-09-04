import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { conversationService } from '../services/conversationService';
import { messageService } from '../services/messageService';
import { useAuth } from './AuthContext.jsx';
import { useSocket } from './SocketContext.jsx';
import { useToast } from './ToastContext.jsx';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { toast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [page, setPage] = useState(1);
  const [typingUsers, setTypingUsers] = useState({}); // conversationId -> name

  const activeConversationRef = useRef(null);
  activeConversationRef.current = activeConversation;

  // ---- Load conversations ----
  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    try {
      const data = await conversationService.getAll();
      setConversations(data.conversations);
    } catch (err) {
      toast.error('Could not load conversations.');
    } finally {
      setLoadingConversations(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
    }
  }, [user, loadConversations]);

  // ---- Open / start a conversation ----
  const openConversation = useCallback((conversation) => {
    setActiveConversation(conversation);
  }, []);

  const startConversationWithUser = useCallback(
    async (otherUser) => {
      try {
        const data = await conversationService.create(otherUser._id);
        const conv = data.conversation;
        setConversations((prev) => {
          const exists = prev.find((c) => c._id === conv._id);
          if (exists) return prev;
          return [conv, ...prev];
        });
        setActiveConversation(conv);
        return conv;
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not start conversation.');
        return null;
      }
    },
    [toast]
  );

  // ---- Load messages for active conversation ----
  const loadMessages = useCallback(
    async (conversationId) => {
      setLoadingMessages(true);
      setMessages([]);
      setPage(1);
      try {
        const data = await messageService.getMessages(conversationId, 1);
        setMessages(data.messages);
        setHasMoreMessages(data.hasMore);
      } catch (err) {
        toast.error('Could not load messages.');
      } finally {
        setLoadingMessages(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const loadMoreMessages = useCallback(async () => {
    if (!activeConversation || loadingMoreMessages || !hasMoreMessages) return;
    setLoadingMoreMessages(true);
    try {
      const nextPage = page + 1;
      const data = await messageService.getMessages(activeConversation._id, nextPage);
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMoreMessages(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      toast.error('Could not load earlier messages.');
    } finally {
      setLoadingMoreMessages(false);
    }
  }, [activeConversation, loadingMoreMessages, hasMoreMessages, page, toast]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation._id);
      socket?.emit('join_conversation', activeConversation._id);
    }
    return () => {
      if (activeConversation) {
        socket?.emit('leave_conversation', activeConversation._id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?._id, socket]);

  // ---- Helper: bump conversation to top with latest message info ----
  const upsertConversationPreview = useCallback((conversationId, patch) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c._id === conversationId);
      if (idx === -1) return prev;
      const updated = { ...prev[idx], ...patch };
      const rest = prev.filter((c) => c._id !== conversationId);
      return [updated, ...rest];
    });
  }, []);

  // ---- Send message ----
  const sendMessage = useCallback(
    async ({ content, attachment, messageType }) => {
      if (!activeConversation) return;
      const receiverId = activeConversation.otherUser._id;

      const data = await messageService.send({
        conversationId: activeConversation._id,
        receiverId,
        content,
        messageType: messageType || 'text',
        attachment: attachment || undefined,
      });

      const message = data.message;
      setMessages((prev) => [...prev, message]);

      socket?.emit('send_message', { conversationId: activeConversation._id, message });

      upsertConversationPreview(activeConversation._id, {
        lastMessage: message,
        lastMessageAt: message.createdAt,
      });

      return message;
    },
    [activeConversation, socket, upsertConversationPreview]
  );

  // ---- Delete message ----
  const deleteMessage = useCallback(
    async (messageId) => {
      try {
        await messageService.remove(messageId);
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m))
        );
        if (activeConversation) {
          socket?.emit('message_deleted', { conversationId: activeConversation._id, messageId });
        }
        toast.success('Message deleted.');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not delete message.');
      }
    },
    [activeConversation, socket, toast]
  );

  // ---- React to message ----
  const reactToMessage = useCallback(
    async (messageId, emoji) => {
      try {
        const data = await messageService.react(messageId, emoji);
        setMessages((prev) => prev.map((m) => (m._id === messageId ? data.message : m)));
        if (activeConversation) {
          socket?.emit('message_reaction', {
            conversationId: activeConversation._id,
            message: data.message,
          });
        }
      } catch (err) {
        toast.error('Could not react to message.');
      }
    },
    [activeConversation, socket, toast]
  );

  // ---- Typing ----
  const emitTypingStart = useCallback(() => {
    if (!activeConversation || !user) return;
    socket?.emit('typing_start', {
      conversationId: activeConversation._id,
      userId: user._id,
      name: user.name,
    });
  }, [activeConversation, socket, user]);

  const emitTypingStop = useCallback(() => {
    if (!activeConversation || !user) return;
    socket?.emit('typing_stop', {
      conversationId: activeConversation._id,
      userId: user._id,
    });
  }, [activeConversation, socket, user]);

  // ---- Socket event listeners (registered once per socket instance) ----
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      const conversationId = message.conversationId;
      const isActive = activeConversationRef.current?._id === conversationId;

      if (isActive) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
        // mark delivered/read immediately since conversation is open
        messageService.markAsRead(message._id).catch(() => {});
        socket.emit('message_read', { conversationId, messageId: message._id });
      } else {
        socket.emit('message_delivered', { conversationId, messageId: message._id });
      }

      setConversations((prev) => {
        const exists = prev.find((c) => c._id === conversationId);
        if (!exists) {
          // Conversation not in list yet (first message from someone new) — reload list
          loadConversations();
          return prev;
        }
        const updated = prev.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                lastMessage: message,
                lastMessageAt: message.createdAt,
                unreadCount: isActive ? 0 : (c.unreadCount || 0) + 1,
              }
            : c
        );
        const target = updated.find((c) => c._id === conversationId);
        const rest = updated.filter((c) => c._id !== conversationId);
        return [target, ...rest];
      });
    };

    const handleTypingStart = ({ conversationId, name }) => {
      setTypingUsers((prev) => ({ ...prev, [conversationId]: name }));
    };

    const handleTypingStop = ({ conversationId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });
    };

    const handleMessageDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId && m.status === 'sent' ? { ...m, status: 'delivered' } : m))
      );
    };

    const handleMessageRead = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, status: 'read' } : m))
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted' } : m
        )
      );
    };

    const handleMessageReaction = ({ message }) => {
      setMessages((prev) => prev.map((m) => (m._id === message._id ? message : m)));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);
    socket.on('message_delivered', handleMessageDelivered);
    socket.on('message_read', handleMessageRead);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('message_reaction', handleMessageReaction);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
      socket.off('message_delivered', handleMessageDelivered);
      socket.off('message_read', handleMessageRead);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('message_reaction', handleMessageReaction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const value = {
    conversations,
    loadingConversations,
    activeConversation,
    messages,
    loadingMessages,
    loadingMoreMessages,
    hasMoreMessages,
    typingUserForActive: activeConversation ? typingUsers[activeConversation._id] : null,
    openConversation,
    startConversationWithUser,
    loadMoreMessages,
    sendMessage,
    deleteMessage,
    reactToMessage,
    emitTypingStart,
    emitTypingStop,
    refreshConversations: loadConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
