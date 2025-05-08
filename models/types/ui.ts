/**
 * UI State Types
 * 
 * This module contains type definitions for user interface states
 * and visual components.
 */

import { Exchange, Ticker } from './crypto';

/**
 * Application user interface state
 */
export interface UIState {
  isLoading: boolean;             // Whether data is loading
  error: string | null;           // Error message, if any
  selectedCoin: Ticker | null;    // Currently selected cryptocurrency
  selectedExchange: Exchange | null; // Currently selected exchange
  searchQuery: string;            // Current search query
  refreshing: boolean;            // Whether UI is refreshing
}

/**
 * Properties for loading components
 */
export interface LoadingProps {
  size?: 'small' | 'large';       // Size of loading indicator
  color?: string;                 // Color of loading indicator
  text?: string;                  // Optional text to display
}

/**
 * Properties for error components
 */
export interface ErrorProps {
  message: string;                // Error message to display
  onRetry?: () => void;           // Function to retry the action
}

/**
 * Application theme state
 */
export interface ThemeState {
  isDark: boolean;                // Whether dark theme is active
  colors: {                       // Theme colors
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

/**
 * Options for UI filters
 */
export interface FilterOptions {
  sortBy: 'rank' | 'name' | 'price' | 'change'; // Field to sort by
  order: 'asc' | 'desc';          // Ascending or descending order
  filter: string;                 // Text filter
  timeRange: '1h' | '24h' | '7d'; // Time range for percentage changes
}

/**
 * Navigation state
 */
export interface NavigationState {
  currentRoute: string;           // Current route
  previousRoute: string | null;   // Previous route
  params: Record<string, any>;    // Route parameters
} 