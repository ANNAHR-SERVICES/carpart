import React, { useState } from "react";
import ProductTable from "../components/ProductTable";

const ProductTablePage = () => {
  const [products, setProducts] = useState([
    {
      _id: "1",
      name: "Filtre à huile",
      brand: "Bosch",
      model: "X200",
      year: "2023",
      description: "Filtre haute qualité",
      category: "Engine",
      price: 45,
      stock: 10,
      condition: "New",
      images: [],
      createdAt: new Date(),
    }
  ]);

  const handleEdit = (product) => {
    console.log("Modifier :", product);
  };

  const handleDelete = (id) => {
    console.log("Supprimer :", id);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Liste des produits</h1>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductTablePage;
