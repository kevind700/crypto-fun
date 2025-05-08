/**
 * Formatters Utility Module
 * 
 * This module provides helper functions for formatting values 
 * consistently throughout the application, particularly for:
 * - Cryptocurrency prices
 * - Large numbers
 * - Percentage changes
 * - Color coding for positive/negative changes
 */

import { COLORS } from '../constants';

/**
 * Formats a cryptocurrency price with appropriate decimal places
 * For smaller values, more decimal places are shown (up to 8)
 * @param {string} priceUsd - The price value as a string
 * @returns {string} Formatted price string
 */
export const formatPrice = (priceUsd: string): string => {
  return parseFloat(priceUsd).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
};

/**
 * Formats large numbers with locale-specific formatting (commas, decimals)
 * @param {number|string} value - The number to format
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? Number(value) : value;
  return num.toLocaleString();
};

/**
 * Formats a percentage change with a plus or minus sign
 * @param {string} percentChange - The percentage change value
 * @returns {string} Formatted percentage string with sign and % symbol
 */
export const formatPercentChange = (percentChange: string): string => {
  const isPositive = parseFloat(percentChange) >= 0;
  return `${isPositive ? '+' : ''}${percentChange}%`;
};

/**
 * Gets the appropriate color for displaying a percentage change
 * @param {string} percentChange - The percentage change value
 * @returns {string} Color code for the value (green for positive, red for negative)
 */
export const getChangeColor = (percentChange: string): string => {
  return parseFloat(percentChange) >= 0 ? COLORS.POSITIVE : COLORS.NEGATIVE;
};