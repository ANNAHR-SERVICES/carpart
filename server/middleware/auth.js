const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const User = require('../models/User');

// Authenticate JWT and attach user to req
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.',
        error: 'NO_TOKEN'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token format.',
        error: 'INVALID_TOKEN_FORMAT'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify that the token contains required fields
    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token content.',
        error: 'INVALID_TOKEN_CONTENT'
      });
    }
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Access denied. Token has expired.',
        error: 'TOKEN_EXPIRED'
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token.',
        error: 'INVALID_TOKEN'
      });
    } else {
      return res.status(500).json({ 
        message: 'Internal server error during authentication.',
        error: 'AUTH_ERROR'
      });
    }
  }
};

// Authorize by role(s)
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Access denied. Authentication required.',
      error: 'AUTHENTICATION_REQUIRED'
    });
  }
  
  if (!req.user.role) {
    return res.status(403).json({ 
      message: 'Access denied. User role not found.',
      error: 'ROLE_NOT_FOUND'
    });
  }
  
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Access denied. Insufficient permissions. Required roles: ${roles.join(', ')}`,
      error: 'INSUFFICIENT_PERMISSIONS',
      requiredRoles: roles,
      userRole: req.user.role
    });
  }
  
  next();
};

// Specific middleware for superadmin only
const requireSuperadmin = (req, res, next) => {
  return authorizeRoles('superadmin')(req, res, next);
};

module.exports = { 
  authenticateJWT, 
  authorizeRoles, 
  requireSuperadmin 
}; 