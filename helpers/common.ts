/**
 * Format number to currency string
 * @param {number} value - The number to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
};

/**
 * Format a listing price the Spanish way: symbol after the amount, cents only
 * when they are not zero ("123 €", "12,50 €"). Use everywhere a price is shown
 * so the shop, the product page and the seller profile agree.
 */
export const formatPrice = (value: number): string => {
  const cents = Math.round(value * 100) % 100 !== 0;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(value);
};
