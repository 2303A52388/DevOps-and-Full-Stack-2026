const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
    })
  );
};

module.exports = sessionConfig;