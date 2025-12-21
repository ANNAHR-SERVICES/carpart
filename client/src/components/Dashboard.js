import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "./Dashboard.css";

const AcheteurDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("reservations");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setReservations([
        { id: 1, productName: "Plaquettes de frein avant", vendor: "AutoParts Pro", price: 120, status: "confirmed", date: "2024-01-15", image: "https://via.placeholder.com/80?text=Freins" },
        { id: 2, productName: "Filtre à air sport", vendor: "Mecano Express", price: 45, status: "pending", date: "2024-01-14", image: "https://via.placeholder.com/80?text=Filtre" },
        { id: 3, productName: "Bougies d'allumage (x4)", vendor: "Pièces Auto Plus", price: 85, status: "delivered", date: "2024-01-10", image: "https://via.placeholder.com/80?text=Bougies" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusText = (status) => {
    const texts = {
      confirmed: "Confirmée",
      pending: "En attente",
      delivered: "Livrée",
      cancelled: "Annulée"
    };
    return texts[status] || status;
  };

  if (!user) return <div className="loading-state">Chargement...</div>;

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h2 className="brand-logo">Dongo Client</h2>}
          <button className="back-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`menu-item ${activeMenu === "reservations" ? "active" : ""}`}
            onClick={() => setActiveMenu("reservations")}
          >
            <span className="icon">📦</span> {!isCollapsed && "Mes Réservations"}
          </button>

          <button
            className={`menu-item ${activeMenu === "profile" ? "active" : ""}`}
            onClick={() => setActiveMenu("profile")}
          >
            <span className="icon">👤</span> {!isCollapsed && "Mon Profil"}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="menu-item logout-link" onClick={logout}>
            <span className="icon">🚪</span> {!isCollapsed && "Déconnexion"}
          </button>
        </div>
      </aside>

      <main className="dashboard-content-area">
        <header className="content-header">
          <div className="welcome-text">
            <h1>Bonjour</h1>
            <p>Voici l'état actuel de vos commandes auto.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate("/recherche")}>
            <i className="fas fa-search"></i> Commander une pièce
          </button>
        </header>

        {activeMenu === "reservations" && (
          <div className="fade-in">
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon pending">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="stat-info">
                  <h3>{reservations.filter(r => r.status === "pending").length}</h3>
                  <p>En attente</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon confirmed">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h3>{reservations.filter(r => r.status === "confirmed").length}</h3>
                  <p>Confirmées</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon delivered">
                  <i className="fas fa-truck"></i>
                </div>
                <div className="stat-info">
                  <h3>{reservations.filter(r => r.status === "delivered").length}</h3>
                  <p>Livrées</p>
                </div>
              </div>
            </div>

            <div className="reservations-section">
              <h2>Historique récent</h2>

              {loading ? (
                <div className="loading-state">
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
              ) : (
                <div className="reservations-list">
                  {reservations.map(res => (
                    <div key={res.id} className="reservation-card">
                      <div className="reservation-image">
                        <img src={res.image} alt={res.productName} />
                      </div>

                      <div className="reservation-info">
                        <div className="reservation-main">
                          <h3>{res.productName}</h3>
                          <p className="vendor-name">
                            <i className="fas fa-store"></i> {res.vendor}
                          </p>
                          <p className="date-text">
                            <i className="fas fa-calendar-alt"></i> {res.date}
                          </p>
                        </div>

                        <div className="reservation-details">
                          <span className="price-tag">{res.price} TND</span>
                          <span className={`status-badge ${res.status}`}>
                            {getStatusText(res.status)}
                          </span>
                        </div>
                      </div>

                      <div className="reservation-actions">
                        <button className="btn-secondary">Détails</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeMenu === "profile" && (
          <div className="fade-in">
            <h1>Mon Profil</h1>
            <div className="dashboard-card profile-info-card">
              <div className="info-item">
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>Type de compte</label>
                <span className="badge">Client</span>
              </div>
              <button className="btn-primary" style={{ marginTop: "20px" }}>
                Modifier mes informations
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export { AcheteurDashboard };
