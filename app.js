const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const sessionConfig = require('./config/session');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-flash')());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
sessionConfig(app);

// Middleware to populate user object
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const User = require('./models/User');
      const user = await User.findById(req.session.userId);
      res.locals.user = user;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  next();
});

// Method override for PUT and DELETE
app.use(require('method-override')('_method'));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/music', require('./routes/music'));
app.use('/users', require('./routes/users'));
app.use('/profile', require('./routes/profile'));

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});