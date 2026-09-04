import React, { useState } from 'react';
import { X, Lock, Bell, Eye, Palette, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { userService } from '../services/userService';

const SECTIONS = [
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="pr-4">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? 'bg-primary-600' : 'bg-gray-200'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPanel({ onClose }) {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState(
    user?.settings || {
      showOnlineStatus: true,
      showLastSeen: true,
      showReadReceipts: true,
      messageNotifications: true,
      soundNotifications: true,
    }
  );
  const [savingSettings, setSavingSettings] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const persistSettings = async (nextSettings) => {
    setSettings(nextSettings);
    setSavingSettings(true);
    try {
      const data = await userService.updateProfile({ settings: nextSettings });
      updateUser(data.user);
    } catch (err) {
      toast.error('Could not update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    setChangingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="settings-shell relative bg-white rounded-2xl shadow-popover w-full max-w-2xl h-[560px] max-h-[85vh] flex overflow-hidden animate-bounceIn">
        {/* Sidebar */}
        <div className="settings-nav w-44 shrink-0 border-r border-surface-border bg-surface-soft py-4 hidden sm:flex flex-col">
          <h2 className="text-sm font-bold text-gray-900 px-4 mb-3">Settings</h2>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                activeSection === s.id
                  ? 'bg-primary-50 text-primary-700 font-medium border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-surface-muted'
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="settings-content-header flex items-center justify-between px-6 py-4 border-b border-surface-border">
            <h3 className="text-base font-semibold text-gray-900 capitalize">{activeSection}</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-surface-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeSection === 'account' && (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Full name</p>
                    <p className="text-gray-800 font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Username</p>
                    <p className="text-gray-800 font-medium">@{user?.username}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <p className="text-gray-800 font-medium">{user?.email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  To update your name, username or bio, open your profile from the sidebar.
                </p>

                <div className="border-t border-surface-border pt-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Change password</h4>
                  <form onSubmit={handlePasswordSubmit} className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                      className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:border-primary-400 transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:border-primary-400 transition-colors"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:border-primary-400 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors flex items-center gap-1.5"
                    >
                      {changingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                      Update password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="divide-y divide-surface-border">
                <Toggle
                  label="Show online status"
                  description="Let others see when you're active"
                  checked={settings.showOnlineStatus}
                  onChange={(v) => persistSettings({ ...settings, showOnlineStatus: v })}
                />
                <Toggle
                  label="Show last seen"
                  description="Let others see when you were last active"
                  checked={settings.showLastSeen}
                  onChange={(v) => persistSettings({ ...settings, showLastSeen: v })}
                />
                <Toggle
                  label="Read receipts"
                  description="Let others know when you've read their messages"
                  checked={settings.showReadReceipts}
                  onChange={(v) => persistSettings({ ...settings, showReadReceipts: v })}
                />
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="divide-y divide-surface-border">
                <Toggle
                  label="Message notifications"
                  description="Get notified about new messages"
                  checked={settings.messageNotifications}
                  onChange={(v) => persistSettings({ ...settings, messageNotifications: v })}
                />
                <Toggle
                  label="Sound notifications"
                  description="Play a sound for new messages"
                  checked={settings.soundNotifications}
                  onChange={(v) => persistSettings({ ...settings, soundNotifications: v })}
                />
                <p className="text-xs text-gray-400 pt-3">
                  Browser notification permission is only requested if you enable it explicitly here — never automatically.
                </p>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  ChatFlow currently uses a premium light theme, designed for clarity and comfort.
                </p>
                <div className="flex items-center gap-2 border border-primary-200 bg-primary-50 rounded-xl px-4 py-3 w-fit">
                  <Check className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">Light theme (active)</span>
                </div>
              </div>
            )}
          </div>

          {savingSettings && (
            <div className="px-6 py-2 text-xs text-gray-400 border-t border-surface-border">Saving...</div>
          )}
        </div>
      </div>
    </div>
  );
}
