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
  PRIMARY: "#4CAF50", // Primary brand color
  SECONDARY: "#FF5252", // Secondary/accent color
  BACKGROUND: "#f5f5f5", // Default background color
  SURFACE: "#FFFFFF", // Surface elements (cards, etc.)
  TEXT_PRIMARY: "#333333", // Primary text color
  TEXT_SECONDARY: "#666666", // Secondary/muted text color
  BORDER: "#e0e0e0", // Border color
  CARD_BACKGROUND: "#f9f9f9", // Card background color
  POSITIVE: "#4CAF50", // Positive change indicator color
  NEGATIVE: "#FF5252", // Negative change indicator color
  LOADING: "#0000ff", // Loading indicator color
  
  // UI component specific colors
  ACCENT_BLUE: "#60A5FA", // Blue accent color used in buttons and indicators
  ACCENT_BLUE_LIGHT: "rgba(96, 165, 250, 0.1)", // Light blue for backgrounds
  ACCENT_BLUE_BORDER: "rgba(96, 165, 250, 0.2)", // Light blue for borders
  DARK_BACKGROUND: "rgba(15, 23, 42, 0.5)", // Dark background for headers
  DARK_INPUT: "rgba(30, 41, 59, 0.8)", // Dark background for inputs
  TEXT_MUTED: "#94A3B8", // Muted text color
  OVERLAY_BACKGROUND: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
  DIVIDER: "rgba(0, 0, 0, 0.05)", // Color for dividers
};

/**
 * Layout constants
 * These define standard spacing and sizing values
 */
export const LAYOUT = {
  SPACING_XS: 4, // Extra small spacing
  SPACING_SM: 8, // Small spacing
  SPACING_MD: 12, // Medium spacing
  SPACING_LG: 16, // Large spacing
  SPACING_XL: 20, // Extra large spacing
  BORDER_RADIUS_SM: 4, // Small border radius
  BORDER_RADIUS_MD: 8, // Medium border radius
  BORDER_RADIUS_LG: 12, // Large border radius
};

/**
 * Typography constants
 * These define text sizes and weights across the app
 */
export const TYPOGRAPHY = {
  FONT_SIZE_XS: 12, // Extra small font size
  FONT_SIZE_SM: 14, // Small font size
  FONT_SIZE_MD: 16, // Medium font size (body text)
  FONT_SIZE_LG: 18, // Large font size
  FONT_SIZE_XL: 20, // Extra large font size
  FONT_SIZE_XXL: 24, // Double-extra large font size (headings)
  FONT_WEIGHT_REGULAR: "normal" as const, // Regular font weight
  FONT_WEIGHT_MEDIUM: "500" as const, // Medium font weight
  FONT_WEIGHT_BOLD: "bold" as const, // Bold font weight
};

/**
 * API configuration constants
 * These define API endpoints and request parameters
 */
export const API = {
  BASE_URL: "https://api.coinlore.net/api", // Base URL for API requests
  DEFAULT_LIMIT: 100, // Default number of items to request
  DEFAULT_START: 0, // Default starting index
  TIMEOUT: 30000, // Request timeout in milliseconds (30s)
};

/**
 * Application limits
 * These define various limits used in the app's functionality
 */
export const LIMITS = {
  TOP_MOVERS: 10, // Number of top movers to display
  SEARCH_RESULTS_MIN: 5, // Minimum number of search results
  DEFAULT_PAGE_SIZE: 50, // Default number of items per page
  PAGE_SIZE: 10, // Number of items per page for pagination
};

/**
 * UI Component constants
 * These define values used for UI components
 */
export const UI = {
  SEARCH_BAR_HEIGHT: 44, // Height for search bars
  INDICATOR_SIZE_SMALL: "small" as const, // Small indicator size
  INDICATOR_SIZE_LARGE: "large" as const, // Large indicator size
  END_REACHED_THRESHOLD: 0.5, // FlatList end reached threshold
  PAGINATION_BUTTON_HEIGHT: 36, // Height of pagination buttons
  PAGINATION_BUTTON_MIN_WIDTH: 100, // Min width of pagination buttons
  ANIMATION_DURATION: 400, // Default animation duration
  ICON_SIZES: {
    TINY: 14,
    SMALL: 16,
    MEDIUM: 20,
    LARGE: 24,
    XLARGE: 48
  }
};
