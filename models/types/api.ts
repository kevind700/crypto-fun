/**
 * API Parameters Types
 * 
 * This module contains type definitions for parameters
 * used in external API calls.
 */

/**
 * Parameters for fetching multiple tickers
 */
export interface TickersParams {
  start?: number;                 // Starting index for pagination
  limit?: number;                 // Maximum number of results
}

/**
 * Parameters for fetching a specific ticker
 */
export interface TickerParams {
  id: string | number;            // Cryptocurrency ID
}

/**
 * Parameters for fetching exchanges
 */
export interface ExchangesParams {
  start?: number;                 // Starting index for pagination
  limit?: number;                 // Maximum number of results
}

/**
 * Parameters for fetching markets of a cryptocurrency
 */
export interface CoinMarketsParams {
  id: string | number;            // Cryptocurrency ID
}

/**
 * Parameters for fetching social statistics
 */
export interface SocialStatsParams {
  id: string | number;            // Cryptocurrency ID
}

/**
 * General options for HTTP requests
 */
export interface RequestOptions {
  headers?: Record<string, string>;  // Custom HTTP headers
  timeout?: number;                  // Maximum wait time in ms
  cache?: boolean;                   // Whether to use cache
} 