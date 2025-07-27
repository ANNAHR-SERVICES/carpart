import React from 'react';
import { formatPrice } from '../utils/currency';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete }) => {
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

  // Obtenir le statut du stock
  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { text: 'Rupture', class: 'out-of-stock' };
    } else if (stock <= 5) {
      return { text: 'Faible', class: 'low-stock' };
    } else {
      return { text: 'En stock', class: 'in-stock' };
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>État</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            
            return (
              <tr key={product._id} className="product-row">
                <td className="product-image-cell">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="product-thumbnail"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNCAzMEMyNCAyNi44Njg5IDI2Ljg2ODkgMjQgMzAgMjRDMzMuMTMxMSAyNCAzNiAyNi44Njg5IDM2IDMwQzM2IDMzLjEzMTEgMzMuMTMxMSAzNiAzMCAzNkMyNi44Njg5IDM2IDI0IDMzLjEzMTEgMjQgMzBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0zMCAzN0MzMy4xMzExIDM3IDM2IDM0LjEzMTEgMzYgMzFDMzYgMjcuODY4OSAzMy4xMzExIDI1IDMwIDI1QzI2Ljg2ODkgMjUgMjQgMjcuODY4OSAyNCAzMUMyNCAzNC4xMzExIDI2Ljg2ODkgMzcgMzAgMzdaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg==';
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      <span>📷</span>
                    </div>
                  )}
                </td>
                
                <td className="product-info-cell">
                  <div className="product-details">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-brand">{product.brand} - {product.model} ({product.year})</p>
                    <p className="product-description">
                      {product.description.length > 60 
                        ? `${product.description.substring(0, 60)}...` 
                        : product.description
                      }
                    </p>
                  </div>
                </td>
                
                <td className="category-cell">
                  <span className="category-badge">
                    {getCategoryIcon(product.category)} {product.category}
                  </span>
                </td>
                
                <td className="price-cell">
                  <span className="price">{formatPrice(product.price)}</span>
                </td>
                
                <td className="stock-cell">
                  <span className={`stock-status ${stockStatus.class}`}>
                    {product.stock} unité{product.stock > 1 ? 's' : ''}
                  </span>
                  <span className="stock-label">{stockStatus.text}</span>
                </td>
                
                <td className="condition-cell">
                  <span 
                    className="condition-badge"
                    style={{ color: getConditionColor(product.condition) }}
                  >
                    {product.condition}
                  </span>
                </td>
                
                <td className="date-cell">
                  <span className="date">{formatDate(product.createdAt)}</span>
                </td>
                
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(product)}
                      className="edit-btn"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="delete-btn"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable; 