import { LIMITS } from '../constants';
import { Ticker } from '../services/types';

/**
 * Ordena los tickers por ganancia porcentual (24h) descendente
 */
export const sortTickersByPercentChange = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort((a, b) => 
    parseFloat(b.percent_change_24h) - parseFloat(a.percent_change_24h)
  );
};

/**
 * Obtiene los primeros N tickers con mayor ganancia
 */
export const getTopGainers = (tickers: Ticker[], limit: number = LIMITS.TOP_MOVERS): Ticker[] => {
  return sortTickersByPercentChange(tickers).slice(0, limit);
};

/**
 * Gets the top N tickers with the highest loss (lowest gain)
 */
export const getTopLosers = (tickers: Ticker[], limit: number = LIMITS.TOP_MOVERS): Ticker[] => {
  return sortTickersByPercentChange(tickers).slice(-limit).reverse();
};

/**
 * Searches for coins that match a search query
 */
export const searchCoins = (coins: Ticker[], query: string): Ticker[] => {
  const searchQuery = query.toLowerCase().trim();
  if (!searchQuery) return [];
  
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery) ||
      coin.symbol.toLowerCase().includes(searchQuery) ||
      coin.nameid.toLowerCase().includes(searchQuery)
  );
};

/**
 * Sorts tickers by market cap in descending order
 */
export const sortTickersByMarketCap = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort((a, b) => 
    parseFloat(b.market_cap_usd) - parseFloat(a.market_cap_usd)
  );
};

/**
 * Sorts tickers by volume (24h) in descending order
 */
export const sortTickersByVolume = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort((a, b) => 
    parseFloat(b.volume24) - parseFloat(a.volume24)
  );
}; 