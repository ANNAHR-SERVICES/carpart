import React, { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import './ProductSearch.css';

const ProductSearch = () => {
  console.log('ProductSearch component is loading...'); // Debug log
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    categorie: '',
    marque: '',
    modele: '',
    annee: '',
    prixMin: '',
    prixMax: '',
    disponibilite: '',
    tri: 'date_desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Catégories disponibles
  const categories = [
    'moteur', 'freinage', 'suspension', 'electricite', 
    'carrosserie', 'interieur', 'autre'
  ];

  // Options de tri
  const sortOptions = [
    { value: 'date_desc', label: 'Plus récent' },
    { value: 'date_asc', label: 'Plus ancien' },
    { value: 'prix_asc', label: 'Prix croissant' },
    { value: 'prix_desc', label: 'Prix décroissant' },
    { value: 'nom_asc', label: 'Nom A-Z' },
    { value: 'nom_desc', label: 'Nom Z-A' }
  ];

  // Charger les produits
  const loadProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: pagination.limit
      };

      // Nettoyer les paramètres vides
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await productsAPI.getProducts(params);
      setProducts(response.data.pieces);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  // Effet pour charger les produits au changement de filtres
  useEffect(() => {
    loadProducts(1);
  }, [loadProducts]);

  // Gérer les changements de filtres
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la pagination
  const handlePageChange = (page) => {
    loadProducts(page);
  };

  // Formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="product-search-container">
      {/* Filtres de recherche */}
      <div className="search-filters">
        <h2>Recherche de pièces automobiles</h2>
        
        <div className="filters-grid">
          {/* Recherche textuelle */}
          <div className="filter-group">
            <label>Recherche</label>
            <input
              type="text"
              placeholder="Nom, description, marque..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Catégorie */}
          <div className="filter-group">
            <label>Catégorie</label>
            <select
              value={filters.categorie}
              onChange={(e) => handleFilterChange('categorie', e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Marque */}
          <div className="filter-group">
            <label>Marque</label>
            <input
              type="text"
              placeholder="Toyota, BMW..."
              value={filters.marque}
              onChange={(e) => handleFilterChange('marque', e.target.value)}
            />
          </div>

          {/* Modèle */}
          <div className="filter-group">
            <label>Modèle</label>
            <input
              type="text"
              placeholder="Corolla, X5..."
              value={filters.modele}
              onChange={(e) => handleFilterChange('modele', e.target.value)}
            />
          </div>

          {/* Année */}
          <div className="filter-group">
            <label>Année</label>
            <input
              type="number"
              placeholder="2020"
              min="1900"
              max="2030"
              value={filters.annee}
              onChange={(e) => handleFilterChange('annee', e.target.value)}
            />
          </div>

          {/* Prix minimum */}
          <div className="filter-group">
            <label>Prix minimum (€)</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={filters.prixMin}
              onChange={(e) => handleFilterChange('prixMin', e.target.value)}
            />
          </div>

          {/* Prix maximum */}
          <div className="filter-group">
            <label>Prix maximum (€)</label>
            <input
              type="number"
              placeholder="1000"
              min="0"
              value={filters.prixMax}
              onChange={(e) => handleFilterChange('prixMax', e.target.value)}
            />
          </div>

          {/* Disponibilité */}
          <div className="filter-group">
            <label>Disponibilité</label>
            <select
              value={filters.disponibilite}
              onChange={(e) => handleFilterChange('disponibilite', e.target.value)}
            >
              <option value="">Tous</option>
              <option value="true">Disponible</option>
              <option value="false">Non disponible</option>
            </select>
          </div>

          {/* Tri */}
          <div className="filter-group">
            <label>Trier par</label>
            <select
              value={filters.tri}
              onChange={(e) => handleFilterChange('tri', e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="search-results">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des produits...</p>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="results-stats">
              <p>
                {pagination.total} produit{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
                {pagination.pages > 1 && ` (page ${pagination.page} sur ${pagination.pages})`}
              </p>
            </div>

            {/* Liste des produits */}
            <div className="products-grid">
              {products.length === 0 ? (
                <div className="no-results">
                  <p>Aucun produit trouvé avec ces critères</p>
                  <button 
                    className="clear-filters-btn"
                    onClick={() => setFilters({
                      search: '',
                      categorie: '',
                      marque: '',
                      modele: '',
                      annee: '',
                      prixMin: '',
                      prixMax: '',
                      disponibilite: '',
                      tri: 'date_desc'
                    })}
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              ) : (
                products.map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.nom} />
                      ) : (
                        <div className="no-image">
                          <span>🛠️</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.nom}</h3>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-details">
                        <span className="product-price">{formatPrice(product.prix)}</span>
                        <span className={`product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                        </span>
                      </div>
                      
                      <div className="product-meta">
                        {product.categorie && (
                          <span className="product-category">{product.categorie}</span>
                        )}
                        {product.marque && (
                          <span className="product-brand">{product.marque}</span>
                        )}
                        {product.modele && (
                          <span className="product-model">{product.modele}</span>
                        )}
                        {product.annee && (
                          <span className="product-year">{product.annee}</span>
                        )}
                      </div>
                      
                      <div className="product-date">
                        Ajouté le {formatDate(product.dateAjout)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="pagination-btn"
                >
                  Précédent
                </button>
                
                <span className="pagination-info">
                  Page {pagination.page} sur {pagination.pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="pagination-btn"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductSearch; 