/**
 * Global Constants Module
 * 
 * This module defines global constants used throughout the application.
 * These constants help maintain consistency in styling, API configuration,
 * and app behavior.
 * 
 * Following Expo and React Native best practices, we organize constants
 * into logical groups based on their purpose.
 */

/**
 * Color palette constants
 * These colors are used for various UI elements throughout the app
 */
export const COLORS = {
  PRIMARY: '#4CAF50',       // Primary brand color
  SECONDARY: '#FF5252',     // Secondary/accent color
  BACKGROUND: '#f5f5f5',    // Default background color
  SURFACE: '#FFFFFF',       // Surface elements (cards, etc.)
  TEXT_PRIMARY: '#333333',  // Primary text color
  TEXT_SECONDARY: '#666666',// Secondary/muted text color
  BORDER: '#e0e0e0',        // Border color
  CARD_BACKGROUND: '#f9f9f9',// Card background color
  POSITIVE: '#4CAF50',      // Positive change indicator color
  NEGATIVE: '#FF5252',      // Negative change indicator color
  LOADING: '#0000ff',       // Loading indicator color
};

/**
 * Layout constants
 * These define standard spacing and sizing values
 */
export const LAYOUT = {
  SPACING_XS: 4,            // Extra small spacing
  SPACING_SM: 8,            // Small spacing
  SPACING_MD: 12,           // Medium spacing
  SPACING_LG: 16,           // Large spacing
  SPACING_XL: 20,           // Extra large spacing
  BORDER_RADIUS_SM: 4,      // Small border radius
  BORDER_RADIUS_MD: 8,      // Medium border radius
  BORDER_RADIUS_LG: 12,     // Large border radius
};

/**
 * Typography constants
 * These define text sizes and weights across the app
 */
export const TYPOGRAPHY = {
  FONT_SIZE_XS: 12,         // Extra small font size
  FONT_SIZE_SM: 14,         // Small font size
  FONT_SIZE_MD: 16,         // Medium font size (body text)
  FONT_SIZE_LG: 18,         // Large font size
  FONT_SIZE_XL: 20,         // Extra large font size
  FONT_SIZE_XXL: 24,        // Double-extra large font size (headings)
  FONT_WEIGHT_REGULAR: 'normal' as const, // Regular font weight
  FONT_WEIGHT_MEDIUM: '500' as const,     // Medium font weight
  FONT_WEIGHT_BOLD: 'bold' as const,      // Bold font weight
};

/**
 * API configuration constants
 * These define API endpoints and request parameters
 */
export const API = {
  BASE_URL: 'https://api.coinlore.net/api', // Base URL for API requests
  DEFAULT_LIMIT: 100,       // Default number of items to request
  DEFAULT_START: 0,         // Default starting index
  TIMEOUT: 30000,           // Request timeout in milliseconds (30s)
};

/**
 * Application limits
 * These define various limits used in the app's functionality
 */
export const LIMITS = {
  TOP_MOVERS: 10,           // Number of top movers to display
  SEARCH_RESULTS_MIN: 5,    // Minimum number of search results
  DEFAULT_PAGE_SIZE: 50,    // Default number of items per page
}; 