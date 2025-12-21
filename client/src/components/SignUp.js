import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const SignUp = ({ onClose, onSigninClick, onSuccess }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "", 
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";

    if (!formData.email.trim()) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format d'email invalide";

    if (!formData.password) newErrors.password = "Mot de passe requis";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 caractères";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirmation requise";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";

    if (!formData.role) newErrors.role = "Veuillez choisir un rôle";

    if (!formData.termsAccepted)
      newErrors.termsAccepted = "Vous devez accepter les conditions générales";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData = {
        _id: `user_${Date.now()}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
      };
      const token = `token_${Date.now()}_${Math.random()}`;

      login(userData, token);
      toast.success(`Compte ${formData.role} créé avec succès!`);

      if (onSuccess) onSuccess(userData); 

      const destination = formData.role === "vendeur" 
        ? "/vendeur/dashboard" 
        : "/acheteur/dashboard";
      
      navigate(destination, { replace: true });

      if (onClose) onClose();

    } catch (error) {
      console.error("Erreur lors de la création du compte simulée:", error);
      toast.error("Une erreur est survenue lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-view">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            placeholder="Prénom *"
            value={formData.firstName}
            onChange={handleChange}
            className={`form-group__input ${errors.firstName ? "form-group__input--error" : ""}`}
            disabled={loading}
          />
          {errors.firstName && (
            <span className="error-message">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="lastName"
            placeholder="Nom *"
            value={formData.lastName}
            onChange={handleChange}
            className={`form-group__input ${errors.lastName ? "form-group__input--error" : ""}`}
            disabled={loading}
          />
          {errors.lastName && (
            <span className="error-message">{errors.lastName}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Saisissez votre email *"
            value={formData.email}
            onChange={handleChange}
            className={`form-group__input ${errors.email ? "form-group__input--error" : ""}`}
            disabled={loading}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Entrer le mot de passe *"
            value={formData.password}
            onChange={handleChange}
            className={`form-group__input ${errors.password ? "form-group__input--error" : ""}`}
            disabled={loading}
          />
          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer mot de passe *"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-group__input ${errors.confirmPassword ? "form-group__input--error" : ""}`}
            disabled={loading}
          />
          {errors.confirmPassword && (
            <span className="error-message">{errors.confirmPassword}</span>
          )}
        </div>

        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`form-group__select ${formData.role ? '' : 'placeholder-selected'} ${errors.role ? "form-group__input--error" : ""}`}
            disabled={loading}
          >
            <option value="" disabled hidden>Choisir un rôle *</option>
            <option value="acheteur">Acheteur</option>
            <option value="vendeur">Vendeur</option>
          </select>
          {errors.role && <span className="error-message">{errors.role}</span>}
        </div>

        <div className="checkbox-group">
          <label className="checkbox-group__label">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              disabled={loading}
            />
            <span>J'ai lu et j'accepte les conditions générales</span>
          </label>
          {errors.termsAccepted && (
            <span className="error-message">{errors.termsAccepted}</span>
          )}
        </div>

        <button 
          type="submit" 
          className={`signup-form__button ${loading ? "signup-form__button--loading" : ""}`} 
          disabled={loading}
        >
          {loading ? "Création en cours..." : "Créer un compte"}
        </button>

        <div className="signup-footer">
          <p>
            Vous avez déjà un compte ?{" "}
            <button
              type="button"
              onClick={onSigninClick}
              className="signup-footer__link-button"
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;