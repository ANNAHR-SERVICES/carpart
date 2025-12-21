import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingBag, faClock } from '@fortawesome/free-solid-svg-icons'; 

const ResultatsRechercheAccueil = ({ 
  results, 
  loading, 
  error, 
  categories = [], 
  activeSearchParams, 
  onFilterChange 
}) => {

  const [localFilters, setLocalFilters] = useState({
    categorie: '',
    etat: '',
    prixMin: '',
    prixMax: ''
  });

  const handleFilterChange = (e) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault(); 
    onFilterChange(localFilters); 
  };

  const handleReserveClick = (piece) => {
    alert(`Action: Réserver la pièce ${piece.nom} (ID: ${piece.id})`);
  };

  const handleBuyNowClick = (piece) => {
    alert(`Action: Acheter Maintenant la pièce ${piece.nom} (ID: ${piece.id})`);
  };

  return (
    <div className="resultats-recherche-accueil">
      <h3>
        Résultats de la recherche pour&nbsp;
        {activeSearchParams.type === 'model' ? 
          `${activeSearchParams.marque} ${activeSearchParams.modele}` : 
          activeSearchParams.type === 'part' ? 
          `Pièce: ${activeSearchParams.keyword}` : 
          `VIN: ${activeSearchParams.vin.substring(0, 4)}...`}
      </h3>

      <form onSubmit={handleFilterSubmit} className="search-filters-form">
        <div className="search-filters-row">
          <select name="categorie" value={localFilters.categorie} onChange={handleFilterChange}>
            <option value="">Toutes Catégories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.nom}</option>
            ))}
          </select>

          <select name="etat" value={localFilters.etat} onChange={handleFilterChange}>
            <option value="">Tout État</option>
            <option value="neuf">Neuf</option>
            <option value="occasion">Occasion</option>
          </select>

          <input
            type="number"
            name="prixMin"
            placeholder="Prix min"
            value={localFilters.prixMin}
            onChange={handleFilterChange}
          />

          <input
            type="number"
            name="prixMax"
            placeholder="Prix max"
            value={localFilters.prixMax}
            onChange={handleFilterChange}
          />

          <button type="submit" className="btn-filter-submit" disabled={loading}>
            <FontAwesomeIcon icon={faSearch} /> Filtrer
          </button>
        </div>
      </form>

      <div className="results-list">
        {loading ? (
          <div className="loading-message">Recherche en cours...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : results.length > 0 ? (
          results.map(piece => (
            <div key={piece.id} className="piece-card">
              {piece.imageUrl && (
                <div className="piece-image-container">
                  <img
                    src={piece.imageUrl}
                    alt={piece.nom}
                    className="piece-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-part.png";
                    }}
                  />
                </div>
              )}

              <div className="piece-info">
                <h4>{piece.nom}</h4>
                <p>Ref: {piece.reference} | Catégorie: {piece.categorie}</p>
                <p className="piece-price">Prix: <strong>{piece.prix} TND</strong></p>
                <p className="piece-etat">État: {piece.etat}</p>
              </div>

              <div className="piece-actions">
                <button
                  className="btn-reserve-action"
                  onClick={() => handleReserveClick(piece)}
                >
                  <FontAwesomeIcon icon={faClock} /> Réserver
                </button>

                <button
                  className="btn-buy-now-action"
                  onClick={() => handleBuyNowClick(piece)}
                >
                  <FontAwesomeIcon icon={faShoppingBag} /> Acheter Maintenant
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results-message">Aucun résultat trouvé.</div>
        )}
      </div>
    </div>
  );
};

export default ResultatsRechercheAccueil;
