const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
};

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    let avatarUrl = null;

    if (req.file) {
      // Upload to Cloudinary using buffer stream
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'users' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      avatarUrl = uploadResult.secure_url;
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      avatar: avatarUrl,
    });

    if (user) {
      // send verification email here if needed
      res.status(201).json({
        success: true,
        message:
          'Registration successful. Please check your email for verification.',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to user document
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
        },
        token,
        refreshToken,
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// @desc Refresh access token
// @route POST /api/auth/refresh
// @access Public
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid refresh token' });
    }

    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired refresh token' });
  }
};
