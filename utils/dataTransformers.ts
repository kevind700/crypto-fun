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
 * Obtiene los primeros N tickers con mayor pérdida (menor ganancia)
 */
export const getTopLosers = (tickers: Ticker[], limit: number = LIMITS.TOP_MOVERS): Ticker[] => {
  return sortTickersByPercentChange(tickers).slice(-limit).reverse();
};

/**
 * Busca monedas que coincidan con una consulta de búsqueda
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
 * Ordena los tickers por capitalización de mercado descendente
 */
export const sortTickersByMarketCap = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort((a, b) => 
    parseFloat(b.market_cap_usd) - parseFloat(a.market_cap_usd)
  );
};

/**
 * Ordena los tickers por volumen (24h) descendente
 */
export const sortTickersByVolume = (tickers: Ticker[]): Ticker[] => {
  return [...tickers].sort((a, b) => 
    parseFloat(b.volume24) - parseFloat(a.volume24)
  );
}; 