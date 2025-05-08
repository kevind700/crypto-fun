import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import CoinloreApiService from '../services/CoinloreApiService';
import { Ticker, GlobalData } from '../services/types';

interface CryptoContextType {
  tickers: Ticker[];
  globalData: GlobalData | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  searchCoins: (query: string) => Promise<void>;
  searchResults: Ticker[];
  selectedCoin: Ticker | null;
  setSelectedCoin: (coin: Ticker | null) => void;
  loadMore: () => Promise<void>;
  currentPage: number;
  topGainers: Ticker[];
  topLosers: Ticker[];
}

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

export const useCrypto = () => useContext(CryptoContext);

export const CryptoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Ticker[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Ticker | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [topGainers, setTopGainers] = useState<Ticker[]>([]);
  const [topLosers, setTopLosers] = useState<Ticker[]>([]);

  const coinloreService = CoinloreApiService.getInstance();

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
      
      // Calculate top gainers and losers
      const sortedByGain = [...allCoins].sort((a, b) => 
        parseFloat(b.percent_change_24h) - parseFloat(a.percent_change_24h)
      );
      setTopGainers(sortedByGain.slice(0, 10));
      setTopLosers(sortedByGain.slice(-10).reverse());
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