import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { ClientDashboard, VendeurDashboard, AdminDashboard, ModerateurDashboard, SuperadminDashboard } from './pages/Dashboard';
import ProductSearch from './components/ProductSearch';
import './App.css';

// Protected Route Component (unused but kept for future use)
// eslint-disable-next-line no-unused-vars
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-based Route Component
const RoleRoute = ({ role, children }) => {
  const { user } = useAuth();
  
  if (user && user.role === role) {
    return children;
  }
  
  return <Navigate to="/unauthorized" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route 
        path="/client/dashboard" 
        element={
          <RoleRoute role="client">
            <ClientDashboard />
          </RoleRoute>
        } 
      />
      
      <Route 
        path="/vendeur/dashboard" 
        element={
          <RoleRoute role="vendeur">
            <VendeurDashboard />
          </RoleRoute>
        } 
      />
      
      <Route 
        path="/admin/dashboard" 
        element={
          <RoleRoute role="admin">
            <AdminDashboard />
          </RoleRoute>
        } 
      />
      
      <Route 
        path="/moderateur/dashboard" 
        element={
          <RoleRoute role="moderateur">
            <ModerateurDashboard />
          </RoleRoute>
        } 
      />
      
      <Route 
        path="/superadmin/dashboard" 
        element={
          <RoleRoute role="superadmin">
            <SuperadminDashboard />
          </RoleRoute>
        } 
      />
      
      <Route path="/unauthorized" element={<div className="unauthorized">Access Denied</div>} />
      <Route path="/products" element={<ProductSearch />} />
      <Route path="/" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 