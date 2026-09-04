export function formatMessageTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatLastSeen(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatConversationTimestamp(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const isToday = now.toDateString() === then.toDateString();
  if (isToday) {
    return then.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === then.toDateString()) {
    return 'Yesterday';
  }
  const diffDays = Math.floor((now - then) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return then.toLocaleDateString([], { weekday: 'short' });
  }
  return then.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatDateSeparator(date) {
  const now = new Date();
  const then = new Date(date);
  const isToday = now.toDateString() === then.toDateString();
  if (isToday) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === then.toDateString()) return 'Yesterday';

  return then.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
}

export function isSameDay(dateA, dateB) {
  return new Date(dateA).toDateString() === new Date(dateB).toDateString();
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const avatarColors = [
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
];

export function getAvatarColor(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatarColors.length;
  return avatarColors[index];
}
