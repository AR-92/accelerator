// Authentication middleware
// This can be used to protect routes that require authentication

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/auth');
  }
  req.user = req.session.user;
  res.locals.user = req.session.user;
  next();
};

const optionalAuth = (req, res, next) => {
  if (req.session.userId) {
    req.user = req.session.user;
    res.locals.user = req.session.user;
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
};
