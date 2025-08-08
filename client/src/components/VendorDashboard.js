import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductTable from './ProductTable';
import ProductFormModal from './ProductFormModal';
import toast from 'react-hot-toast';
import { formatPriceForStats } from '../utils/currency';
import './VendorDashboard.css';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [errorMsg, setErrorMsg] = useState('');

  // Charger les produits du vendeur
  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await productAPI.getSellerProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      let msg = error.response?.data?.message || error.message || 'Erreur lors du chargement des produits';
      if (error.response?.status === 401) {
        msg = 'Authentification requise ou expirée. Veuillez vous reconnecter.';
      }
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Gérer la création/mise à jour réussie
  const handleProductSuccess = (product) => {
    if (editingProduct) {
      // Mise à jour
      setProducts(prev => 
        prev.map(p => p._id === product._id ? product : p)
      );
      toast.success('Produit mis à jour avec succès!');
    } else {
      // Création
      setProducts(prev => [product, ...prev]);
      toast.success('Produit créé avec succès!');
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  // Ouvrir le modal pour créer un produit
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // Ouvrir le modal pour modifier un produit
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // Supprimer un produit
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      await productAPI.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  // Filtrer et trier les produits
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'stock':
          aValue = parseInt(a.stock);
          bValue = parseInt(b.stock);
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Statistiques
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  return (
    <div className="vendor-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de Bord Vendeur</h1>
          <p>Gérez vos produits et suivez vos performances</p>
        </div>
        <button 
          onClick={handleCreateProduct}
          className="create-product-btn"
        >
          <span>+</span>
          Ajouter un produit
        </button>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Produits</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.inStock}</h3>
            <p>En Stock</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.outOfStock}</h3>
            <p>Rupture</p>
          </div>
        </div>
                  <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>{formatPriceForStats(stats.totalValue)}</h3>
              <p>Valeur Stock</p>
            </div>
          </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les catégories</option>
            <option value="Engine">Moteur</option>
            <option value="Transmission">Transmission</option>
            <option value="Brakes">Freins</option>
            <option value="Suspension">Suspension</option>
            <option value="Electrical">Électrique</option>
            <option value="Body">Carrosserie</option>
            <option value="Interior">Intérieur</option>
            <option value="Other">Autre</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">Date de création</option>
            <option value="name">Nom</option>
            <option value="price">Prix</option>
            <option value="stock">Stock</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Tableau des produits */}
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement des produits...</p>
          </div>
        ) : errorMsg ? (
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h3>Erreur lors du chargement des produits</h3>
            <p>{errorMsg}</p>
            <button onClick={loadProducts} className="retry-btn">Réessayer</button>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>Aucun produit trouvé</h3>
            <p>
              {searchTerm || filterCategory 
                ? 'Aucun produit ne correspond à vos critères de recherche'
                : 'Commencez par ajouter votre premier produit'
              }
            </p>
            {!searchTerm && !filterCategory && (
              <button 
                onClick={handleCreateProduct}
                className="add-first-product-btn"
              >
                Ajouter un produit
              </button>
            )}
          </div>
        ) : (
          <ProductTable
            products={filteredAndSortedProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </div>

      {/* Modal du formulaire */}
      {showModal && (
        <ProductFormModal
          product={editingProduct}
          onSuccess={handleProductSuccess}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default VendorDashboard; 