const express = require('express');
const Music = require('../models/Music');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all music
router.get('/', requireAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const query = search ? {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ],
    } : {};

    const music = await Music.find(query)
      .populate('uploadedBy', 'name')
      .sort({ [sort]: order })
      .skip(skip)
      .limit(limit);

    const total = await Music.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.render('music/index', {
      music,
      currentPage: page,
      totalPages,
      search,
      sort,
      order,
      messages: req.flash(),
    });
  } catch (error) {
    req.flash('error', 'Failed to load music');
    res.redirect('/dashboard');
  }
});

// Create music page
router.get('/create', requireAuth, (req, res) => {
  res.render('music/create', { messages: req.flash() });
});

// Create music post
router.post('/create', requireAuth, upload.single('file'), async (req, res) => {
  const { title, artist, album, genre, year, description } = req.body;
  try {
    const music = new Music({
      title,
      artist,
      album,
      genre,
      year,
      description,
      file: req.file.filename,
      uploadedBy: req.session.userId,
    });
    await music.save();
    req.flash('success', 'Music uploaded successfully');
    res.redirect('/music');
  } catch (error) {
    req.flash('error', 'Failed to upload music');
    res.redirect('/music/create');
  }
});

// Show music
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const music = await Music.findById(req.params.id).populate('uploadedBy', 'name');
    if (!music) {
      req.flash('error', 'Music not found');
      return res.redirect('/music');
    }
    res.render('music/show', { music, messages: req.flash() });
  } catch (error) {
    req.flash('error', 'Failed to load music');
    res.redirect('/music');
  }
});

// Edit music page
router.get('/:id/edit', requireAuth, async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      req.flash('error', 'Music not found');
      return res.redirect('/music');
    }
    if (music.uploadedBy.toString() !== req.session.userId) {
      req.flash('error', 'Unauthorized');
      return res.redirect('/music');
    }
    res.render('music/edit', { music, messages: req.flash() });
  } catch (error) {
    req.flash('error', 'Failed to load music');
    res.redirect('/music');
  }
});

// Update music
router.put('/:id', requireAuth, async (req, res) => {
  const { title, artist, album, genre, year, description } = req.body;
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      req.flash('error', 'Music not found');
      return res.redirect('/music');
    }
    if (music.uploadedBy.toString() !== req.session.userId) {
      req.flash('error', 'Unauthorized');
      return res.redirect('/music');
    }
    music.title = title;
    music.artist = artist;
    music.album = album;
    music.genre = genre;
    music.year = year;
    music.description = description;
    await music.save();
    req.flash('success', 'Music updated successfully');
    res.redirect(`/music/${req.params.id}`);
  } catch (error) {
    req.flash('error', 'Failed to update music');
    res.redirect(`/music/${req.params.id}/edit`);
  }
});

// Delete music
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      req.flash('error', 'Music not found');
      return res.redirect('/music');
    }
    if (music.uploadedBy.toString() !== req.session.userId) {
      req.flash('error', 'Unauthorized');
      return res.redirect('/music');
    }
    await Music.findByIdAndDelete(req.params.id);
    req.flash('success', 'Music deleted successfully');
    res.redirect('/music');
  } catch (error) {
    req.flash('error', 'Failed to delete music');
    res.redirect('/music');
  }
});

module.exports = router;