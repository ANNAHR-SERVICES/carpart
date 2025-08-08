import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import ProductForm from '../components/ProductForm';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/currency';
import './ProductManagement.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'

  // Charger les produits du vendeur
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getSellerProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
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
      setEditingProduct(null);
    } else {
      // Création
      setProducts(prev => [product, ...prev]);
    }
    setCurrentView('list');
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

  // Éditer un produit
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setCurrentView('form');
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setCurrentView('list');
  };

  // Obtenir l'icône de catégorie
  const getCategoryIcon = (category) => {
    const icons = {
      'Engine': '🔧',
      'Transmission': '⚙️',
      'Brakes': '🛑',
      'Suspension': '🔄',
      'Electrical': '⚡',
      'Body': '🚗',
      'Interior': '💺',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  // Obtenir la couleur de condition
  const getConditionColor = (condition) => {
    const colors = {
      'New': '#28a745',
      'Used': '#ffc107',
      'Refurbished': '#17a2b8'
    };
    return colors[condition] || '#6c757d';
  };

  if (currentView === 'form') {
    return (
      <div className="product-management">
        <div className="page-header">
          <button 
            onClick={handleCancelEdit}
            className="back-btn"
          >
            ← Retour à la liste
          </button>
          <h1>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</h1>
        </div>
        
        <ProductForm
          onSuccess={handleProductSuccess}
          initialData={editingProduct}
          isEditing={!!editingProduct}
        />
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h1>Gestion des produits</h1>
        <button 
          onClick={() => setCurrentView('form')}
          className="add-product-btn"
        >
          + Ajouter un produit
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des produits...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Aucun produit trouvé</h3>
          <p>Commencez par ajouter votre premier produit</p>
          <button 
            onClick={() => setCurrentView('form')}
            className="add-first-product-btn"
          >
            Ajouter un produit
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0NyA4OC4wMDAxIDgxIDEwMCA4MUMxMTEuMDQ2IDgxIDExOSA4OS41NDQ3IDExOSAxMDBDMTE5IDExMC40NTUgMTExLjA0NiAxMTkgMTAwIDExOUM4OC4wMDAxIDExOSA4MCAxMTAuNDU1IDgwIDEwMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTEwMCAxMjVDMTEwLjQ1NSAxMjUgMTE5IDExNi40NTUgMTE5IDEwNkMxMTkgOTUuNTQ0NyAxMTAuNDU1IDg3IDEwMCA4N0M4OS41NDQ3IDg3IDgxIDk1LjU0NDcgODEgMTA2QzgxIDExNi40NTUgODkuNTQ0NyAxMjUgMTAwIDEyNVoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+';
                    }}
                  />
                ) : (
                  <div className="no-image">
                    <span>📷</span>
                    <p>Aucune image</p>
                  </div>
                )}
                <div className="product-overlay">
                  <div className="product-actions">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="edit-btn"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product._id)}
                      className="delete-btn"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-info">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">{formatPrice(product.price)}</span>
                </div>

                <div className="product-meta">
                  <span className="product-category">
                    {getCategoryIcon(product.category)} {product.category}
                  </span>
                  <span 
                    className="product-condition"
                    style={{ color: getConditionColor(product.condition) }}
                  >
                    {product.condition}
                  </span>
                </div>

                <div className="product-details">
                  <p className="product-brand-model">
                    {product.brand} - {product.model} ({product.year})
                  </p>
                  <p className="product-stock">
                    Stock: {product.stock} unité{product.stock > 1 ? 's' : ''}
                  </p>
                </div>

                <p className="product-description">
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description
                  }
                </p>

                <div className="product-images-count">
                  {product.images && product.images.length > 0 && (
                    <span>📷 {product.images.length} image{product.images.length > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 