/**
 * CoinloreApiService
 *
 * This service provides methods to interact with the Coinlore cryptocurrency API.
 * It follows the singleton pattern to ensure only one instance is used throughout the app.
 *
 * The service extends BaseApiService which handles the HTTP requests and error handling.
 * It includes methods for fetching cryptocurrency data, market information, and social stats.
 */

import {
    CoinMarketsParams,
    ExchangesParams,
    TickersParams,
} from "@/models/types/api";
import {
    CoinMarket,
    Exchange,
    GlobalData,
    Ticker,
} from "@/models/types/crypto";
import {
    getTopGainers,
    getTopLosers,
    searchCoins,
    sortTickersByMarketCap,
    sortTickersByVolume,
} from "@/utils";
import BaseApiService from "./BaseApiService";

/**
 * CoinloreApiService provides access to the Coinlore cryptocurrency API
 * @extends BaseApiService
 */
class CoinloreApiService extends BaseApiService {
  /** Base API URL for Coinlore */
  private static API_URL = "https://api.coinlore.net/api";

  /** Singleton instance */
  protected static instance: CoinloreApiService;

  /**
   * Private constructor to enforce singleton pattern
   * Initializes the base service with the Coinlore API URL
   */
  private constructor() {
    super(CoinloreApiService.API_URL);
  }

  /**
   * Gets or creates the singleton instance of the service
   * @returns {CoinloreApiService} The singleton instance
   */
  public static getInstance(): CoinloreApiService {
    if (!CoinloreApiService.instance) {
      CoinloreApiService.instance = new CoinloreApiService();
    }
    return CoinloreApiService.instance;
  }

  /**
   * Fetches a paginated list of cryptocurrency tickers
   * @param {TickersParams} params - Optional pagination parameters
   * @returns {Promise<{data: Ticker[]}>} Promise resolving to ticker data
   */
  async getTickers(params: TickersParams = {}): Promise<{ data: Ticker[] }> {
    const defaultParams: TickersParams = {
      start: 0,
      limit: 100,
    };
    return this.get<{ data: Ticker[] }>("/tickers/", {
      params: { ...defaultParams, ...params },
    });
  }

  /**
   * Fetches a specific cryptocurrency ticker by ID
   * @param {string|number} id - The ID of the cryptocurrency
   * @returns {Promise<Ticker[]>} Promise resolving to the ticker data
   */
  async getTicker(id: string | number): Promise<Ticker[]> {
    return this.get<Ticker[]>("/ticker/", {
      params: { id },
    });
  }

  /**
   * Fetches multiple cryptocurrency tickers by their IDs
   * @param {(string|number)[]} ids - Array of cryptocurrency IDs
   * @returns {Promise<Ticker[]>} Promise resolving to an array of ticker data
   */
  async getTickersByIds(ids: (string | number)[]): Promise<Ticker[]> {
    return this.get<Ticker[]>("/ticker/", {
      params: { id: ids.join(",") },
    });
  }

  /**
   * Fetches global cryptocurrency market data
   * @returns {Promise<GlobalData[]>} Promise resolving to global market data
   */
  async getGlobalData(): Promise<GlobalData[]> {
    return this.get<GlobalData[]>("/global/");
  }

  /**
   * Fetches a paginated list of cryptocurrency exchanges
   * @param {ExchangesParams} params - Optional pagination parameters
   * @returns {Promise<Exchange[]>} Promise resolving to exchange data
   */
  async getExchanges(params: ExchangesParams = {}): Promise<Exchange[]> {
    const defaultParams: ExchangesParams = {
      start: 0,
      limit: 100,
    };
    return this.get<Exchange[]>("/exchanges/", {
      params: { ...defaultParams, ...params },
    });
  }

  /**
   * Fetches a specific exchange by name
   * @param {string} name - The name of the exchange
   * @returns {Promise<Exchange[]>} Promise resolving to the exchange data
   */
  async getExchange(name: string): Promise<Exchange[]> {
    return this.get<Exchange[]>(`/exchange/${name}`);
  }

  /**
   * Fetches markets where a specific cryptocurrency is traded
   * @param {string|number} coinId - The ID of the cryptocurrency
   * @returns {Promise<CoinMarket[]>} Promise resolving to market data
   */
  async getCoinMarkets(coinId: string | number): Promise<CoinMarket[]> {
    const params: CoinMarketsParams = { id: coinId };
    return this.get<CoinMarket[]>(`/coin/markets/`, {
      params,
    });
  }

  /**
   * Searches for cryptocurrencies by name, symbol, or ID
   * @param {string} query - The search query
   * @returns {Promise<Ticker[]>} Promise resolving to matching cryptocurrencies
   */
  async searchCoins(query: string): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 2000 });
    return searchCoins(data, query);
  }

  /**
   * Fetches cryptocurrencies with the highest 24h gains
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Ticker[]>} Promise resolving to top gaining cryptocurrencies
   */
  async getTopGainers(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return getTopGainers(data, limit);
  }

  /**
   * Fetches cryptocurrencies with the highest 24h losses
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Ticker[]>} Promise resolving to top losing cryptocurrencies
   */
  async getTopLosers(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return getTopLosers(data, limit);
  }

  /**
   * Fetches cryptocurrencies with the highest 24h trading volume
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Ticker[]>} Promise resolving to high volume cryptocurrencies
   */
  async getTopByVolume(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return sortTickersByVolume(data).slice(0, limit);
  }

  /**
   * Fetches cryptocurrencies with the highest market capitalization
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Ticker[]>} Promise resolving to high market cap cryptocurrencies
   */
  async getTopByMarketCap(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return sortTickersByMarketCap(data).slice(0, limit);
  }
}

export default CoinloreApiService;
