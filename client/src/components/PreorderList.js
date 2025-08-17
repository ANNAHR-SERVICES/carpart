import React, { useState, useEffect } from 'react';
import './PreorderList.css';

const PreorderList = ({ vendorId }) => {
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Implement API call to fetch preorders when backend is ready
    // For now, show empty state
    setLoading(false);
    setPreorders([]);
  }, [vendorId]);

  if (loading) {
    return (
      <div className="preorder-list-container">
        <div className="loading">Chargement des précommandes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preorder-list-container">
        <div className="error">Erreur: {error}</div>
      </div>
    );
  }

  if (preorders.length === 0) {
    return (
      <div className="preorder-list-container">
        <div className="empty-state">
          <h3>Aucune précommande</h3>
          <p>Vous n'avez pas encore de précommandes en attente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="preorder-list-container">
      <h2>Liste des Précommandes</h2>
      <div className="preorder-grid">
        {preorders.map((preorder) => (
          <div key={preorder._id} className="preorder-card">
            <div className="preorder-header">
              <span className="preorder-id">#{preorder._id.slice(-6)}</span>
              <span className={`status ${preorder.status}`}>
                {preorder.status}
              </span>
            </div>
            <div className="preorder-details">
              <p><strong>Client:</strong> {preorder.customerName}</p>
              <p><strong>Produit:</strong> {preorder.productName}</p>
              <p><strong>Quantité:</strong> {preorder.quantity}</p>
              <p><strong>Date:</strong> {new Date(preorder.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="preorder-actions">
              <button className="btn-accept">Accepter</button>
              <button className="btn-reject">Rejeter</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreorderList;
