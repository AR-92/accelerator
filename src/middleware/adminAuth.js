// Admin authentication middleware
// This can be used to protect routes that require admin authentication

const requireAdminAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/admin/login');
  }

  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('pages/error/access-denied', {
      title: 'Access Denied - Admin Panel',
      layout: 'main',
      message: 'You do not have permission to access the admin panel.',
    });
  }

  req.user = req.session.user;
  next();
};

const optionalAdminAuth = (req, res, next) => {
  if (
    req.session.userId &&
    req.session.user &&
    req.session.user.role === 'admin'
  ) {
    req.user = req.session.user;
  }
  next();
};

module.exports = {
  requireAdminAuth,
  optionalAdminAuth,
};
