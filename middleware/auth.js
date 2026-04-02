const User = require('../models/User');

const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/auth/login');
  }
};

const requireAdmin = async (req, res, next) => {
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (user && user.role === 'admin') {
      return next();
    }
  }
  res.status(403).send('Access denied');
};

module.exports = { requireAuth, requireAdmin };