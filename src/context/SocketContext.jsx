import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem('chatflow_token');

    if (!user || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
        setConnected(false);
      }
      return;
    }

    // Avoid creating duplicate connections
    if (socketRef.current) return;

    const socket = io('/', {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('user_online', ({ userId }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });

    socket.on('user_offline', ({ userId }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setSocketInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const isUserOnline = useCallback((userId) => onlineUserIds.has(userId), [onlineUserIds]);

  return (
    <SocketContext.Provider
      value={{ socket: socketInstance, connected, onlineUserIds, isUserOnline }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within a SocketProvider');
  return ctx;
}
