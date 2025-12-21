import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './contact.css';
import logo from "../images/logo.jpg";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire envoyé:', formData);
    alert('Message envoyé avec succès !');
    setFormData({ nom: '', email: '', sujet: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="container">
          <div className="brand-container" onClick={() => navigate('/')}>
            <img src={logo} alt="Logo" className="accueil-logo-img" />
            <h1>Dongo - Auto Spare Parts</h1>
          </div>

          <nav className="nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              Accueil
            </a>
            <a href="/contact" className="active" onClick={(e) => e.preventDefault()}>
              Contact
            </a>
          </nav>
        </div>
      </header>

      <section className="contact-main">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Contactez-nous</h2>
              <p>Une question ? Besoin d'aide ? Notre équipe est là pour vous.</p>

              <div className="info-items">
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h4>Téléphone</h4>
                    <p>+216 71 000 000</p>
                  </div>
                </div>

                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <p>support@annahr.tn</p>
                  </div>
                </div>

                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Adresse</h4>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom complet</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                />
              </div>

              <div className="form-group">
                <label>Sujet</label>
                <input
                  type="text"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  required
                  placeholder="Sujet de votre message"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Votre message..."
                />
              </div>

              <button type="submit" className="btn-submit">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
