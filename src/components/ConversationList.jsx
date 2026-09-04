import React from 'react';
import ConversationItem from './ConversationItem.jsx';
import { ConversationSkeleton } from './LoadingSkeleton.jsx';
import { EmptyConversations } from './EmptyStates.jsx';

export default function ConversationList({
  conversations,
  loading,
  activeConversationId,
  onSelect,
  currentUserId,
  onFindPeople,
}) {
  if (loading) {
    return <ConversationSkeleton />;
  }

  if (!conversations || conversations.length === 0) {
    return <EmptyConversations onFindPeople={onFindPeople} />;
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv._id}
          conversation={conv}
          isActive={conv._id === activeConversationId}
          onClick={() => onSelect(conv)}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
