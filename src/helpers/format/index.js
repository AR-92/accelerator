/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'datetime')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const d = new Date(date);

  switch (format) {
    case 'long':
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'datetime':
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'time':
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'short':
    default:
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
};

/**
 * Get CSS classes for status display
 * @param {string} status - Status value
 * @returns {string} - CSS classes for the status
 */
export const statusClass = (status) => {
  switch (status) {
    case 'completed':
    case 'active':
    case 'published':
      return 'bg-success/10 text-success-foreground';
    case 'pending':
      return 'bg-warning/10 text-warning-foreground';
    case 'inactive':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-info/10 text-info-foreground';
  }
};

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format numbers with locale-specific formatting
 * @param {number} num - Number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString('en-US');
};
