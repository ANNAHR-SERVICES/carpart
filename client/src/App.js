import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Accueil from "./components/Accueil";
import VendorDashboard from "./components/VendorDashboard";
import { AcheteurDashboard } from "./components/Dashboard";
import Contact from "./components/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./components/SignIn"; 
import "./App.css";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/signin" element={<SignIn />} /> 

      <Route
        path="/acheteur/dashboard"
        element={
          <ProtectedRoute role="acheteur">
            <AcheteurDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendeur/dashboard"
        element={
          <ProtectedRoute role="vendeur">
            <VendorDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/contact" element={<Contact />} />
      <Route path="/aide" element={<div className="aide-page">Centre d'aide</div>} />
      <Route path="/mentions-legales" element={<div className="legal-page">Mentions légales</div>} />
      <Route path="/confidentialite" element={<div className="privacy-page">Politique de confidentialité</div>} />
      <Route path="/cgu" element={<div className="cgu-page">CGU</div>} />

      <Route
        path="/unauthorized"
        element={
          <div
            className="unauthorized-page"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              textAlign: "center",
            }}
          >
            <h1>🚫 Accès refusé</h1>
            <p>Vous n'avez pas la permission d'accéder à cette page.</p>

            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "10px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Retour à l'accueil
            </button>
          </div>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App">
          <AppRoutes />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;