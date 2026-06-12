import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { taskValidation, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats/dashboard', getDashboardStats);

router.route('/').get(getTasks).post(taskValidation, validate, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(taskValidation, validate, updateTask)
  .delete(deleteTask);

export default router;
