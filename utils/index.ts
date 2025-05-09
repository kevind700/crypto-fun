/**
 * Utils Module
 * 
 * This module unifies all utility functions in the project into a single entry point.
 * Includes functions for:
 * - Cryptocurrency data transformation
 * - Monetary and percentage value formatting
 * - Visual presentation utilities
 */

// Export all data transformation utilities
export {
  getTopGainers,
  getTopLosers,
  searchCoins,
  sortTickersByMarketCap, sortTickersByPercentChange, sortTickersByVolume
} from './dataTransformers';

// Export all formatting utilities
export {
  formatLargeNumber,
  formatPercentChange, formatPrice, getChangeColor
} from './formatters';

import { COLORS } from '../constants';

// Additional formatting functions (migrated from app/(tabs)/utils/formatters.ts)

/**
 * Formats a numeric value with appropriate suffix and dollar sign
 * Converts large numbers to more readable format with T (trillion),
 * B (billion), M (million), or K (thousand) suffixes
 *
 * @param {number|string} value - The value to format
 * @returns {string} Formatted value with dollar sign and appropriate suffix
 */
export const formatValue = (value: number | string): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;

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
export const getChangeBackgroundColor = (
  percentChange: string | number,
): string => {
  const change =
    typeof percentChange === "string"
      ? parseFloat(percentChange)
      : percentChange;
  return change >= 0 ? COLORS.POSITIVE_BACKGROUND : COLORS.NEGATIVE_BACKGROUND;
};

/**
 * Gets the border color for a percentage change element
 * Returns semi-transparent green for positive values and red for negative
 * With higher opacity than background color for visual distinction
 *
 * @param {string|number} percentChange - The percentage change value
 * @returns {string} RGBA color string for border
 */
export const getChangeBorderColor = (
  percentChange: string | number,
): string => {
  const change =
    typeof percentChange === "string"
      ? parseFloat(percentChange)
      : percentChange;
  return change >= 0 ? COLORS.POSITIVE_BORDER : COLORS.NEGATIVE_BORDER;
};
