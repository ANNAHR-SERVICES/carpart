import React, { useState, useEffect } from "react";
import "./ProductSearch.css";

const ProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // VIN ou mot-clé
  const [pieceName, setPieceName] = useState(""); // Nom de la pièce
  const [carName, setCarName] = useState(""); // Nom de la voiture
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const productsPerPage = 6;

  // Produits par défaut
  const defaultProducts = [
    {
      id: 1,
      name: "Plaquettes de frein",
      car: "BMW Série 3",
      description: "Plaquettes de frein haute qualité pour sécurité optimale",
      price: 120,
      category: "Freins",
      brand: "Brembo",
      model: "X123",
      year: "2023",
      condition: "Neuf",
      stock: 20,
      vin: "1HGCM82633A123456",
      image: "/images/brake-pads.jpg",
    },
    {
      id: 2,
      name: "Filtre à huile",
      car: "Toyota Corolla",
      description: "Filtre à huile durable pour performance moteur propre",
      price: 35,
      category: "Moteur",
      brand: "Bosch",
      model: "OF200",
      year: "2024",
      condition: "Neuf",
      stock: 50,
      vin: "5FNYF4H92HB123456",
      image: "/images/oil-filter.jpg",
    },
    {
      id: 3,
      name: "Ampoule LED",
      car: "Volkswagen Golf",
      description: "Ampoule LED haute luminosité pour phares",
      price: 80,
      category: "Éclairage",
      brand: "Philips",
      model: "L900",
      year: "2022",
      condition: "Neuf",
      stock: 15,
      vin: "3VWFE21C04M123456",
      image: "/images/headlight-led.jpg",
    },
  ];

  useEffect(() => {
    setProducts(defaultProducts);
    setFilteredProducts(defaultProducts);
  }, []);

  // Fonction de recherche par VIN, nom de pièce ou nom de voiture
  const handleSearch = () => {
    const vinQuery = searchQuery.trim().toLowerCase();
    const pieceQuery = pieceName.trim().toLowerCase();
    const carQuery = carName.trim().toLowerCase();

    if (!vinQuery && !pieceQuery && !carQuery) {
      setError("⚠️ Veuillez entrer un VIN, le nom de la pièce ou le nom de la voiture.");
      setFilteredProducts([]);
      return;
    }

    setError("");

    const results = products.filter((p) => {
      const matchesVin = vinQuery.length === 17 && p.vin.toLowerCase() === vinQuery;
      const matchesPiece = pieceQuery && p.name.toLowerCase().includes(pieceQuery);
      const matchesCar = carQuery && p.car.toLowerCase().includes(carQuery);
      return matchesVin || matchesPiece || matchesCar;
    });

    setFilteredProducts(results);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts
    .filter((p) => category === "all" || p.category === category)
    .slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(
    filteredProducts.filter((p) => category === "all" || p.category === category)
      .length / productsPerPage
  );

  return (
    <div className="product-search-page">
      {/* Section recherche */}
      <div className="search-filters">
        <h2>Recherche de pièces</h2>
        <div className="filters-container">
          <input
            type="text"
            placeholder="Entrer VIN (17 caractères)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nom de la pièce..."
            value={pieceName}
            onChange={(e) => setPieceName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Nom de la voiture..."
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            <option value="Moteur">Moteur</option>
            <option value="Freins">Freins</option>
            <option value="Éclairage">Éclairage</option>
            <option value="Électricité">Électricité</option>
          </select>
          <button className="search-btn" onClick={handleSearch}>
            🔍 Rechercher
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && <p className="error-message">{error}</p>}

      {/* Résultats */}
      <div className="products-grid">
        {currentProducts.length === 0 ? (
          <p className="no-results">Aucun produit trouvé.</p>
        ) : (
          currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => (e.target.src = "/images/default-part.png")}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-car"><b>Voiture:</b> {product.car}</p>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price} TND</p>
                <p className="product-stock">
                  Stock:{" "}
                  {product.stock > 0
                    ? `${product.stock} disponible`
                    : "Rupture"}
                </p>
                <p>
                  <b>VIN:</b> {product.vin}
                </p>
                <div className="product-meta">
                  <span>{product.category}</span>
                  <span>{product.brand}</span>
                  <span>{product.model}</span>
                  <span>{product.year}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              className={num === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
