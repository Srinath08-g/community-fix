exports.isOfficial = (req, res, next) => {
  if (req.user.role !== 'official') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
