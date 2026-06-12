import { useState } from 'react';
import toast from 'react-hot-toast';
import { Moon, Sun, Bell, Monitor, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
      checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-600'
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, updateUser } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(
    user?.settings?.emailNotifications ?? true
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authService.updateProfile({
        settings: { darkMode, emailNotifications },
      });
      updateUser(res.user);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your application preferences
        </p>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Appearance</h3>

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <Toggle checked={darkMode} onChange={toggleDarkMode} />
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Receive email updates about your tasks
              </p>
            </div>
          </div>
          <Toggle checked={emailNotifications} onChange={() => setEmailNotifications((p) => !p)} />
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Monitor size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Real-time Sync</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live updates via WebSocket connection (always on)
              </p>
            </div>
          </div>
          <Toggle checked={true} onChange={() => {}} />
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary mt-4">
          {saving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Save size={16} /> Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
