import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { getSocket } from '../services/socket';
import toast from 'react-hot-toast';

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data.tasks);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Real-time updates
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleCreated = () => fetchTasks();
    const handleUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    };
    const handleDeleted = ({ _id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== _id));
    };

    socket.on('task:created', handleCreated);
    socket.on('task:updated', handleUpdated);
    socket.on('task:deleted', handleDeleted);

    return () => {
      socket.off('task:created', handleCreated);
      socket.off('task:updated', handleUpdated);
      socket.off('task:deleted', handleDeleted);
    };
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    const data = await taskService.createTask(taskData);
    toast.success('Task created successfully');
    await fetchTasks();
    return data;
  };

  const updateTask = async (id, taskData) => {
    const data = await taskService.updateTask(id, taskData);
    toast.success('Task updated successfully');
    await fetchTasks();
    return data;
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    toast.success('Task deleted');
    await fetchTasks();
  };

  const toggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await taskService.updateTask(task._id, { status: newStatus });
    toast.success(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task reopened');
    await fetchTasks();
  };

  return {
    tasks,
    pagination,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  };
};
