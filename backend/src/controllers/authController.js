import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

// Helper to generate access token
const generateAccessToken = (id) => {
  return jwt.sign(
    { id },
    process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret_12345',
    { expiresIn: '15m' }
  );
};

// Helper to generate refresh token
const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_54321',
    { expiresIn: '7d' }
  );
};

// Helper to log user activity
const logActivity = async (userId, action) => {
  try {
    await Activity.create({ userId, action });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

// Set refresh token cookie helper
const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction, // True in production to ensure cookie is sent over HTTPS
    sameSite: isProduction ? 'none' : 'lax', // Lax for local testing, None for production cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Default avatar based on UI/placeholder
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

    const user = await User.create({
      name,
      email,
      password,
      avatar,
      role: 'User', // default role
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to user
      user.refreshToken = refreshToken;
      await user.save();

      // Log activity
      await logActivity(user._id, 'User Registered');

      // Set cookie
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        createdAt: user.createdAt,
        accessToken,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & get tokens
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Get user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user (rotation support)
    user.refreshToken = refreshToken;
    await user.save();

    // Log activity
    await logActivity(user._id, 'User Logged In');

    // Set cookie
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
      createdAt: user.createdAt,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refresh token rotation
// @route   POST /api/auth/refresh
// @access  Public (via HttpOnly Cookie)
export const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  
  if (!cookies || !cookies.refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  const incomingRefreshToken = cookies.refreshToken;

  try {
    // Find user with that refresh token
    const user = await User.findOne({ refreshToken: incomingRefreshToken });
    
    if (!user) {
      // Invalidate if token was used/leaked
      try {
        const decoded = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_54321'
        );
        // Clear tokens of compromised user
        const hackedUser = await User.findById(decoded.id);
        if (hackedUser) {
          hackedUser.refreshToken = null;
          await hackedUser.save();
        }
      } catch (err) {
        // Token was invalid/expired anyway
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      return res.status(403).json({ message: 'Token reuse detected or invalid token' });
    }

    // Verify token
    jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret_54321',
      async (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
          user.refreshToken = null;
          await user.save();
          res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          });
          return res.status(403).json({ message: 'Refresh token expired or invalid' });
        }

        // Generate new tokens
        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Update database with rotated token
        user.refreshToken = newRefreshToken;
        await user.save();

        // Set rotated cookie
        setRefreshTokenCookie(res, newRefreshToken);

        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user & clear refresh token
// @route   POST /api/auth/logout
// @access  Public/Protected
export const logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.refreshToken) {
    return res.sendStatus(204); // No content
  }
  
  const token = cookies.refreshToken;

  try {
    const user = await User.findOne({ refreshToken: token });
    if (user) {
      await logActivity(user._id, 'User Logged Out');
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile (Current authenticated user)
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      
      if (req.body.avatar) {
        user.avatar = req.body.avatar;
      } else if (req.body.name && req.body.name !== user.name) {
        // regenerate default avatar if name changed and no custom avatar provided
        user.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(req.body.name)}`;
      }

      const updatedUser = await user.save();
      await logActivity(user._id, 'Profile Updated');

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();
    await logActivity(user._id, 'Password Changed');

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/auth/delete
// @access  Private
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the deleted activity before deleting user or just clean up
    await logActivity(user._id, 'Account Deleted');
    
    // Clear cookie first
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
