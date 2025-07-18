module.exports = function(requiredRole) {
  return function(req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Utilisateur non authentifié ou rôle manquant.' });
    }
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Accès refusé. Rôle requis : ' + requiredRole });
    }
    next();
  };
}; 