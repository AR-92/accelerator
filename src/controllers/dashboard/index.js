// Main dashboard redirect based on user role
export const getDashboardMain = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      // Not authenticated, redirect to login
      return res.redirect('/auth/login');
    }

    // Redirect to dashboard overview
    res.redirect('/dashboard/overview');
  } catch (error) {
    console.error('Error redirecting to dashboard:', error);
    res.status(500).render('error', {
      layout: 'main',
      title: 'Error',
      error: 'Failed to load dashboard',
    });
  }
};
