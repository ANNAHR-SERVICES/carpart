import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';
import './ProductFormModal.css';

const ProductFormModal = ({ product, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
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

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialiser le formulaire avec les données du produit si en mode édition
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        brand: product.brand || '',
        model: product.model || '',
        year: product.year || '',
        condition: product.condition || '',
        stock: product.stock || ''
      });
      setPreviewImages(product.images || []);
    }
  }, [product]);

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
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0 TND';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marque est requise';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Le modèle est requis';
    }

    if (!formData.year || parseInt(formData.year) < 1900) {
      newErrors.year = 'L\'année doit être valide';
    }

    if (!formData.condition) {
      newErrors.condition = 'L\'état est requis';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Le stock doit être positif';
    }

    if (images.length === 0 && previewImages.length === 0) {
      newErrors.images = 'Au moins une image est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
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
      if (product?._id) {
        response = await productAPI.updateProduct(product._id, formDataToSend);
      } else {
        response = await productAPI.createProduct(formDataToSend);
      }

      onSuccess(response.data.data);

    } catch (error) {
      console.error('Erreur:', error);
      const message = error.response?.data?.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nom du produit *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Ex: Freins avant BMW Série 3"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Prix (TND) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
                min="0"
                step="0.01"
                placeholder="0.00 TND"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                rows="4"
                placeholder="Décrivez votre produit en détail..."
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
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
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="condition">État *</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={errors.condition ? 'error' : ''}
              >
                <option value="">Sélectionner l'état</option>
                <option value="New">Neuf</option>
                <option value="Used">Occasion</option>
                <option value="Refurbished">Remis à neuf</option>
              </select>
              {errors.condition && <span className="error-message">{errors.condition}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="brand">Marque *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={errors.brand ? 'error' : ''}
                placeholder="Ex: BMW"
              />
              {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="model">Modèle *</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={errors.model ? 'error' : ''}
                placeholder="Ex: Série 3"
              />
              {errors.model && <span className="error-message">{errors.model}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="year">Année *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={errors.year ? 'error' : ''}
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder="2020"
              />
              {errors.year && <span className="error-message">{errors.year}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          {/* Zone d'upload d'images */}
          <div className="form-group">
            <label>Images du produit *</label>
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? 'active' : ''} ${errors.images ? 'error' : ''}`}
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
            {errors.images && <span className="error-message">{errors.images}</span>}
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
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="submit-btn"
            >
              {isLoading ? 'Enregistrement...' : (product ? 'Mettre à jour' : 'Créer le produit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal; 