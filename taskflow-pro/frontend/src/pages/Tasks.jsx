import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useDebounce } from '../hooks/useDebounce';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { ListSkeleton } from '../components/Skeletons';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [users, setUsers] = useState([]);

  const debouncedSearch = useDebounce(search, 400);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      status: status || undefined,
      priority: priority || undefined,
      sortBy,
      order,
      page,
      limit: 9,
    }),
    [debouncedSearch, status, priority, sortBy, order, page]
  );

  const { tasks, pagination, loading, createTask, updateTask, deleteTask, toggleComplete } =
    useTasks(filters);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, priority, sortBy, order]);

  useEffect(() => {
    if (user?.role === 'admin') {
      authService
        .getAllUsers()
        .then((data) => setUsers(data.users))
        .catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (data) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, data);
      } else {
        await createTask(data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(deleteTarget._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setSortBy('createdAt');
    setOrder('desc');
  };

  const hasActiveFilters = search || status || priority || sortBy !== 'createdAt' || order !== 'desc';

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Tasks</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="card mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`btn-secondary ${showFilters ? 'border-primary text-primary' : ''}`}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-primary" />}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 dark:border-dark-border pt-4 sm:grid-cols-4">
              <div>
                <label className="label-text">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="label-text">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field">
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="label-text">Sort By</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
                  <option value="createdAt">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div>
                <label className="label-text">Order</label>
                <button
                  onClick={() => setOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
                  className="input-field flex items-center justify-between"
                >
                  {order === 'asc' ? 'Ascending' : 'Descending'}
                  <ArrowUpDown size={16} className="text-slate-400" />
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="col-span-full flex items-center justify-center gap-1.5 text-sm font-medium text-red-500 hover:underline"
                >
                  <X size={14} /> Clear all filters
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Task grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ListSkeleton count={6} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Search className="text-primary" size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tasks found</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {hasActiveFilters
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by creating your first task.'}
          </p>
          <button
            onClick={() => {
              setEditingTask(null);
              setModalOpen(true);
            }}
            className="btn-primary mt-4"
          >
            <Plus size={16} /> Create Task
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(t) => {
                    setEditingTask(t);
                    setModalOpen(true);
                  }}
                  onDelete={(t) => setDeleteTarget(t)}
                  onToggleComplete={toggleComplete}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="btn-secondary px-3 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                disabled={page === pagination.pages}
                className="btn-secondary px-3 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        task={editingTask}
        users={users}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Tasks;
