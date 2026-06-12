import { CheckCircle, PlusCircle, Trash2, RotateCcw, Edit3, LogIn, UserCircle } from 'lucide-react';
import { timeAgo, getInitials } from '../utils/helpers';

const iconMap = {
  task_created: { icon: PlusCircle, color: 'text-primary bg-primary/10' },
  task_completed: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-500/10' },
  task_deleted: { icon: Trash2, color: 'text-red-500 bg-red-100 dark:bg-red-500/10' },
  task_reopened: { icon: RotateCcw, color: 'text-amber-500 bg-amber-100 dark:bg-amber-500/10' },
  task_updated: { icon: Edit3, color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/10' },
  login: { icon: LogIn, color: 'text-accent bg-accent/10' },
  register: { icon: UserCircle, color: 'text-secondary bg-secondary/10' },
  profile_updated: { icon: Edit3, color: 'text-blue-500 bg-blue-100 dark:bg-blue-500/10' },
};

const ActivityFeed = ({ activities = [], emptyMessage = 'No recent activity' }) => {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <UserCircle className="mb-2 text-slate-300 dark:text-slate-600" size={32} />
        <p className="text-sm text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const config = iconMap[activity.action] || iconMap.task_updated;
        const Icon = config.icon;
        return (
          <div key={activity._id} className="flex gap-3">
            <div className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${config.color}`}>
              <Icon size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-700 dark:text-slate-200">{activity.description}</p>
              <p className="mt-0.5 text-xs text-slate-400">{timeAgo(activity.createdAt)}</p>
            </div>
            {activity.user?.avatar !== undefined && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white">
                {getInitials(activity.user?.name)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
