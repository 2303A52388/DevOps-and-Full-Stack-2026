const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const uploadImage = require('../middleware/uploadImage');

const router = express.Router();

// Profile page
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }
    res.render('profile/index', { user, messages: req.flash() });
  } catch (error) {
    req.flash('error', 'Failed to load profile');
    res.redirect('/dashboard');
  }
});

// Update profile
router.put('/', requireAuth, uploadImage.single('profilePicture'), async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }
    user.name = name;
    user.email = email;
    if (req.file) {
      user.profilePicture = req.file.filename;
    }
    await user.save();
    req.flash('success', 'Profile updated successfully');
    res.redirect('/profile');
  } catch (error) {
    req.flash('error', 'Failed to update profile');
    res.redirect('/profile');
  }
});

// Change password
router.put('/password', requireAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      req.flash('error', 'Old password is incorrect');
      return res.redirect('/profile');
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    req.flash('success', 'Password changed successfully');
    res.redirect('/profile');
  } catch (error) {
    req.flash('error', 'Failed to change password');
    res.redirect('/profile');
  }
});

module.exports = router;