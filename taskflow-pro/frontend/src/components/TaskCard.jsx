import { motion } from 'framer-motion';
import { Calendar, Edit2, Trash2, CheckCircle2, Circle, MoreVertical, Tag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDate, priorityColors, statusColors, isOverdue, getInitials } from '../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);
  const overdue = isOverdue(task.dueDate, task.status);
  const pColors = priorityColors[task.priority] || priorityColors.Medium;
  const sColors = statusColors[task.status] || statusColors.pending;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="card group relative p-4 hover:shadow-glow transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => onToggleComplete(task)}
          className="mt-0.5 flex-shrink-0 text-slate-300 transition-colors hover:text-primary dark:text-slate-600"
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="text-emerald-500" size={20} />
          ) : (
            <Circle size={20} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h4
            className={`text-sm font-semibold leading-snug ${
              task.status === 'completed'
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
              {task.description}
            </p>
          )}
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="rounded-lg p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 dark:hover:bg-slate-800"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-32 rounded-xl border border-slate-100 dark:border-dark-border bg-white dark:bg-dark-card shadow-xl">
              <button
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-t-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-b-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`badge ${pColors.bg} ${pColors.text}`}>
          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${pColors.dot}`} />
          {task.priority}
        </span>
        <span className={`badge ${sColors.bg} ${sColors.text}`}>{sColors.label}</span>
        {task.category && (
          <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300">
            <Tag size={10} className="mr-1" />
            {task.category}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {task.dueDate ? (
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${
              overdue ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            <Calendar size={13} />
            {formatDate(task.dueDate)}
            {overdue && <span className="font-bold">· Overdue</span>}
          </div>
        ) : (
          <span className="text-xs text-slate-400">No due date</span>
        )}

        {task.assignedTo && (
          <div
            title={task.assignedTo.name}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-accent text-[10px] font-bold text-white"
          >
            {getInitials(task.assignedTo.name)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
