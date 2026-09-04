import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import { EmptyChat } from '../components/EmptyStates.jsx';
import ProfileModal from '../components/ProfileModal.jsx';
import SettingsPanel from '../components/SettingsPanel.jsx';
import { Menu } from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Chat() {
  const { user } = useAuth();
  const {
    conversations,
    loadingConversations,
    activeConversation,
    openConversation,
    startConversationWithUser,
  } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleSelectConversation = (conv) => {
    openConversation(conv);
    setSidebarOpen(false);
  };

  const handleStartConversation = async (otherUser) => {
    await startConversationWithUser(otherUser);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      <Sidebar
        conversations={conversations}
        loadingConversations={loadingConversations}
        activeConversationId={activeConversation?._id}
        onSelectConversation={handleSelectConversation}
        onStartConversation={handleStartConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenProfile={() => setProfileUser(user)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile top bar shown only when no conversation is open */}
        {!activeConversation && (
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-surface-border">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-surface-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-gray-900">ChatFlow</span>
          </div>
        )}

        {activeConversation ? (
          <ChatWindow
            onBack={() => openConversation(null)}
            onOpenProfile={() => setProfileUser(activeConversation.otherUser)}
          />
        ) : (
          <EmptyChat />
        )}
      </main>

      {profileUser && <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} />}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
}
