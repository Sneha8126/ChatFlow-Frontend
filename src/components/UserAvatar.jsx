import React from 'react';
import { getInitials, getAvatarColor } from '../utils/formatters';
import OnlineIndicator from './OnlineIndicator.jsx';

const sizeMap = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

export default function UserAvatar({ user, size = 'md', showOnline = false, className = '' }) {
  const dimensions = sizeMap[size] || sizeMap.md;
  const name = user?.name || '?';

  return (
    <div className={`relative shrink-0 ${className}`}>
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={name}
          className={`${dimensions} rounded-full object-cover ring-1 ring-black/5`}
        />
      ) : (
        <div
          className={`${dimensions} rounded-full flex items-center justify-center font-semibold ring-1 ring-black/5 ${getAvatarColor(
            name
          )}`}
        >
          {getInitials(name)}
        </div>
      )}
      {showOnline && (
        <OnlineIndicator
          isOnline={user?.isOnline}
          className="absolute bottom-0 right-0 ring-2 ring-white"
        />
      )}
    </div>
  );
}
