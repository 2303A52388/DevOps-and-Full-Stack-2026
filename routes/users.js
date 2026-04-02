const express = require('express');
const User = require('../models/User');
const Music = require('../models/Music');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const userStats = await Promise.all(
      users.map(async (user) => {
        const musicCount = await Music.countDocuments({ uploadedBy: user._id });
        return { ...user.toObject(), musicCount };
      })
    );
    res.render('users/index', { users: userStats, messages: req.flash() });
  } catch (error) {
    req.flash('error', 'Failed to load users');
    res.redirect('/dashboard');
  }
});

// Edit user page (admin only)
router.get('/:id/edit', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users');
    }
    res.render('users/edit', { user, messages: req.flash() });
  } catch (error) {
    req.flash('error', 'Failed to load user');
    res.redirect('/users');
  }
});

// Update user (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users');
    }
    user.name = name;
    user.email = email;
    user.role = role;
    await user.save();
    req.flash('success', 'User updated successfully');
    res.redirect('/users');
  } catch (error) {
    req.flash('error', 'Failed to update user');
    res.redirect(`/users/${req.params.id}/edit`);
  }
});

// Delete user (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users');
    }
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'User deleted successfully');
    res.redirect('/users');
  } catch (error) {
    req.flash('error', 'Failed to delete user');
    res.redirect('/users');
  }
});

module.exports = router;