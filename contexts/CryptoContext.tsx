import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import CoinloreApiService from '../services/CoinloreApiService';
import { Ticker, GlobalData, Exchange } from '../services/types';

interface CryptoContextType {
  tickers: Ticker[];
  globalData: GlobalData | null;
  exchanges: Exchange[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  searchCoins: (query: string) => Promise<void>;
  searchResults: Ticker[];
  selectedCoin: Ticker | null;
  setSelectedCoin: (coin: Ticker | null) => void;
  loadMore: () => Promise<void>;
  currentPage: number;
}

const CryptoContext = createContext<CryptoContextType>({
  tickers: [],
  globalData: null,
  exchanges: [],
  isLoading: false,
  error: null,
  refreshData: async () => {},
  searchCoins: async () => {},
  searchResults: [],
  selectedCoin: null,
  setSelectedCoin: () => {},
  loadMore: async () => {},
  currentPage: 0,
});

export const useCrypto = () => useContext(CryptoContext);

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Ticker[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Ticker | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const coinloreService = CoinloreApiService.getInstance();

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tickersResponse, globalDataResponse, exchangesResponse] = await Promise.all([
        coinloreService.getTickers({ start: 0, limit: 50 }),
        coinloreService.getGlobalData(),
        coinloreService.getExchanges({ start: 0, limit: 50 }),
      ]);

      setTickers(tickersResponse.data);
      setGlobalData(globalDataResponse[0]);
      setExchanges(exchangesResponse);
      setCurrentPage(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [coinloreService]);

  const loadMore = useCallback(async () => {
    if (isLoading) return;

    const nextPage = currentPage + 1;
    setIsLoading(true);
    try {
      const { data } = await coinloreService.getTickers({
        start: nextPage * 50,
        limit: 50,
      });
      setTickers(prev => [...prev, ...data]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading more data');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, coinloreService]);

  const searchCoins = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await coinloreService.searchCoins(query);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
    } finally {
      setIsLoading(false);
    }
  }, [coinloreService]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <CryptoContext.Provider
      value={{
        tickers,
        globalData,
        exchanges,
        isLoading,
        error,
        refreshData,
        searchCoins,
        searchResults,
        selectedCoin,
        setSelectedCoin,
        loadMore,
        currentPage,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};