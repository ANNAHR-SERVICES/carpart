// Utilitaire pour la gestion de la monnaie tunisienne

/**
 * Formate un prix en dinars tunisiens
 * @param {number} price - Le prix à formater
 * @param {boolean} showSymbol - Afficher le symbole TND (défaut: true)
 * @returns {string} Le prix formaté
 */
export const formatPrice = (price, showSymbol = true) => {
  if (price === null || price === undefined || isNaN(price)) {
    return showSymbol ? '0.00 TND' : '0.00';
  }
  
  const formattedPrice = parseFloat(price).toFixed(2);
  return showSymbol ? `${formattedPrice} TND` : formattedPrice;
};

/**
 * Formate un prix pour l'affichage dans les statistiques
 * @param {number} price - Le prix à formater
 * @returns {string} Le prix formaté pour les stats
 */
export const formatPriceForStats = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0.00 TND';
  }
  
  const num = parseFloat(price);
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M TND`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K TND`;
  } else {
    return `${num.toFixed(2)} TND`;
  }
};

/**
 * Valide un prix
 * @param {number|string} price - Le prix à valider
 * @returns {boolean} True si le prix est valide
 */
export const isValidPrice = (price) => {
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0;
};

/**
 * Convertit un prix en centimes (pour éviter les problèmes de précision)
 * @param {number} price - Le prix en dinars
 * @returns {number} Le prix en centimes
 */
export const priceToCents = (price) => {
  return Math.round(parseFloat(price) * 100);
};

/**
 * Convertit un prix de centimes vers dinars
 * @param {number} cents - Le prix en centimes
 * @returns {number} Le prix en dinars
 */
export const centsToPrice = (cents) => {
  return parseFloat(cents) / 100;
}; 