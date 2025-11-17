// Authentication middleware
// This can be used to protect routes that require authentication

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(req.originalUrl);
    return res.redirect(`/auth?returnUrl=${returnUrl}`);
  }
  req.user = req.session.user;
  res.locals.user = req.session.user;
  res.locals.originalUser = req.session.originalUser;
  next();
};

const optionalAuth = (req, res, next) => {
  if (req.session.userId) {
    req.user = req.session.user;
    res.locals.user = req.session.user;
    res.locals.originalUser = req.session.originalUser;
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
};
