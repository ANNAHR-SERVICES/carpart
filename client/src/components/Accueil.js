import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../images/logo.jpg";

import AuthPanel from "./AuthPanel";
import SearchBarAccueil from "./SearchBarAccueil";
import ResultatsRechercheAccueil from "./ResultatsRechercheAccueil";

import "./Accueil.css";

const Accueil = () => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authView, setAuthView] = useState("signin");

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [marques, setMarques] = useState([]);
    const [modeles, setModeles] = useState([]);
    const [moteurs, setMoteurs] = useState([]);
    const [categories, setCategories] = useState([]);

    const [activeSearchParams, setActiveSearchParams] = useState(null);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);

    const openAuthModal = (view = "signin") => {
        setAuthView(view);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
        setAuthView("signin");
    };

    const switchToSignup = () => setAuthView("signup");
    const switchToSignin = () => setAuthView("signin");

    const handleAuthSuccess = (user) => {
        closeAuthModal();
        const roleRoutes = {
            acheteur: "/acheteur/dashboard",
            vendeur: "/vendeur/dashboard",
            admin: "/admin/dashboard",
            moderateur: "/moderateur/dashboard",
            superadmin: "/superadmin/dashboard",
        };
        navigate(roleRoutes[user.role] || "/acheteur/dashboard");
    };

    const handleSearch = useCallback(async (params, filters = {}) => {
        setLoading(true);
        setError("");
        setResults([]);

        setActiveSearchParams(params);

        try {
            let apiParams = {};

            if (params.type === "vin") {
                apiParams = { vin: params.vin };
            } else if (params.type === "part") {
                apiParams = { keyword: params.keyword };
            } else {
                apiParams = {
                    marque: params.marque,
                    modele: params.modele,
                    moteur: params.moteur,
                };
            }

            const demoResults = [
                {
                    id: 1,
                    nom: "Filtre à Huile X",
                    reference: "W 712/95",
                    categorie: "Filtration",
                    prix: 35.5,
                    etat: "Neuf",
                },
                {
                    id: 2,
                    nom: "Plaquettes de Frein Y",
                    reference: "0 986 494 001",
                    categorie: "Freinage",
                    prix: 120.99,
                    etat: "Occasion",
                },
            ];

            await new Promise(resolve => setTimeout(resolve, 500));

            if (apiParams.marque === "erreur") {
                throw new Error("Erreur de connexion.");
            }

            setResults(demoResults);

            setTimeout(() => {
                document
                    .querySelector(".accueil-results-section")
                    ?.scrollIntoView({ behavior: "smooth" });
            }, 120);

        } catch (error) {
            setError(error.response?.data?.message || "Erreur lors de la recherche");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchFilters = async () => {
            setMarques([
                { value: "vw", nom: "Volkswagen" },
                { value: "audi", nom: "Audi" },
                { value: "bmw", nom: "BMW" },
                { value: "peugeot", nom: "Peugeot" },
                { value: "renault", nom: "Renault" },
            ]);

            setModeles([
                { value: "golf", nom: "Golf" },
                { value: "serie3", nom: "Série 3" },
                { value: "clio", nom: "Clio" },
            ]);

            setMoteurs([
                { value: "essence", nom: "Essence" },
                { value: "diesel", nom: "Diesel" },
                { value: "electrique", nom: "Électrique" },
            ]);

            setCategories([
                { _id: "frn", nom: "Freinage" },
                { _id: "mot", nom: "Moteur" },
                { _id: "susp", nom: "Suspension" },
            ]);
        };

        fetchFilters();
    }, []);

    return (
        <div className="accueil-page">

            <header className="accueil-header">
                <div className="accueil-container">

                    <div className="accueil-logo">
                        <img src={logo} alt="Logo" className="accueil-logo-img" />
                        <h1>Dongo - Auto Spare Parts</h1>
                    </div>

                    <nav className={`accueil-nav ${isMenuOpen ? "accueil-nav-open" : ""}`}>
                        <Link to="/">Accueil</Link>
                        <Link to="/contact">Contact</Link>
                    </nav>

                    <div className="accueil-auth-buttons">
                        <button
                            className="accueil-btn-secondary"
                            onClick={() => openAuthModal("signin")}
                        >
                            Connexion
                        </button>
                    </div>

                    <button className="accueil-menu-toggle" onClick={toggleMenu}>
                        <span></span><span></span><span></span>
                    </button>

                </div>
            </header>

            <section className="accueil-search-dominant-biessa">
                <div className="accueil-container">
                    <SearchBarAccueil
                        onSearchSubmit={handleSearch}
                        marques={marques}
                        modeles={modeles}
                        moteurs={moteurs}
                        loading={loading}
                    />
                </div>
            </section>

            <section className="accueil-hero">
                <div className="accueil-hero-content">
                    <h2>
                        Trouvez vos pièces détachées <br />
                        <span className="highlight">en quelques secondes</span>
                    </h2>
                    <p>
                        La première plateforme tunisienne dédiée à la recherche et à la réservation
                        de pièces automobiles avec QR Code
                    </p>
                </div>
                <div className="accueil-hero-image">
                    <img
                        src="/images/hero-car.jpg"
                        alt="Pièces automobiles"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src =
                                "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";
                        }}
                    />
                </div>
            </section>

            {activeSearchParams && (
                <section className="accueil-results-section">
                    <div className="accueil-container">
                        <ResultatsRechercheAccueil
                            results={results}
                            loading={loading}
                            error={error}
                            categories={categories}
                            activeSearchParams={activeSearchParams}
                            onFilterChange={filters => handleSearch(activeSearchParams, filters)}
                            navigate={navigate}
                        />
                    </div>
                </section>
            )}

            {!activeSearchParams && (
                <>
                    <section className="accueil-features">
                        <div className="accueil-container">
                            <h3>Pourquoi choisir Dongo - Auto Spare Parts ?</h3>
                            <div className="accueil-features-grid">
                                <div className="accueil-feature-card">
                                    <div className="feature-icon">🔍</div>
                                    <h4>Recherche intelligente</h4>
                                    <p>Trouvez la pièce exacte avec VIN ou modèle</p>
                                </div>

                                <div className="accueil-feature-card">
                                    <div className="feature-icon">✅</div>
                                    <h4>Vendeurs de confiance</h4>
                                    <p>Évalués par la communauté</p>
                                </div>

                                <div className="accueil-feature-card">
                                    <div className="feature-icon">📱</div>
                                    <h4>QR Code instantané</h4>
                                    <p>Réservez et récupérez rapidement</p>
                                </div>

                                <div className="accueil-feature-card">
                                    <div className="feature-icon">🚀</div>
                                    <h4>Précommande rapide</h4>
                                    <p>En un seul clic</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="accueil-how-it-works">
                        <div className="accueil-container">
                            <h3>Comment ça marche ?</h3>
                            <div className="allopneus-grid">
                                <div className="allopneus-card">
                                    <div className="card-number">1</div>
                                    <h4>Trouvez vos pièces</h4>
                                    <p>Via modèle ou VIN</p>
                                </div>

                                <div className="allopneus-card">
                                    <div className="card-number">2</div>
                                    <h4>Réservez en ligne</h4>
                                    <p>Simple et rapide</p>
                                </div>

                                <div className="allopneus-card">
                                    <div className="card-number">3</div>
                                    <h4>Récupérez en magasin</h4>
                                    <p>Avec votre QR Code</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            <footer className="accueil-footer">
                <div className="accueil-container">
                    <div className="accueil-footer-content">

                        <div className="accueil-footer-section">
                            <h4>Dongo Services</h4>
                            <p>Plateforme tunisienne certifiée de pièces détachées</p>
                        </div>

                        <div className="accueil-footer-section">
                            <h5>Liens rapides</h5>
                            <ul>
                                <li><Link to="/">Accueil</Link></li>
                                <li><Link to="/recherche">Rechercher</Link></li>
                                <li><Link to="/aide">Contact</Link></li>
                            </ul>
                        </div>

                        <div className="accueil-footer-section">
                            <h5>Contact</h5>
                            <p>Email : support@dongo.tn</p>
                            <p>Tél : +216 71 000 000</p>
                            <p>Adresse : Tunis, Tunisie</p>
                        </div>

                    </div>

                    <div className="accueil-footer-bottom">
                        <p>© 2025 Dongo Services. Tous droits réservés.</p>
                        <p className="footer-legal">
                            <Link to="/mentions-legales">Mentions légales</Link> |
                            <Link to="/confidentialite"> Confidentialité</Link> |
                            <Link to="/cgu"> CGU</Link>
                        </p>
                    </div>
                </div>
            </footer>

            {isAuthModalOpen && (
                <div className="auth-modal-overlay" onClick={closeAuthModal}>
                    <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
                        <button className="auth-modal-close" onClick={closeAuthModal}>×</button>

                        <AuthPanel
                            authView={authView}
                            switchToSignin={switchToSignin}
                            switchToSignup={switchToSignup}
                            onClose={closeAuthModal}
                            onSuccess={handleAuthSuccess}
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

export default Accueil;