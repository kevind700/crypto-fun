/**
 * Data Transformers Module
 *
 * This module contains utility functions for transforming cryptocurrency data.
 * It provides functionality for:
 * - Sorting cryptocurrencies by various metrics
 * - Filtering top gainers and losers
 * - Searching for cryptocurrencies by name, symbol, or ID
 *
 * These utilities help in presenting data in different ways throughout the app.
 */

import { LIMITS } from "../constants";
import { Ticker } from "../models/types/crypto";

/**
 * Sorts cryptocurrency tickers by 24-hour percentage change in descending order
 * This is used to identify the biggest gainers and losers
 *
 * @param {Ticker[]} tickers - Array of cryptocurrency tickers to sort
 * @returns {Ticker[]} A new sorted array (original array remains unchanged)
 */
export const sortTickersByPercentChange = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort(
    (a, b) =>
      parseFloat(b.percent_change_24h) - parseFloat(a.percent_change_24h),
  );
};

/**
 * Gets the top N tickers with the highest gain in the last 24 hours
 *
 * @param {Ticker[]} tickers - Array of cryptocurrency tickers
 * @param {number} limit - Maximum number of tickers to return (defaults to value in constants)
 * @returns {Ticker[]} Array of top gaining cryptocurrencies
 */
export const getTopGainers = (
  tickers: Ticker[],
  limit: number = LIMITS.TOP_MOVERS,
): Ticker[] => {
  return sortTickersByPercentChange(tickers).slice(0, limit);
};

/**
 * Gets the top N tickers with the highest loss (lowest gain) in the last 24 hours
 *
 * @param {Ticker[]} tickers - Array of cryptocurrency tickers
 * @param {number} limit - Maximum number of tickers to return (defaults to value in constants)
 * @returns {Ticker[]} Array of top losing cryptocurrencies
 */
export const getTopLosers = (
  tickers: Ticker[],
  limit: number = LIMITS.TOP_MOVERS,
): Ticker[] => {
  return sortTickersByPercentChange(tickers).slice(-limit).reverse();
};

/**
 * Searches for coins that match a search query string
 * The search is performed case-insensitive on name, symbol, and nameid fields
 *
 * @param {Ticker[]} coins - Array of cryptocurrency tickers to search in
 * @param {string} query - Search query string
 * @returns {Ticker[]} Array of matching cryptocurrencies
 */
export const searchCoins = (coins: Ticker[], query: string): Ticker[] => {
  const searchQuery = query.toLowerCase().trim();
  if (!searchQuery) return [];

  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery) ||
      coin.symbol.toLowerCase().includes(searchQuery) ||
      coin.nameid.toLowerCase().includes(searchQuery),
  );
};

/**
 * Sorts tickers by market capitalization in descending order
 * Used for displaying cryptocurrencies ordered by their market size
 *
 * @param {Ticker[]} tickers - Array of cryptocurrency tickers to sort
 * @returns {Ticker[]} A new sorted array (original array remains unchanged)
 */
export const sortTickersByMarketCap = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort(
    (a, b) => parseFloat(b.market_cap_usd) - parseFloat(a.market_cap_usd),
  );
};

/**
 * Sorts tickers by 24-hour trading volume in descending order
 * Used for displaying cryptocurrencies ordered by their trading activity
 *
 * @param {Ticker[]} tickers - Array of cryptocurrency tickers to sort
 * @returns {Ticker[]} A new sorted array (original array remains unchanged)
 */
export const sortTickersByVolume = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort(
    (a, b) => parseFloat(b.volume24) - parseFloat(a.volume24),
  );
};
