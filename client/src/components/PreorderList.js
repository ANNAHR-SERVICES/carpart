import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PreorderList.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled'];

const PreorderList = ({ vendorId }) => {
  const [preorders, setPreorders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les précommandes
  useEffect(() => {
    if (vendorId) {
      fetchPreorders();
    }
  }, [vendorId, statusFilter]);

  const fetchPreorders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/preorders?vendorId=${vendorId}&status=${statusFilter}`);
      setPreorders(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des précommandes:', err);
      setError('Erreur lors du chargement des précommandes');
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut d'une précommande
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`/api/preorders/${id}/status`, { status: newStatus });
      
      // Mettre à jour l'état local optimistiquement
      setPreorders(prev => 
        prev.map(p => p._id === id ? { ...p, status: newStatus } : p)
      );
      
      // Optionnel: Afficher un message de succès
      console.log(`Statut mis à jour vers: ${newStatus}`);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir le nom du produit (avec fallback)
  const getProductName = (preorder) => {
    if (preorder.productId && preorder.productId.name) {
      return preorder.productId.name;
    }
    return `Produit ID: ${preorder.productId}`;
  };

  // Obtenir la marque du produit
  const getProductBrand = (preorder) => {
    if (preorder.productId && preorder.productId.brand) {
      return preorder.productId.brand;
    }
    return 'N/A';
  };

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  // Obtenir le texte du statut en français
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (!vendorId) {
    return <div className="preorder-error">ID vendeur requis</div>;
  }

  return (
    <div className="preorder-list-container">
      <div className="preorder-header">
        <h2>Suivi des Précommandes</h2>
        
        {/* Filtre de statut */}
        <div className="status-filter">
          <label htmlFor="statusFilter">Filtrer par statut : </label>
          <select 
            id="statusFilter"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option} value={option}>
                {getStatusText(option)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* État de chargement */}
      {loading && (
        <div className="loading-container">
          <p>Chargement...</p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Tableau des précommandes */}
      {!loading && !error && (
        <div className="preorder-table-container">
          {preorders.length === 0 ? (
            <div className="no-preorders">
              <p>Aucune précommande trouvée pour ce statut.</p>
            </div>
          ) : (
            <table className="preorder-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Marque</th>
                  <th>Client</th>
                  <th>Téléphone</th>
                  <th>Quantité</th>
                  <th>Statut</th>
                  <th>Actions</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {preorders.map((preorder) => (
                  <tr key={preorder._id} className="preorder-row">
                    <td className="product-name">
                      {getProductName(preorder)}
                    </td>
                    <td className="product-brand">
                      {getProductBrand(preorder)}
                    </td>
                    <td className="customer-name">
                      {preorder.customerName}
                    </td>
                    <td className="customer-phone">
                      {preorder.phone}
                    </td>
                    <td className="quantity">
                      {preorder.quantity}
                    </td>
                    <td className="status">
                      <span className={`status-badge ${getStatusClass(preorder.status)}`}>
                        {getStatusText(preorder.status)}
                      </span>
                    </td>
                    <td className="actions">
                      {preorder.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="btn-confirm"
                            onClick={() => handleStatusChange(preorder._id, 'confirmed')}
                            title="Confirmer la précommande"
                          >
                            Confirmer
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => handleStatusChange(preorder._id, 'cancelled')}
                            title="Annuler la précommande"
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                      {preorder.status !== 'pending' && (
                        <span className="no-actions">Aucune action</span>
                      )}
                    </td>
                    <td className="created-date">
                      {formatDate(preorder.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Statistiques */}
      {!loading && !error && preorders.length > 0 && (
        <div className="preorder-stats">
          <p>
            Total: <strong>{preorders.length}</strong> précommande(s) 
            ({getStatusText(statusFilter)})
          </p>
        </div>
      )}
    </div>
  );
};

export default PreorderList;
