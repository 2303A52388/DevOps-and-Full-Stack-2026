const express = require('express');
const User = require('../models/User');
const Music = require('../models/Music');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Dashboard
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const totalSongs = await Music.countDocuments();
    const totalUsers = await User.countDocuments();
    const recentUploads = await Music.find().sort({ createdAt: -1 }).limit(5).populate('uploadedBy', 'name');
    const storageUsed = await Music.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: { $strLenCP: '$file' } }, // Approximate size
        },
      },
    ]);

    // Monthly uploads
    const monthlyUploads = await Music.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Genre distribution
    const genreDistribution = await Music.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
        },
      },
    ]);

    res.render('dashboard/index', {
      user,
      totalSongs,
      totalUsers,
      recentUploads,
      storageUsed: storageUsed[0]?.totalSize || 0,
      monthlyUploads: JSON.stringify(monthlyUploads),
      genreDistribution: JSON.stringify(genreDistribution),
      messages: req.flash(),
    });
  } catch (error) {
    req.flash('error', 'Failed to load dashboard');
    res.redirect('/auth/login');
  }
});

module.exports = router;