// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/eventDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Event Schema
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    participants: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Event Model
const Event = mongoose.model('Event', eventSchema);

// CREATE Event
app.post('/events', async (req, res) => {
  try {
    const { title, date, location, participants } = req.body;

    if (!title || !date || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = new Event({ title, date, location, participants });
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ Events (Pagination + Search)
app.get('/events', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const query = {
      title: { $regex: search, $options: 'i' },
    };

    const events = await Event.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: 1 });

    const total = await Event.countDocuments(query);

    res.status(200).json({
      events,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ Single Event
app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Event
app.put('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Event
app.delete('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
