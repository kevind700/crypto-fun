/**
 * API and Application Type Definitions
 * 
 * This module contains TypeScript interface definitions for:
 * - API responses from the Coinlore API
 * - API request parameters
 * - UI state types
 * - Chart data structures
 * - Application-specific types
 * 
 * These type definitions ensure proper type checking and IntelliSense
 * throughout the application.
 */

/**
 * Represents a cryptocurrency ticker from the Coinlore API
 * @interface Ticker
 */
export interface Ticker {
  id: string;                     // Unique identifier
  symbol: string;                 // Cryptocurrency symbol (e.g., BTC)
  name: string;                   // Full name of the cryptocurrency
  nameid: string;                 // Name identifier (lowercase, hyphenated)
  rank: number;                   // Market rank by market cap
  price_usd: string;              // Current price in USD
  percent_change_24h: string;     // Price change percentage in last 24 hours
  percent_change_1h: string;      // Price change percentage in last hour
  percent_change_7d: string;      // Price change percentage in last 7 days
  market_cap_usd: string;         // Market capitalization in USD
  volume24: string;               // 24-hour trading volume in USD
  volume24_native: string;        // 24-hour trading volume in native token
  csupply: string;                // Current circulating supply
  price_btc: string;              // Price in BTC
  tsupply: string;                // Total supply
  msupply: string;                // Maximum supply
}

/**
 * Represents global cryptocurrency market data
 * @interface GlobalData
 */
export interface GlobalData {
  coins_count: number;            // Total number of active cryptocurrencies
  active_markets: number;         // Number of active trading markets
  total_mcap: number;             // Total market capitalization in USD
  total_volume: number;           // Total 24-hour trading volume in USD
  btc_d: string;                  // Bitcoin dominance percentage
  eth_d: string;                  // Ethereum dominance percentage
  mcap_change: string;            // Market cap change percentage in 24h
  volume_change: string;          // Volume change percentage in 24h
  avg_change_percent: number;     // Average price change percentage
  volume_ath: number;             // All-time high 24h volume
  mcap_ath: number;               // All-time high market cap
}

/**
 * Represents a cryptocurrency exchange
 * @interface Exchange
 */
export interface Exchange {
  id: string;                     // Unique identifier
  name: string;                   // Exchange name
  url: string;                    // Exchange website URL
  country: string;                // Country of registration
  date_live: string;              // Launch date
  volume_usd: string;             // 24-hour trading volume in USD
  active_pairs: number;           // Number of active trading pairs
  pairs: string;                  // Trading pairs string
  confidence_score: string;       // Data confidence score
  rank: number;                   // Exchange rank by volume
  volume_24h_adjusted?: string;   // Adjusted 24-hour volume
  trades_24h?: string;            // Number of trades in 24 hours
}

/**
 * Represents a market where a cryptocurrency is traded
 * @interface CoinMarket
 */
export interface CoinMarket {
  name: string;                   // Exchange name
  base: string;                   // Base currency symbol
  quote: string;                  // Quote currency symbol
  price: string;                  // Price in quote currency
  price_usd: string;              // Price in USD
  volume: string;                 // 24-hour volume in base currency
  volume_usd: string;             // 24-hour volume in USD
  time: number;                   // Last update timestamp
}

/**
 * Represents social media statistics for a cryptocurrency
 * @interface SocialStats
 */
export interface SocialStats {
  name: string;                   // Cryptocurrency name
  symbol: string;                 // Cryptocurrency symbol
  reddit: {                       // Reddit statistics
    subscribers: number;          // Number of subreddit subscribers
    active_users: number;         // Number of active users
    posts_per_day: number;        // Average posts per day
    comments_per_day: number;     // Average comments per day
    posts_per_hour: number;       // Average posts per hour
    comments_per_hour: number;    // Average comments per hour
  };
  twitter: {                      // Twitter statistics
    followers: number;            // Number of followers
    status_count: number;         // Number of tweets
    favorites: number;            // Number of favorites
    lists: number;                // Number of lists
    following: number;            // Number of accounts followed
    name: string;                 // Twitter handle
    link: string;                 // Twitter profile URL
  };
  github: {                       // GitHub statistics
    closed_issues: number;        // Number of closed issues
    open_pull_issues: number;     // Number of open pull requests
    closed_pull_issues: number;   // Number of closed pull requests
    forks: number;                // Number of repository forks
    stars: number;                // Number of repository stars
    subscribers: number;          // Number of repository watchers
    open_issues: number;          // Number of open issues
    last_update: string;          // Last update timestamp
  };
}

/**
 * API Parameters Types
 */

/**
 * Parameters for fetching multiple tickers
 * @interface TickersParams
 */
export interface TickersParams {
  start?: number;                 // Starting index for pagination
  limit?: number;                 // Maximum number of results
}

/**
 * Parameters for fetching a specific ticker
 * @interface TickerParams
 */
export interface TickerParams {
  id: string | number;            // Cryptocurrency ID
}

/**
 * Parameters for fetching exchanges
 * @interface ExchangesParams
 */
export interface ExchangesParams {
  start?: number;                 // Starting index for pagination
  limit?: number;                 // Maximum number of results
}

/**
 * UI State Types
 */

/**
 * Application UI state
 * @interface UIState
 */
export interface UIState {
  isLoading: boolean;             // Whether data is currently loading
  error: string | null;           // Error message if any
  selectedCoin: Ticker | null;    // Currently selected cryptocurrency
  selectedExchange: Exchange | null; // Currently selected exchange
  searchQuery: string;            // Current search query
  refreshing: boolean;            // Whether UI is refreshing
}

/**
 * Chart Data Types
 */

/**
 * Data structure for charts
 * @interface ChartData
 */
export interface ChartData {
  labels: string[];               // X-axis labels
  datasets: {                     // Chart datasets
    data: number[];               // Y-axis data points
    color?: (opacity?: number) => string; // Color function
    strokeWidth?: number;         // Line width
  }[];
}

/**
 * Market metrics for dashboard
 * @interface MarketMetrics
 */
export interface MarketMetrics {
  totalMarketCap: number;         // Total market capitalization
  totalVolume: number;            // Total trading volume
  btcDominance: number;           // Bitcoin market dominance
  ethDominance: number;           // Ethereum market dominance
  activeMarkets: number;          // Number of active markets
  totalCoins: number;             // Total number of cryptocurrencies
}

/**
 * Price alert configuration
 * @interface PriceAlert
 */
export interface PriceAlert {
  coinId: string;                 // Cryptocurrency ID
  price: number;                  // Target price
  condition: 'above' | 'below';   // Alert condition
  active: boolean;                // Whether alert is active
  createdAt: Date;                // Creation timestamp
}