import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import ProductManagement from './ProductManagement';
import VendorDashboard from '../components/VendorDashboard';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBrowseParts = () => {
    navigate('/products');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Client Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>My Orders</h2>
          <p>View and track your spare parts orders</p>
        </div>
        <div className="dashboard-card clickable" onClick={handleBrowseParts}>
          <h2>Browse Parts</h2>
          <p>Search for auto spare parts</p>
        </div>
        <div className="dashboard-card">
          <h2>My Profile</h2>
          <p>Manage your account settings</p>
        </div>
      </div>
    </div>
  );
};

const VendeurDashboard = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'products' or 'vendor-dashboard'

  if (currentView === 'products') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="back-btn"
          >
            ← Retour au Dashboard
          </button>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
        <ProductManagement />
      </div>
    );
  }

  if (currentView === 'vendor-dashboard') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="back-btn"
          >
            ← Retour au Dashboard
          </button>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
        <VendorDashboard />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Vendeur Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-card" onClick={() => setCurrentView('vendor-dashboard')}>
          <h2>Tableau de Bord Avancé</h2>
          <p>Interface moderne avec tableau et statistiques</p>
          <button className="primary-btn">Accéder</button>
        </div>
        <div className="dashboard-card" onClick={() => setCurrentView('products')}>
          <h2>Gestion des Produits</h2>
          <p>Gérer votre inventaire de pièces détachées</p>
          <button className="primary-btn">Accéder</button>
        </div>
        <div className="dashboard-card">
          <h2>Commandes</h2>
          <p>Voir et traiter les commandes clients</p>
        </div>
        <div className="dashboard-card">
          <h2>Analytics</h2>
          <p>Voir les métriques de vente et de performance</p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>User Management</h2>
          <p>Manage all users and their roles</p>
        </div>
        <div className="dashboard-card">
          <h2>System Settings</h2>
          <p>Configure platform settings</p>
        </div>
        <div className="dashboard-card">
          <h2>Reports</h2>
          <p>Generate system reports</p>
        </div>
      </div>
    </div>
  );
};

const ModerateurDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Moderateur Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Content Moderation</h2>
          <p>Review and approve content</p>
        </div>
        <div className="dashboard-card">
          <h2>Reports</h2>
          <p>Handle user reports and complaints</p>
        </div>
        <div className="dashboard-card">
          <h2>Quality Control</h2>
          <p>Monitor product quality and listings</p>
        </div>
      </div>
    </div>
  );
};

const SuperadminDashboard = () => {
  const { user, logout } = useAuth();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'vendeur'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCreateUserChange = (e) => {
    const { name, value } = e.target;
    setCreateUserForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCreateUserForm = () => {
    const newErrors = {};
    
    if (!createUserForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!createUserForm.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(createUserForm.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!createUserForm.password) {
      newErrors.password = 'Password is required';
    } else if (createUserForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!createUserForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (createUserForm.password !== createUserForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!validateCreateUserForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await authAPI.createUser({
        name: createUserForm.name.trim(),
        email: createUserForm.email,
        password: createUserForm.password,
        role: createUserForm.role
      });

      toast.success(`${createUserForm.role} account created successfully!`);
      
      // Reset form
      setCreateUserForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'vendeur'
      });
      setShowCreateUser(false);

    } catch (error) {
      console.error('Create user error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      } else {
        toast.error('An error occurred while creating the user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Superadmin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>User Management</h2>
          <p>Create and manage user accounts</p>
          <button 
            onClick={() => setShowCreateUser(!showCreateUser)}
            className="primary-btn"
          >
            {showCreateUser ? 'Cancel' : 'Create New User'}
          </button>
        </div>
        
        <div className="dashboard-card">
          <h2>System Overview</h2>
          <p>Monitor platform statistics and performance</p>
        </div>
        
        <div className="dashboard-card">
          <h2>Security Settings</h2>
          <p>Configure security and access controls</p>
        </div>
      </div>

      {showCreateUser && (
        <div className="create-user-modal">
          <div className="modal-content">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateUser} className="create-user-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={createUserForm.name}
                  onChange={handleCreateUserChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter full name"
                  disabled={loading}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={createUserForm.email}
                  onChange={handleCreateUserChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address"
                  disabled={loading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={createUserForm.role}
                  onChange={handleCreateUserChange}
                  disabled={loading}
                >
                  <option value="vendeur">Vendeur</option>
                  <option value="admin">Admin</option>
                  <option value="moderateur">Moderateur</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={createUserForm.password}
                  onChange={handleCreateUserChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Create a password"
                  disabled={loading}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={createUserForm.confirmPassword}
                  onChange={handleCreateUserChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm password"
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCreateUser(false)}
                  className="secondary-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { ClientDashboard, VendeurDashboard, AdminDashboard, ModerateurDashboard, SuperadminDashboard }; 