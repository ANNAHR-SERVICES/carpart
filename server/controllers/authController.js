const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/jwt');

// Sign up: only allows 'client' role (public route)
exports.signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required.',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }
    
    // Allow 'client' or 'acheteur' role for public signup
    const userRole = role === 'acheteur' ? 'acheteur' : 'client';
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address.',
        error: 'INVALID_EMAIL_FORMAT'
      });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long.',
        error: 'WEAK_PASSWORD'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'A user with this email already exists.',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }
    
    // Create new user with client role
    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password, 
      role: userRole 
    });
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user._id, user.role);
    
    // Return user data (without password)
    res.status(201).json({ 
      message: 'User registered successfully.',
      token, 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      } 
    });
    
  } catch (err) {
    console.error('SignUp Error:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed.',
        error: 'VALIDATION_ERROR',
        details: errors
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'A user with this email already exists.',
        error: 'DUPLICATE_EMAIL'
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error during registration.',
      error: 'REGISTRATION_ERROR'
    });
  }
};

// Sign in: any user (public route)
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required.',
        error: 'MISSING_CREDENTIALS'
      });
    }
    
    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS'
      });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password.',
        error: 'INVALID_CREDENTIALS'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id, user.role);
    
    // Return user data (without password)
    res.json({ 
      message: 'Sign in successful.',
      token, 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      } 
    });
    
  } catch (err) {
    console.error('SignIn Error:', err);
    res.status(500).json({ 
      message: 'Internal server error during sign in.',
      error: 'SIGNIN_ERROR'
    });
  }
};

// Superadmin creates users with custom roles (protected route)
exports.superadminCreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Name, email, password, and role are required.',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }
    
    // Validate role - only allow specific roles
    const allowedRoles = ['admin', 'vendeur', 'moderateur'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
        error: 'INVALID_ROLE',
        allowedRoles
      });
    }
    
    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address.',
        error: 'INVALID_EMAIL_FORMAT'
      });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long.',
        error: 'WEAK_PASSWORD'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'A user with this email already exists.',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }
    
    // Create new user with specified role
    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase(), 
      password, 
      role 
    });
    
    await user.save();
    
    // Return user data (without password)
    res.status(201).json({ 
      message: `${role} user created successfully.`,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      } 
    });
    
  } catch (err) {
    console.error('SuperadminCreateUser Error:', err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed.',
        error: 'VALIDATION_ERROR',
        details: errors
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: 'A user with this email already exists.',
        error: 'DUPLICATE_EMAIL'
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error during user creation.',
      error: 'USER_CREATION_ERROR'
    });
  }
}; 

// Test endpoint to verify middleware (for debugging)
exports.testAuth = async (req, res) => {
  try {
    res.json({ 
      message: 'Authentication successful',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('TestAuth Error:', err);
    res.status(500).json({ 
      message: 'Internal server error during auth test.',
      error: 'AUTH_TEST_ERROR'
    });
  }
}; 