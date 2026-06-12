import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  registerValidation,
  loginValidation,
  validate,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;
