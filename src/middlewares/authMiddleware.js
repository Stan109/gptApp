const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user info
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check for admin role
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
};

// Middleware to check ownership or admin
exports.isOwnerOrAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id, 10)) {
    return res.status(403).json({ error: 'Forbidden: Not authorized' });
  }
  next();
};
