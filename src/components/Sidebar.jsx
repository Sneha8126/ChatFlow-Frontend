import React, { useState, useCallback } from 'react';
import { MessageCircle, Settings, LogOut, X, UserPlus } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import ConversationList from './ConversationList.jsx';
import UserAvatar from './UserAvatar.jsx';
import OnlineIndicator from './OnlineIndicator.jsx';
import { NoSearchResults } from './EmptyStates.jsx';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Sidebar({
  conversations,
  loadingConversations,
  activeConversationId,
  onSelectConversation,
  onStartConversation,
  isOpen,
  onClose,
  onOpenProfile,
  onOpenSettings,
}) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (term) => {
    if (!term) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const data = await userService.search(term);
      setSearchResults(data.users);
    } catch (err) {
      toast.error('Could not search users right now.');
    } finally {
      setSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
    } catch (err) {
      toast.error('Something went wrong logging out.');
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/30 z-30 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[320px] max-w-[85vw] bg-white border-r border-surface-border flex flex-col transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <MessageCircle className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">ChatFlow</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <SearchBar placeholder="Search people..." onSearch={handleSearch} />
        </div>

        {/* Body: search results or conversation list */}
        <div className="flex-1 overflow-y-auto">
          {searchResults !== null ? (
            <div className="pt-1">
              <p className="px-4 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                {searching ? 'Searching...' : `People (${searchResults.length})`}
              </p>
              {searchResults.length === 0 && !searching ? (
                <NoSearchResults />
              ) : (
                searchResults.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => onStartConversation(u)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-muted transition-colors text-left"
                  >
                    <UserAvatar user={u} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400 truncate">@{u.username}</span>
                        {u.isOnline && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600">
                            <OnlineIndicator isOnline size="sm" /> Online
                          </span>
                        )}
                      </div>
                    </div>
                    <UserPlus className="w-4 h-4 text-gray-300" />
                  </button>
                ))
              )}
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              loading={loadingConversations}
              activeConversationId={activeConversationId}
              onSelect={onSelectConversation}
              currentUserId={user?._id}
              onFindPeople={() => document.querySelector('aside input')?.focus()}
            />
          )}
        </div>

        {/* Footer: profile / settings / logout */}
        <div className="border-t border-surface-border px-3 py-3 flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 flex-1 min-w-0 rounded-xl px-2 py-1.5 hover:bg-surface-muted transition-colors"
          >
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">@{user?.username}</p>
            </div>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-surface-muted rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </div>
      </aside>
    </>
  );
}
