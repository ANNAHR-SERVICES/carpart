import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faCar, faToolbox, faBarcode } from '@fortawesome/free-solid-svg-icons'; 

const SearchBarAccueil = ({ 
    onSearchSubmit, 
    marques = [], 
    modeles = [], 
    moteurs = [], 
    loading 
}) => {
    const [activeTab, setActiveTab] = useState('model');
    const [error, setError] = useState(null);

    const [modelData, setModelData] = useState({
        marque: '', 
        modele: '',
        moteur: ''
    });

    const [partData, setPartData] = useState({
        keyword: '', 
    });
    
    const [vinData, setVinData] = useState({
        vin: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        let params = {};

        switch (activeTab) {
            case 'model':
                if (!modelData.marque || !modelData.modele || !modelData.moteur) {
                    setError("Veuillez sélectionner la Marque, le Modèle et la Motorisation.");
                    return;
                }
                params = { type: 'model', ...modelData };
                break;
            case 'part':
                if (!partData.keyword) {
                    setError("Veuillez entrer une référence ou un mot-clé pour la pièce.");
                    return;
                }
                params = { type: 'part', keyword: partData.keyword };
                break;
            case 'vin':
                if (!vinData.vin || vinData.vin.length !== 17) {
                    setError("Le numéro de châssis (VIN) doit contenir 17 caractères.");
                    return;
                }
                params = { type: 'vin', vin: vinData.vin };
                break;
            default:
                return;
        }
        
        onSearchSubmit(params);
    };

    const handleModelChange = (e) => {
        setModelData({ ...modelData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const selectedModelFilters = [
        { key: 'marque', label: modelData.marque, data: modelData.marque, setter: (val) => setModelData(p => ({...p, marque: val, modele: '', moteur: ''})) },
        { key: 'modele', label: modelData.modele, data: modelData.modele, setter: (val) => setModelData(p => ({...p, modele: val, moteur: ''})) },
        { key: 'moteur', label: modelData.moteur, data: modelData.moteur, setter: (val) => setModelData(p => ({...p, moteur: val})) },
    ].filter(f => f.data);
    
    const handleRemoveFilter = (setter) => {
        setter(''); 
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        setError(null);
    }

    return (
        <div className="accueil-search-bar">
            <h2 className="search-main-title">Trouvez vos pièces auto</h2>
            
            <div className="search-tabs">
                <button 
                    type="button"
                    className={`tab-button ${activeTab === 'model' ? 'active' : ''}`} 
                    onClick={() => changeTab('model')}
                >
                    <FontAwesomeIcon icon={faCar} /> PAR MODÈLE
                </button>
                <button 
                    type="button"
                    className={`tab-button ${activeTab === 'vin' ? 'active' : ''}`} 
                    onClick={() => changeTab('vin')}
                >
                    <FontAwesomeIcon icon={faBarcode} /> PAR VIN
                </button>
            </div>

            <form className="search-form-accueil" onSubmit={handleSubmit}>
                
                {activeTab === 'model' && (
                    <div className="form-model-content">
                        
                        {selectedModelFilters.length > 0 && (
                            <div className="selected-filters-display">
                                {selectedModelFilters.map((filter) => (
                                    <div key={filter.key} className="selected-filter-chip">
                                        <span>{filter.label}</span>
                                        <button 
                                            type="button" 
                                            className="remove-filter-btn" 
                                            onClick={() => handleRemoveFilter(filter.setter)}
                                            aria-label={`Retirer ${filter.label}`}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div className="input-field-group">
                            <select name="marque" value={modelData.marque} onChange={handleModelChange} required>
                                <option value="" disabled>-- Marque --</option>
                                {marques.map(m => (
                                    <option key={m.value} value={m.value}>{m.nom}</option>
                                ))}
                            </select>
                            
                            <select name="modele" value={modelData.modele} onChange={handleModelChange} required disabled={!modelData.marque}>
                                <option value="" disabled>-- Modèle --</option>
                                {modeles.map(mod => (
                                    <option key={mod.value} value={mod.value}>{mod.nom}</option>
                                ))}
                            </select>
                            
                            <select name="moteur" value={modelData.moteur} onChange={handleModelChange} required disabled={!modelData.modele}>
                                <option value="" disabled>-- Motorisation --</option>
                                {moteurs.map(mot => (
                                    <option key={mot.value} value={mot.value}>{mot.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                
                {activeTab === 'part' && (
                    <div className="form-part-content">
                        <input 
                            type="text" 
                            placeholder="Entrez référence, nom de pièce ou mot-clé (Ex: Plaquette de Frein, 0 986 494 001)" 
                            value={partData.keyword}
                            onChange={(e) => setPartData({ keyword: e.target.value })}
                            className="form-control"
                            required
                        />
                    </div>
                )}

                {activeTab === 'vin' && (
                    <div className="form-vin-content">
                        <input 
                            type="text" 
                            placeholder="Entrez le numéro de châssis (VIN - 17 caractères)" 
                            value={vinData.vin}
                            onChange={(e) => setVinData({ vin: e.target.value.toUpperCase() })}
                            maxLength="17"
                            className="form-control"
                            required
                        />
                    </div>
                )}
                
                <button type="submit" className="btn-search-accueil" disabled={loading}>
                    {loading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                        <FontAwesomeIcon icon={faSearch} />
                    )}
                </button>
            </form>
            
            {error && <div className="error-search-accueil">{error}</div>}
        </div>
    );
};

export default SearchBarAccueil;