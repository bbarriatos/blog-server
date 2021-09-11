const pageConfig = require('../config/defaultPageConfig');

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.app.locals.layout = 'dashboard';
    pageConfig.username = req.user.user_username;

    return next();
  }

  res.redirect('/login');
};

const isLoggedOut = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.app.locals.layout = 'index';
    return next();
  }

  res.redirect('/');
};

module.exports = { isLoggedIn, isLoggedOut };
