import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp } from 'lucide-react';
import { taskService } from '../services/taskService';
import { activityService } from '../services/activityService';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import ActivityFeed from '../components/ActivityFeed';
import { StatCardSkeleton } from '../components/Skeletons';
import { useAuth } from '../context/AuthContext';

const PRIORITY_COLORS = { High: '#EF4444', Medium: '#F59E0B', Low: '#10B981' };

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          taskService.getDashboardStats(),
          activityService.getActivityLogs(8),
        ]);
        setStats(statsData.stats);
        setActivities(activityData.activities);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const priorityData = stats?.priorityBreakdown?.map((p) => ({
    name: p._id,
    value: p.count,
    color: PRIORITY_COLORS[p._id] || '#94A3B8',
  })) || [];

  // Build last 7 days chart data
  const weeklyChartData = (() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const found = stats?.weeklyCompletions?.find((w) => w._id === key);
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: found ? found.count : 0,
      });
    }
    return days;
  })();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} color="bg-primary" />
            <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="bg-emerald-500" />
            <StatCard title="Pending" value={stats.pending + stats.inProgress} icon={Clock} color="bg-amber-500" />
            <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} color="bg-red-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Productivity overview */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Productivity Overview</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tasks completed in the last 7 days</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={14} />
              {stats?.completionPercentage || 0}% Complete
            </div>
          </div>

          {loading ? (
            <div className="skeleton h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="completed" fill="#4F46E5" radius={[8, 8, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="mt-6 space-y-4">
            <ProgressBar
              label="Overall Completion"
              value={stats?.completionPercentage || 0}
              color="bg-gradient-to-r from-primary to-secondary"
            />
            <ProgressBar
              label="Pending Tasks"
              value={stats?.total ? Math.round((stats.pending / stats.total) * 100) : 0}
              color="bg-amber-500"
            />
            <ProgressBar
              label="In Progress"
              value={stats?.total ? Math.round((stats.inProgress / stats.total) * 100) : 0}
              color="bg-blue-500"
            />
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="card p-5">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Priority Breakdown</h3>
          {loading ? (
            <div className="skeleton h-48 w-full" />
          ) : priorityData.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              No tasks yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}

          <div className="mt-4 space-y-2">
            {priorityData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{p.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6 p-5">
        <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
