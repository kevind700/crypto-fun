/**
 * Tab-specific Formatters Utility Module
 * 
 * This module provides helper functions for formatting values
 * specifically for the tab screens of the application.
 * It includes functions for:
 * - Formatting large numbers with appropriate suffixes (T, B, M, K)
 * - Formatting trading volume
 * - Determining colors and backgrounds for price changes
 */

/**
 * Formats a numeric value with appropriate suffix and dollar sign
 * Converts large numbers to more readable format with T (trillion),
 * B (billion), M (million), or K (thousand) suffixes
 * 
 * @param {number|string} value - The value to format
 * @returns {string} Formatted value with dollar sign and appropriate suffix
 */
export const formatValue = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  
  return `$${num.toLocaleString()}`;
};

/**
 * Formats trading volume with appropriate suffix
 * Wrapper around formatValue specifically for volume data
 * 
 * @param {string} volume - Volume value as string
 * @returns {string} Formatted volume with dollar sign and appropriate suffix
 */
export const formatVolume = (volume: string): string => {
  return formatValue(parseFloat(volume));
};

/**
 * Gets the background color for a percentage change element
 * Returns semi-transparent green for positive values and red for negative
 * 
 * @param {string|number} percentChange - The percentage change value
 * @returns {string} RGBA color string for background
 */
export const getChangeBackgroundColor = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';
};

/**
 * Gets the border color for a percentage change element
 * Returns semi-transparent green for positive values and red for negative
 * With higher opacity than background color for visual distinction
 * 
 * @param {string|number} percentChange - The percentage change value
 * @returns {string} RGBA color string for border
 */
export const getChangeBorderColor = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return change >= 0 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
};

/**
 * Gets the text color for a percentage change
 * Returns solid green for positive values and red for negative
 * 
 * @param {string|number} percentChange - The percentage change value
 * @returns {string} Hex color code for text
 */
export const getChangeColor = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return change >= 0 ? '#22c55e' : '#ef4444';
};

/**
 * Formats a percentage change with a plus or minus sign
 * Ensures positive numbers show a plus sign prefix
 * 
 * @param {string|number} percentChange - The percentage change value
 * @returns {string} Formatted percentage string with sign and % symbol
 */
export const formatPercentChange = (percentChange: string | number): string => {
  const change = typeof percentChange === 'string' ? parseFloat(percentChange) : percentChange;
  return `${change >= 0 ? '+' : ''}${change}%`;
}; 