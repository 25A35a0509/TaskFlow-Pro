import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import { Save, PlusCircle } from 'lucide-react';

const categories = ['General', 'Work', 'Personal', 'Design', 'Development', 'Marketing', 'Bug', 'Feature'];

const TaskFormModal = ({ isOpen, onClose, onSubmit, task, users = [] }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        category: task.category,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
        assignedTo: task.assignedTo?._id || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'pending',
        category: 'General',
        dueDate: '',
        assignedTo: '',
      });
    }
  }, [task, reset, isOpen]);

  const submitHandler = async (data) => {
    const payload = {
      ...data,
      dueDate: data.dueDate || null,
      assignedTo: data.assignedTo || null,
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <div>
          <label className="label-text">Title</label>
          <input
            type="text"
            placeholder="e.g. Design landing page hero section"
            className="input-field"
            {...register('title', { required: 'Title is required', maxLength: 120 })}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label className="label-text">Description</label>
          <textarea
            rows={3}
            placeholder="Add more details about this task..."
            className="input-field resize-none"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Priority</label>
            <select className="input-field" {...register('priority')}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="label-text">Status</label>
            <select className="input-field" {...register('status')}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-text">Category</label>
            <select className="input-field" {...register('category')}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-text">Due Date</label>
            <input type="date" className="input-field" {...register('dueDate')} />
          </div>
        </div>

        {users.length > 0 && (
          <div>
            <label className="label-text">Assign To</label>
            <select className="input-field" {...register('assignedTo')}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
            {isSubmitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : task ? (
              <>
                <Save size={16} /> Save Changes
              </>
            ) : (
              <>
                <PlusCircle size={16} /> Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
