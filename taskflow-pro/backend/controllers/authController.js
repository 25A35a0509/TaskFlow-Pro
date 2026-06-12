import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { generateToken } from '../utils/generateToken.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Only allow admin role assignment if explicitly requested
  // (in production you'd restrict this further, e.g. invite-only)
  const user = await User.create({
    name,
    email,
    password,
    role: role === 'admin' ? 'admin' : 'user',
  });

  await Activity.create({
    user: user._id,
    action: 'register',
    description: `${user.name} created an account`,
  });

  const token = generateToken(user._id, false);

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      settings: user.settings,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  await Activity.create({
    user: user._id,
    action: 'login',
    description: `${user.name} logged in`,
  });

  const token = generateToken(user._id, !!rememberMe);

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      settings: user.settings,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ success: true, user });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.bio = req.body.bio ?? user.bio;
  user.avatar = req.body.avatar ?? user.avatar;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if (req.body.settings) {
    user.settings = { ...user.settings.toObject(), ...req.body.settings };
  }

  const updatedUser = await user.save();

  await Activity.create({
    user: user._id,
    action: 'profile_updated',
    description: `${user.name} updated their profile`,
  });

  res.status(200).json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      settings: updatedUser.settings,
      createdAt: updatedUser.createdAt,
    },
  });
});

// @desc    Get all users (for assigning tasks) - Admin only
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({ success: true, users });
});
