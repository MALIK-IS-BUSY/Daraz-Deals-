/**
 * Format a price with currency symbol
 * @param price - The price to format
 * @param currency - The currency code (default: "Rs")
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = "Rs"): string => {
  return `${currency} ${price.toLocaleString('en-PK')}`;
};

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Truncate a string to a specific length and add ellipsis
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Generate a slug from a string
 * @param str - The string to slugify
 * @returns A URL-friendly slug
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}; 