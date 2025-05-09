/**
 * Cryptocurrency Data Types
 *
 * This module contains type definitions for cryptocurrency data,
 * such as tickers, global market data, and exchanges.
 */

/**
 * Represents a cryptocurrency ticker from the Coinlore API
 */
export interface Ticker {
  id: string; // Unique identifier
  symbol: string; // Cryptocurrency symbol (e.g., BTC)
  name: string; // Full name of the cryptocurrency
  nameid: string; // Name identifier (lowercase, hyphenated)
  rank: number; // Market rank by market cap
  price_usd: string; // Current price in USD
  percent_change_24h: string; // Price change percentage in last 24 hours
  percent_change_1h: string; // Price change percentage in last hour
  percent_change_7d: string; // Price change percentage in last 7 days
  market_cap_usd: string; // Market capitalization in USD
  volume24: string; // 24-hour trading volume in USD
  volume24_native: string; // 24-hour trading volume in native token
  csupply: string; // Current circulating supply
  price_btc: string; // Price in BTC
  tsupply: string; // Total supply
  msupply: string; // Maximum supply
}

/**
 * Represents global cryptocurrency market data
 */
export interface GlobalData {
  coins_count: number; // Total number of active cryptocurrencies
  active_markets: number; // Number of active trading markets
  total_mcap: number; // Total market capitalization in USD
  total_volume: number; // Total 24-hour trading volume in USD
  btc_d: string; // Bitcoin dominance percentage
  eth_d: string; // Ethereum dominance percentage
  mcap_change: string; // Market cap change percentage in 24h
  volume_change: string; // Volume change percentage in 24h
  avg_change_percent: number; // Average change percentage
  volume_ath: number; // All-time high 24h volume
  mcap_ath: number; // All-time high market cap
}

/**
 * Represents a cryptocurrency exchange
 */
export interface Exchange {
  id: string; // Unique identifier
  name: string; // Exchange name
  url: string; // Exchange website URL
  country: string; // Country of registration
  date_live: string; // Launch date
  volume_usd: string; // 24-hour trading volume in USD
  active_pairs: number; // Number of active trading pairs
  pairs: string; // Trading pairs string
  confidence_score: string; // Data confidence score
  rank: number; // Exchange rank by volume
  volume_24h_adjusted?: string; // Adjusted 24-hour volume
  trades_24h?: string; // Number of trades in 24 hours
}

/**
 * Represents a market where a cryptocurrency is traded
 */
export interface CoinMarket {
  name: string; // Exchange name
  base: string; // Base currency symbol
  quote: string; // Quote currency symbol
  price: string; // Price in quote currency
  price_usd: string; // Price in USD
  volume: string; // 24-hour volume in base currency
  volume_usd: string; // 24-hour volume in USD
  time: number; // Last update timestamp
}

/**
 * Market metrics for dashboard display
 */
export interface MarketMetrics {
  totalMarketCap: number; // Total market capitalization
  totalVolume: number; // Total trading volume
  btcDominance: number; // Bitcoin market dominance
  ethDominance: number; // Ethereum market dominance
  activeMarkets: number; // Number of active markets
  totalCoins: number; // Total number of cryptocurrencies
}

/**
 * Price alert configuration
 */
export interface PriceAlert {
  coinId: string; // Cryptocurrency ID
  price: number; // Target price
  condition: "above" | "below"; // Alert condition
  active: boolean; // Whether alert is active
  createdAt: Date; // Creation timestamp
}
