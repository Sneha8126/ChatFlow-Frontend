import React, { useState } from 'react';
import { X, Pencil, Check, Loader2 } from 'lucide-react';
import UserAvatar from './UserAvatar.jsx';
import { formatLastSeen } from '../utils/formatters';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { userService } from '../services/userService';

export default function ProfileModal({ user: viewedUser, onClose }) {
  const { user: currentUser, updateUser } = useAuth();
  const { toast } = useToast();
  const isOwnProfile = !viewedUser || viewedUser._id === currentUser?._id;
  const profile = isOwnProfile ? currentUser : viewedUser;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    username: currentUser?.username || '',
    bio: currentUser?.bio || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await userService.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="modal-card relative bg-white rounded-2xl shadow-popover w-full max-w-sm animate-bounceIn overflow-hidden">
        <div className="modal-banner h-20 bg-gradient-to-r from-primary-500 to-primary-700 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-10">
          <UserAvatar user={profile} size="xl" showOnline className="ring-4 ring-white rounded-full" />

          <div className="mt-4">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Full name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:border-primary-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Username</label>
                  <input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:border-primary-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={2}
                    maxLength={160}
                    className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:border-primary-400 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setEditing(false)}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditing(true)}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Edit profile"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-400">@{profile.username}</p>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{profile.bio}</p>

                <div className="mt-4 pt-4 border-t border-surface-border space-y-2">
                  {isOwnProfile && profile.email && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Email</span>
                      <span className="text-gray-700 font-medium">{profile.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Status</span>
                    <span className={`font-medium ${profile.isOnline ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {profile.isOnline ? 'Online' : profile.lastSeen ? `Last seen ${formatLastSeen(profile.lastSeen)}` : 'Offline'}
                    </span>
                  </div>
                  {profile.createdAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Joined</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(profile.createdAt).toLocaleDateString([], {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
