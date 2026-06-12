import { useState, useEffect } from 'react';
import { activityService } from '../services/activityService';
import ActivityFeed from '../components/ActivityFeed';
import { ListSkeleton } from '../components/Skeletons';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService
      .getActivityLogs(50)
      .then((data) => setActivities(data.activities))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Activity Logs</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          A complete history of your recent actions
        </p>
      </div>

      <div className="card p-5">
        {loading ? <ListSkeleton count={5} /> : <ActivityFeed activities={activities} />}
      </div>
    </div>
  );
};

export default Activity;
