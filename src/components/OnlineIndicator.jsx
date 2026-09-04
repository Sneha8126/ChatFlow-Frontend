import React from 'react';

export default function OnlineIndicator({ isOnline, className = '', size = 'sm' }) {
  const dim = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <span
      className={`${dim} rounded-full block ${
        isOnline ? 'bg-emerald-500' : 'bg-gray-300'
      } ${className}`}
      aria-label={isOnline ? 'Online' : 'Offline'}
    />
  );
}
