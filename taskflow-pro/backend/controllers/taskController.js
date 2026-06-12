import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all tasks (with search, filter, sort, pagination)
// @route   GET /api/tasks
// @access  Private
export const getTasks = asyncHandler(async (req, res) => {
  const {
    search,
    status,
    priority,
    category,
    sortBy = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
  } = req.query;

  let query = {};
  if (req.user.role !== 'admin') {
    query.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
  }

  if (search) {
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    });
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;

  const pageNum = Math.max(parseInt(page), 1);
  const limitNum = Math.max(parseInt(limit), 1);
  const skip = (pageNum - 1) * limitNum;

  const sortOrder = order === 'asc' ? 1 : -1;
  const sortObj = { [sortBy]: sortOrder };

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum),
    Task.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    tasks,
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (
    req.user.role !== 'admin' &&
    task.createdBy._id.toString() !== req.user._id.toString() &&
    (!task.assignedTo || task.assignedTo._id.toString() !== req.user._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to access this task');
  }

  res.status(200).json({ success: true, task });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, category, dueDate, assignedTo, status } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    category,
    dueDate,
    assignedTo: assignedTo || null,
    status: status || 'pending',
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');

  await Activity.create({
    user: req.user._id,
    action: 'task_created',
    description: `${req.user.name} created task "${task.title}"`,
    task: task._id,
  });

  const io = req.app.get('io');
  if (io) {
    io.emit('task:created', populatedTask);
    io.emit('notification', {
      type: 'task_created',
      message: `New task created: "${task.title}"`,
      taskId: task._id,
    });
  }

  res.status(201).json({ success: true, task: populatedTask });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (
    req.user.role !== 'admin' &&
    task.createdBy.toString() !== req.user._id.toString() &&
    (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  const { title, description, status, priority, category, dueDate, assignedTo } = req.body;

  const wasCompleted = task.status === 'completed';

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (category !== undefined) task.category = category;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

  if (status !== undefined) {
    task.status = status;
    if (status === 'completed' && !wasCompleted) {
      task.completedAt = new Date();
    } else if (status !== 'completed') {
      task.completedAt = null;
    }
  }

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar');

  const isNowCompleted = task.status === 'completed';
  let activityAction = 'task_updated';
  let activityDesc = `${req.user.name} updated task "${task.title}"`;

  if (!wasCompleted && isNowCompleted) {
    activityAction = 'task_completed';
    activityDesc = `${req.user.name} completed task "${task.title}"`;
  } else if (wasCompleted && !isNowCompleted) {
    activityAction = 'task_reopened';
    activityDesc = `${req.user.name} reopened task "${task.title}"`;
  }

  await Activity.create({
    user: req.user._id,
    action: activityAction,
    description: activityDesc,
    task: task._id,
  });

  const io = req.app.get('io');
  if (io) {
    io.emit('task:updated', populatedTask);
    io.emit('notification', {
      type: activityAction,
      message: activityDesc,
      taskId: task._id,
    });
  }

  res.status(200).json({ success: true, task: populatedTask });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }

  const taskId = task._id;
  const taskTitle = task.title;

  await task.deleteOne();

  await Activity.create({
    user: req.user._id,
    action: 'task_deleted',
    description: `${req.user.name} deleted task "${taskTitle}"`,
    task: null,
  });

  const io = req.app.get('io');
  if (io) {
    io.emit('task:deleted', { _id: taskId });
    io.emit('notification', {
      type: 'task_deleted',
      message: `Task deleted: "${taskTitle}"`,
      taskId,
    });
  }

  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

// @desc    Get dashboard statistics
// @route   GET /api/tasks/stats/dashboard
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  let baseQuery = {};
  if (req.user.role !== 'admin') {
    baseQuery.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
  }

  const now = new Date();

  const [total, completed, pending, inProgress, overdue, priorityBreakdown, categoryBreakdown] =
    await Promise.all([
      Task.countDocuments(baseQuery),
      Task.countDocuments({ ...baseQuery, status: 'completed' }),
      Task.countDocuments({ ...baseQuery, status: 'pending' }),
      Task.countDocuments({ ...baseQuery, status: 'in-progress' }),
      Task.countDocuments({
        ...baseQuery,
        status: { $ne: 'completed' },
        dueDate: { $lt: now, $ne: null },
      }),
      Task.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const weeklyCompletions = await Task.aggregate([
    {
      $match: {
        ...baseQuery,
        status: 'completed',
        completedAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionPercentage,
      priorityBreakdown,
      categoryBreakdown,
      weeklyCompletions,
    },
  });
});
