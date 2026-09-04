import React from 'react';

export function ConversationSkeleton({ count = 6 }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="skeleton w-11 h-11 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="skeleton h-3 w-2/3 rounded" />
            <div className="skeleton h-2.5 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageSkeleton() {
  const widths = ['w-40', 'w-56', 'w-32', 'w-64', 'w-44'];
  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      {widths.map((w, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div className={`skeleton h-9 ${w} rounded-2xl`} />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="skeleton w-20 h-20 rounded-full" />
      <div className="skeleton h-4 w-32 rounded" />
      <div className="skeleton h-3 w-48 rounded" />
    </div>
  );
}
