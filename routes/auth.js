const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { messages: req.flash() });
});

// Login post
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      user.lastLogin = new Date();
      await user.save();
      res.redirect('/dashboard');
    } else {
      req.flash('error', 'Invalid email or password');
      res.redirect('/auth/login');
    }
  } catch (error) {
    req.flash('error', 'An error occurred');
    res.redirect('/auth/login');
  }
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', { messages: req.flash() });
});

// Register post
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
    await user.save();
    req.flash('success', 'Registration successful. Please login.');
    res.redirect('/auth/login');
  } catch (error) {
    req.flash('error', 'Registration failed');
    res.redirect('/auth/register');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
});

module.exports = router;