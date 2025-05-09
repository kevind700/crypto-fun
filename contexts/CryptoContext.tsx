/**
 * Crypto Context Provider
 *
 * This module creates a React context for managing cryptocurrency data across the application.
 * It provides:
 * - Cryptocurrency data fetching and caching
 * - Market stats and global data
 * - Search functionality
 * - Top gainers and losers tracking
 * - Infinite scrolling capabilities
 *
 * The context follows best practices for React Context API usage and state management.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { GlobalData, Ticker } from "../models/types/crypto";
import CoinloreApiService from "../services/CoinloreApiService";
import {
  searchCoins as filterCoins,
  getTopGainers,
  getTopLosers,
} from "../utils/dataTransformers";

/**
 * CryptoContextType interface defines the shape of the context data
 * @interface CryptoContextType
 */
interface CryptoContextType {
  tickers: Ticker[]; // List of all cryptocurrency tickers
  globalData: GlobalData | null; // Global market data
  isLoading: boolean; // Loading state indicator
  error: string | null; // Error message if any
  refreshData: () => Promise<void>; // Function to refresh all data
  searchCoins: (query: string) => Promise<void>; // Function to search for coins
  searchResults: Ticker[]; // Search results
  selectedCoin: Ticker | null; // Currently selected coin
  setSelectedCoin: (coin: Ticker | null) => void; // Function to set selected coin
  loadMore: () => Promise<void>; // Function to load more tickers (pagination)
  currentPage: number; // Current page for pagination
  topGainers: Ticker[]; // List of top gaining coins
  topLosers: Ticker[]; // List of top losing coins
}

/**
 * Create the context with default values
 */
const CryptoContext = createContext<CryptoContextType>({
  tickers: [],
  globalData: null,
  isLoading: false,
  error: null,
  refreshData: async () => {},
  searchCoins: async () => {},
  searchResults: [],
  selectedCoin: null,
  setSelectedCoin: () => {},
  loadMore: async () => {},
  currentPage: 0,
  topGainers: [],
  topLosers: [],
});

/**
 * Custom hook to use the crypto context
 * @returns {CryptoContextType} The crypto context
 */
export const useCrypto = () => useContext(CryptoContext);

/**
 * CryptoProvider component provides cryptocurrency data to the app
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State for cryptocurrency tickers and related data
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Ticker[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Ticker | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [topGainers, setTopGainers] = useState<Ticker[]>([]);
  const [topLosers, setTopLosers] = useState<Ticker[]>([]);

  // Get singleton instance of the API service
  const coinloreService = CoinloreApiService.getInstance();

  /**
   * Refresh all cryptocurrency data
   * Fetches tickers and global market data in parallel
   */
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tickersResponse, globalDataResponse] = await Promise.all([
        coinloreService.getTickers({ start: 0, limit: 100 }),
        coinloreService.getGlobalData(),
      ]);

      const allCoins = tickersResponse.data;
      setTickers(allCoins);
      setGlobalData(globalDataResponse[0]);
      setCurrentPage(0);

      // Calculate top gainers and losers from the fetched data
      setTopGainers(getTopGainers(allCoins, 10));
      setTopLosers(getTopLosers(allCoins, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data");
    } finally {
      setIsLoading(false);
    }
  }, [coinloreService]);

  /**
   * Load more cryptocurrencies for infinite scrolling
   * This function loads the next page of results
   */
  const loadMore = useCallback(async () => {
    if (isLoading) return;

    const nextPage = currentPage + 1;
    setIsLoading(true);
    try {
      const { data } = await coinloreService.getTickers({
        start: nextPage * 50,
        limit: 50,
      });
      setTickers((prev) => [...prev, ...data]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading more data");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, coinloreService]);

  /**
   * Search for cryptocurrencies by name, symbol or ID
   * First searches in locally cached data, then falls back to API if needed
   * @param {string} query - Search query string
   */
  const searchCoins = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Use our utility to search in already loaded data
        const results = filterCoins(tickers, query);

        // If there aren't enough local results, search the API
        if (results.length < 5) {
          const apiResults = await coinloreService.searchCoins(query);
          setSearchResults(apiResults);
        } else {
          setSearchResults(results);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error when searching");
      } finally {
        setIsLoading(false);
      }
    },
    [coinloreService, tickers],
  );

  /**
   * Initial data loading when component mounts
   */
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Provide the context value to children components
   */
  return (
    <CryptoContext.Provider
      value={{
        tickers,
        globalData,
        isLoading,
        error,
        refreshData,
        searchCoins,
        searchResults,
        selectedCoin,
        setSelectedCoin,
        loadMore,
        currentPage,
        topGainers,
        topLosers,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};
