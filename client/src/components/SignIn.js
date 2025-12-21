import React, { useState } from "react";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Veuillez remplir tous les champs");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    new Promise(resolve => setTimeout(resolve, 1000))
      .then(() => {
        let userRole = "acheteur"; 
        
        if (formData.email.includes("vendeur")) {
            userRole = "vendeur";
        } else if (formData.email.includes("admin")) {
            userRole = "admin";
        } else {
            userRole = "acheteur";
        }
        
        const fakeUser = {
            _id: "mock_id_" + Date.now(),
            email: formData.email,
            role: userRole, 
            name: userRole.charAt(0).toUpperCase() + userRole.slice(1),
        };
        const fakeToken = "FAKE_TOKEN_12345";

        login(fakeUser, fakeToken);
        toast.success("Connexion réussie !");

        let destination = "/acheteur/dashboard"; 

        if (userRole === "vendeur") {
            destination = "/vendeur/dashboard";
        } else if (userRole === "admin") {
            destination = "/admin/dashboard"; 
        }
        
        navigate(destination, { replace: true });
      })
      .catch(error => {
        console.error("Erreur de connexion simulée:", error);
        toast.error("Email ou mot de passe incorrect."); 
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="signin-view">
      <form onSubmit={handleSubmit} className="signin-form">
        <h2 className="signin-form__title">Connexion</h2>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email *"
            onChange={handleChange}
            value={formData.email}
            className="form-group__input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe *"
            onChange={handleChange}
            value={formData.password}
            className="form-group__input"
            disabled={loading}
          />
        </div>

        <div className="form-options">
          <button type="button" className="form-options__link">
            Mot de passe oublié ?
          </button>
        </div>

        <button 
          type="submit" 
          className={`signin-form__button ${loading ? "signin-form__button--loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}