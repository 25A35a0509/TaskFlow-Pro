import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCircle, Trash2, RotateCcw, PlusCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { timeAgo } from '../utils/helpers';

const iconMap = {
  task_created: PlusCircle,
  task_completed: CheckCircle,
  task_deleted: Trash2,
  task_reopened: RotateCcw,
  task_updated: Bell,
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open) markAllAsRead();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border px-4 py-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="mb-2 text-slate-300 dark:text-slate-600" size={32} />
                <p className="text-sm text-slate-400">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-dark-border">
                {notifications.map((n) => {
                  const Icon = iconMap[n.type] || Bell;
                  return (
                    <div key={n.id} className="flex gap-3 px-4 py-3">
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-200">{n.message}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
