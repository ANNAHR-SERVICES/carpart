import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';
import ProductTable from './ProductTable';
import ProductFormModal from './ProductFormModal';
import PreorderList from './PreorderList';
import toast from 'react-hot-toast';

import './VendorDashboard.css';

const formatPriceLocally = (value) => {
    try {
        const numericValue = parseFloat(value) || 0;
        return new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
    } catch (e) {
        return (parseFloat(value) || 0).toFixed(2);
    }
};

const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <p className="stat-title">{title}</p>
            <p className="stat-value">{value}</p>
        </div>
    </div>
);

const VendorDashboard = () => {
    const { user, loading: authLoading } = useAuth(); 

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [errorMsg, setErrorMsg] = useState('');
    const [currentView, setCurrentView] = useState('products');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const loadProducts = useCallback(async (sellerId) => {
        if (!sellerId) return;

        try {
            setLoading(true);
            setErrorMsg('');
            const response = await productAPI.getSellerProducts(sellerId); 
            setProducts(Array.isArray(response.data?.data) ? response.data.data : []); 
        } catch (error) {
            console.error(error);
            let msg = error.response?.data?.message || error.message || 'Erreur chargement produits';
            if (error.response?.status === 401 || error.response?.status === 403) {
                msg = 'Authentification expirée';
            }
            setErrorMsg(msg);
            toast.error(msg);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user && user._id) {
            loadProducts(user._id);
        } 
    }, [authLoading, user, loadProducts]); 

    const handleProductSuccess = (product) => {
        if (editingProduct) {
            setProducts(prev => 
                prev.map(p => p._id === product._id ? product : p)
            );
            toast.success('Produit mis à jour');
        } else {
            setProducts(prev => [product, ...prev]);
            toast.success('Produit créé');
        }
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Confirmer la suppression ?')) return;

        try {
            await productAPI.deleteProduct(productId);
            setProducts(prev => prev.filter(p => p._id !== productId));
            toast.success('Produit supprimé');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };
    
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    const filteredAndSortedProducts = products
        .filter(product => {
            const name = product.name?.toLowerCase() || '';
            const description = product.description?.toLowerCase() || '';
            const brand = product.brand?.toLowerCase() || '';
            const category = product.category || '';

            const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                                  description.includes(searchTerm.toLowerCase()) ||
                                  brand.includes(searchTerm.toLowerCase());
            const matchesCategory = !filterCategory || category === filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let aValue, bValue;
            switch (sortBy) {
                case 'name':
                    aValue = a.name?.toLowerCase() || '';
                    bValue = b.name?.toLowerCase() || '';
                    break;
                case 'price':
                    aValue = parseFloat(a.price) || 0;
                    bValue = parseFloat(b.price) || 0;
                    break;
                case 'stock':
                    aValue = parseInt(a.stock) || 0;
                    bValue = parseInt(b.stock) || 0;
                    break;
                default:
                    aValue = new Date(a.createdAt || 0); 
                    bValue = new Date(b.createdAt || 0);
                    break;
            }
            let comp = aValue > bValue ? 1 : -1;
            return sortOrder === 'asc' ? comp : comp * -1;
        });

    const stats = {
        total: products.length,
        inStock: products.filter(p => p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        totalValue: products.reduce((sum, p) => sum + ((parseFloat(p.price) || 0) * (parseInt(p.stock) || 0)), 0)
    };
    
    return (
        <div className="vendor-dashboard-wrapper"> 
            
            {(authLoading || loading) && ( 
                <div className="full-screen-loader">
                    <div className="loading-spinner"></div>
                    <p>{authLoading ? "Session..." : "Chargement..."}</p>
                </div>
            )}

            <div className={`vendor-dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                
                <aside className="dashboard-sidebar">
                    <div className="sidebar-header">
                        <h2>Dongo Vendeur</h2>
                        <button className="toggle-sidebar-btn desktop-only" onClick={toggleSidebar}>
                            {isSidebarOpen ? '❮' : '❯'} 
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        <button className={`nav-link ${currentView === 'products' ? 'active' : ''}`} onClick={() => setCurrentView('products')}>
                            <span className="nav-icon">📦</span> 
                            <span>{isSidebarOpen ? 'Mes Produits' : null}</span>
                        </button>
                        <button className={`nav-link ${currentView === 'preorders' ? 'active' : ''}`} onClick={() => setCurrentView('preorders')}>
                            <span className="nav-icon">📋</span>
                            <span>{isSidebarOpen ? 'Précommandes' : null}</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                         {isSidebarOpen ? <p className="user-info">{user?.email}</p> : <span>👤</span>}
                    </div>
                </aside>

                <main className="dashboard-main-content">
                    <header className="main-header">
                        <h1>{currentView === 'products' ? 'Inventaire' : 'Précommandes'}</h1>
                        <button className="toggle-sidebar-btn mobile-only" onClick={toggleSidebar}>
                            {isSidebarOpen ? '❮' : '❯'} 
                        </button>
                    </header>

                    {currentView === 'products' && (
                        <>
                            <div className="stats-container grid-4-cols">
                                <StatCard title="Total Produits" value={stats.total} icon="🔢" />
                                <StatCard title="En Stock" value={stats.inStock} icon="✅" />
                                <StatCard title="Rupture" value={stats.outOfStock} icon="⚠️" />
                                <StatCard title="Valeur Stock" value={formatPriceLocally(stats.totalValue)} icon="💰" />
                            </div>
                            
                            <div className="content-panel">
                                <div className="panel-header">
                                    <h3>Liste des Produits</h3>
                                    <button onClick={handleCreateProduct} className="create-product-btn">
                                        + Ajouter
                                    </button>
                                </div>
                                
                                <div className="filters-section">
                                    <div className="search-box">
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                    <div className="filter-controls">
                                         <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
                                            <option value="">Catégories</option>
                                            <option value="Engine">Moteur</option>
                                            <option value="Transmission">Transmission</option>
                                            <option value="Brakes">Freins</option>
                                         </select>
                                         <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-order-btn">
                                            {sortOrder === 'asc' ? 'ASC' : 'DESC'}
                                         </button>
                                    </div>
                                </div>

                                <div className="table-container">
                                    {loading ? (
                                        <div className="loading-spinner"></div>
                                    ) : (
                                        <ProductTable
                                            products={filteredAndSortedProducts}
                                            onEdit={handleEditProduct}
                                            onDelete={handleDeleteProduct}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {currentView === 'preorders' && user?._id && ( 
                        <div className="content-panel">
                             <PreorderList vendorId={user._id} />
                        </div>
                    )}
                </main>
            </div>

            {showModal && (
                <ProductFormModal
                    product={editingProduct}
                    onSuccess={handleProductSuccess}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default VendorDashboard;