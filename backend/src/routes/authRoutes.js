import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getCurrentUser,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { xssSanitize } from '../middleware/sanitize.js';

const router = express.Router();

// Public routes (xss sanitization applied to inputs)
router.post('/register', xssSanitize, registerUser);
router.post('/login', xssSanitize, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, xssSanitize, updateProfile);
router.put('/password', protect, xssSanitize, changePassword);
router.delete('/delete', protect, deleteAccount);

export default router;
