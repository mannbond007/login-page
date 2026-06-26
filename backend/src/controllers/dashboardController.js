import User from '../models/User.js';
import Activity from '../models/Activity.js';

// @desc    Get current user dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get last login activity (second most recent "User Logged In" activity)
    const logins = await Activity.find({
      userId,
      action: 'User Logged In',
    })
      .sort({ timestamp: -1 })
      .limit(2);

    let lastLogin = null;
    if (logins.length > 1) {
      lastLogin = logins[1].timestamp; // The previous login
    } else if (logins.length === 1) {
      lastLogin = logins[0].timestamp; // If this is the first login, use current
    }

    res.json({
      accountStatus: 'Active',
      role: req.user.role,
      joinDate: req.user.createdAt,
      lastLogin: lastLogin || req.user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user activity logs
// @route   GET /api/dashboard/activities
// @access  Private
export const getUserActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    const activities = await Activity.find({ userId })
      .sort({ timestamp: -1 })
      .limit(15);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
