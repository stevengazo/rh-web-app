/**
 * Formatea un número como moneda en colones costarricenses
 * @param {number|string} value
 * @returns {string}
 */
export const formatMoney = (value = 0) => {
  return `₡${Number(value).toLocaleString('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
