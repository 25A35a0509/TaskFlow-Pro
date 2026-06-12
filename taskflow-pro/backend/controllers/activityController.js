import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get activity logs
// @route   GET /api/activity
// @access  Private
export const getActivityLogs = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  let query = {};
  if (req.user.role !== 'admin') {
    query.user = req.user._id;
  }

  const activities = await Activity.find(query)
    .populate('user', 'name avatar')
    .populate('task', 'title')
    .sort({ createdAt: -1 })
    .limit(limit);

  res.status(200).json({ success: true, activities });
});
