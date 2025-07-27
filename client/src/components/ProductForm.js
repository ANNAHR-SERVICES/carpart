import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import './ProductForm.css';

const ProductForm = ({ onSuccess, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    year: initialData?.year || '',
    condition: initialData?.condition || '',
    stock: initialData?.stock || ''
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(initialData?.images || []);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration de react-dropzone
  const onDrop = useCallback((acceptedFiles) => {
    // Vérifier la taille des fichiers
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5MB)`);
        return false;
      }
      return true;
    });

    // Vérifier le nombre total d'images
    if (images.length + validFiles.length > 10) {
      toast.error('Maximum 10 images autorisées');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Créer les previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  // Supprimer une image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0 && previewImages.length === 0) {
      toast.error('Au moins une image est requise');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les données du formulaire
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Ajouter les nouvelles images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      let response;
      if (isEditing && initialData?._id) {
        response = await productAPI.updateProduct(initialData._id, formDataToSend);
        toast.success('Produit mis à jour avec succès!');
      } else {
        response = await productAPI.createProduct(formDataToSend);
        toast.success('Produit créé avec succès!');
      }

      if (onSuccess) {
        onSuccess(response.data.data);
      }

      // Réinitialiser le formulaire si création
      if (!isEditing) {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          brand: '',
          model: '',
          year: '',
          condition: '',
          stock: ''
        });
        setImages([]);
        setPreviewImages([]);
      }

    } catch (error) {
      console.error('Erreur:', error);
      const message = error.response?.data?.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h2>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nom du produit *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Prix (TND) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={1000}
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Catégorie *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Engine">Moteur</option>
              <option value="Transmission">Transmission</option>
              <option value="Brakes">Freins</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Électrique</option>
              <option value="Body">Carrosserie</option>
              <option value="Interior">Intérieur</option>
              <option value="Other">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="condition">État *</label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner l'état</option>
              <option value="New">Neuf</option>
              <option value="Used">Occasion</option>
              <option value="Refurbished">Remis à neuf</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="brand">Marque *</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Modèle *</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="year">Année *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        {/* Zone d'upload d'images */}
        <div className="form-group">
          <label>Images du produit *</label>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <i className="upload-icon">📁</i>
              {isDragActive ? (
                <p>Déposez les images ici...</p>
              ) : (
                <p>Glissez-déposez des images ici, ou cliquez pour sélectionner</p>
              )}
              <p className="dropzone-info">
                Formats acceptés: JPG, PNG, GIF, WebP (max 5MB par image, max 10 images)
              </p>
            </div>
          </div>
        </div>

        {/* Preview des images */}
        {previewImages.length > 0 && (
          <div className="image-preview-container">
            <h4>Aperçu des images ({previewImages.length})</h4>
            <div className="image-preview-grid">
              {previewImages.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img src={image} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le produit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm; 