import axios from 'axios';
import { CoinMarket, Exchange, GlobalData, SocialStats } from '../../models/types/crypto';
import CoinloreApiService from '../../services/CoinloreApiService';

jest.mock('axios', () => {
  const mockAxios: any = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
  };
  return mockAxios;
});

describe('CoinloreApiService', () => {
  let service: CoinloreApiService;
  let mockAxios: jest.Mocked<typeof axios>;

  const resetMock = () => {
    (axios.get as jest.Mock).mockReset();
    (axios.post as jest.Mock).mockReset();
  };

  beforeEach(() => {
    resetMock();
    service = CoinloreApiService.getInstance();
    mockAxios = axios as jest.Mocked<typeof axios>;
  });

  describe('Singleton pattern', () => {
    it('getInstance should always return the same instance', () => {
      const instance1 = CoinloreApiService.getInstance();
      const instance2 = CoinloreApiService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getTickers', () => {
    it('should fetch tickers with default parameters', async () => {
      const mockResponse = {
        data: [
          { id: '1', name: 'Bitcoin', symbol: 'BTC' },
          { id: '2', name: 'Ethereum', symbol: 'ETH' },
        ],
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getTickers();
      expect(axios.get).toHaveBeenCalledWith('/tickers/', {
        params: { start: 0, limit: 100 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch tickers with custom parameters', async () => {
      const mockResponse = {
        data: [
          { id: '3', name: 'Ripple', symbol: 'XRP' },
          { id: '4', name: 'Litecoin', symbol: 'LTC' },
        ],
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getTickers({ start: 10, limit: 20 });
      expect(axios.get).toHaveBeenCalledWith('/tickers/', {
        params: { start: 10, limit: 20 },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTicker', () => {
    it('should fetch a single ticker by id', async () => {
      const mockResponse = [{ id: '1', name: 'Bitcoin', symbol: 'BTC' }];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getTicker('1');
      expect(axios.get).toHaveBeenCalledWith('/ticker/', {
        params: { id: '1' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTickersByIds', () => {
    it('should fetch multiple tickers by ids', async () => {
      const mockResponse = [
        { id: '1', name: 'Bitcoin', symbol: 'BTC' },
        { id: '2', name: 'Ethereum', symbol: 'ETH' },
      ];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getTickersByIds(['1', '2']);
      expect(axios.get).toHaveBeenCalledWith('/ticker/', {
        params: { id: '1,2' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getGlobalData', () => {
    it('should fetch global market data', async () => {
      const mockResponse: GlobalData[] = [
        {
          coins_count: 7000,
          active_markets: 15000,
          total_mcap: 1000000000000,
          total_volume: 50000000000,
          btc_d: '40.5',
          eth_d: '18.2',
          mcap_change: '2.1',
          volume_change: '5.3',
          avg_change_percent: 2.5,
          volume_ath: 100000000000,
          mcap_ath: 2000000000000,
        },
      ];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getGlobalData();
      expect(axios.get).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExchanges', () => {
    it('should fetch exchanges with default parameters', async () => {
      const mockResponse: Exchange[] = [
        { id: '1', name: 'Binance', url: 'https://binance.com', country: 'Malta', date_live: '2017-07-14', volume_usd: '10000000', active_pairs: 500, pairs: '500', confidence_score: '10', rank: 1 },
        { id: '2', name: 'Coinbase', url: 'https://coinbase.com', country: 'USA', date_live: '2012-06-20', volume_usd: '8000000', active_pairs: 200, pairs: '200', confidence_score: '10', rank: 2 },
      ];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getExchanges();
      expect(axios.get).toHaveBeenCalledWith('/exchanges/', {
        params: { start: 0, limit: 100 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch exchanges with custom parameters', async () => {
      const mockResponse: Exchange[] = [
        { id: '3', name: 'Kraken', url: 'https://kraken.com', country: 'USA', date_live: '2011-07-28', volume_usd: '6000000', active_pairs: 250, pairs: '250', confidence_score: '10', rank: 3 },
      ];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getExchanges({ start: 5, limit: 10 });
      expect(axios.get).toHaveBeenCalledWith('/exchanges/', {
        params: { start: 5, limit: 10 },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getExchange', () => {
    it('should fetch a single exchange by name', async () => {
      const mockResponse: Exchange[] = [
        { id: '1', name: 'Binance', url: 'https://binance.com', country: 'Malta', date_live: '2017-07-14', volume_usd: '10000000', active_pairs: 500, pairs: '500', confidence_score: '10', rank: 1 },
      ];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getExchange('binance');
      expect(axios.get).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCoinMarkets', () => {
    it('should fetch markets for a specific coin', async () => {
      const mockResponse: CoinMarket[] = [
        { name: 'Binance', base: 'BTC', quote: 'USDT', price: '30000', price_usd: '30000', volume: '1000', volume_usd: '30000000', time: 1620000000 },
        { name: 'Coinbase', base: 'BTC', quote: 'USD', price: '30100', price_usd: '30100', volume: '800', volume_usd: '24080000', time: 1620000000 },
      ];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getCoinMarkets('1');
      expect(axios.get).toHaveBeenCalledWith('/coin/markets/', {
        params: { id: '1' },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCoinSocialStats', () => {
    it('should fetch social stats for a specific coin', async () => {
      const mockResponse: SocialStats = {
        name: 'Bitcoin',
        symbol: 'BTC',
        reddit: {
          subscribers: 2000000,
          active_users: 10000,
          posts_per_day: 100,
          comments_per_day: 1000,
          posts_per_hour: 4,
          comments_per_hour: 40,
        },
        twitter: {
          followers: 1000000,
          status_count: 5000,
          favorites: 20000,
          lists: 1000,
          following: 100,
          name: 'Bitcoin',
          link: 'https://twitter.com/bitcoin',
        },
        github: {
          closed_issues: 5000,
          open_pull_issues: 100,
          closed_pull_issues: 4000,
          forks: 10000,
          stars: 50000,
          subscribers: 5000,
          open_issues: 200,
          last_update: '2023-01-01',
        },
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await service.getCoinSocialStats('bitcoin');
      expect(axios.get).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Custom utility methods', () => {
    describe('searchCoins', () => {
      it('should search coins by name', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', nameid: 'bitcoin' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', nameid: 'ethereum' },
            { id: '3', name: 'Bitcoin Cash', symbol: 'BCH', nameid: 'bitcoin-cash' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.searchCoins('bitcoin');
        expect(axios.get).toHaveBeenCalledWith('/tickers/', {
          params: { start: 0, limit: 2000 },
        });
        expect(result).toEqual([
          { id: '1', name: 'Bitcoin', symbol: 'BTC', nameid: 'bitcoin' },
          { id: '3', name: 'Bitcoin Cash', symbol: 'BCH', nameid: 'bitcoin-cash' },
        ]);
      });

      it('should search coins by symbol', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', nameid: 'bitcoin' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', nameid: 'ethereum' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.searchCoins('BTC');
        expect(result).toEqual([
          { id: '1', name: 'Bitcoin', symbol: 'BTC', nameid: 'bitcoin' },
        ]);
      });

      it('should search coins by nameid', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', nameid: 'bitcoin' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', nameid: 'ethereum' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.searchCoins('ethereum');
        expect(result).toEqual([
          { id: '2', name: 'Ethereum', symbol: 'ETH', nameid: 'ethereum' },
        ]);
      });

      it('should return an empty array when no matches are found', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', nameid: 'bitcoin' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', nameid: 'ethereum' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.searchCoins('unknown');
        expect(result).toEqual([]);
      });
    });

    describe('getTopGainers', () => {
      it('should return top gainers with default limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', percent_change_24h: '2.5' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', percent_change_24h: '5.0' },
            { id: '3', name: 'Ripple', symbol: 'XRP', percent_change_24h: '10.0' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', percent_change_24h: '7.5' },
            { id: '5', name: 'Cardano', symbol: 'ADA', percent_change_24h: '3.0' },
            { id: '6', name: 'Polkadot', symbol: 'DOT', percent_change_24h: '4.0' },
            { id: '7', name: 'Binance Coin', symbol: 'BNB', percent_change_24h: '6.0' },
            { id: '8', name: 'Chainlink', symbol: 'LINK', percent_change_24h: '8.0' },
            { id: '9', name: 'Stellar', symbol: 'XLM', percent_change_24h: '9.0' },
            { id: '10', name: 'Bitcoin Cash', symbol: 'BCH', percent_change_24h: '1.0' },
            { id: '11', name: 'Dogecoin', symbol: 'DOGE', percent_change_24h: '15.0' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopGainers();
        expect(axios.get).toHaveBeenCalledWith('/tickers/', {
          params: { start: 0, limit: 100 },
        });
        
        // Verificamos la clasificación y el límite predeterminado de 10
        expect(result).toHaveLength(10);
        expect(result[0].id).toBe('11'); // Dogecoin (ID 11) debe ser el primero
        expect(result).not.toContainEqual(expect.objectContaining({ id: '10' })); // BCH no debe estar incluido
      });

      it('should return top gainers with custom limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', percent_change_24h: '2.5' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', percent_change_24h: '5.0' },
            { id: '3', name: 'Ripple', symbol: 'XRP', percent_change_24h: '10.0' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', percent_change_24h: '7.5' },
            { id: '5', name: 'Cardano', symbol: 'ADA', percent_change_24h: '3.0' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopGainers(3);
        
        // Verificamos la clasificación y el límite personalizado de 3
        expect(result).toHaveLength(3);
        expect(result[0].symbol).toBe('XRP');
        expect(result[1].symbol).toBe('LTC');
        expect(result[2].symbol).toBe('ETH');
      });

      it('should handle empty data', async () => {
        const mockResponse = { data: [] };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopGainers();
        expect(result).toEqual([]);
      });

      it('should handle invalid percent_change_24h values', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', percent_change_24h: 'invalid' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', percent_change_24h: '5.0' },
            { id: '3', name: 'Ripple', symbol: 'XRP', percent_change_24h: null },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopGainers();
        expect(result.length).toBeGreaterThan(0);
        expect(result.find(coin => coin.id === '2')).toBeDefined();
      });
    });

    describe('getTopLosers', () => {
      it('should return top losers with default limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', percent_change_24h: '-2.5' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', percent_change_24h: '-5.0' },
            { id: '3', name: 'Ripple', symbol: 'XRP', percent_change_24h: '-10.0' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', percent_change_24h: '-7.5' },
            { id: '5', name: 'Cardano', symbol: 'ADA', percent_change_24h: '-3.0' },
            { id: '6', name: 'Polkadot', symbol: 'DOT', percent_change_24h: '-4.0' },
            { id: '7', name: 'Binance Coin', symbol: 'BNB', percent_change_24h: '-6.0' },
            { id: '8', name: 'Chainlink', symbol: 'LINK', percent_change_24h: '-8.0' },
            { id: '9', name: 'Stellar', symbol: 'XLM', percent_change_24h: '-9.0' },
            { id: '10', name: 'Bitcoin Cash', symbol: 'BCH', percent_change_24h: '-1.0' },
            { id: '11', name: 'Dogecoin', symbol: 'DOGE', percent_change_24h: '-15.0' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopLosers();
        expect(axios.get).toHaveBeenCalledWith('/tickers/', {
          params: { start: 0, limit: 100 },
        });
        
        // Verificamos la clasificación y el límite predeterminado de 10
        expect(result).toHaveLength(10);
        expect(result[0].id).toBe('11'); // Dogecoin (ID 11) debe ser el primero
        expect(result).not.toContainEqual(expect.objectContaining({ id: '10' })); // Se excluye uno
      });

      it('should return top losers with custom limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', percent_change_24h: '-2.5' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', percent_change_24h: '-5.0' },
            { id: '3', name: 'Ripple', symbol: 'XRP', percent_change_24h: '-10.0' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', percent_change_24h: '-7.5' },
            { id: '5', name: 'Cardano', symbol: 'ADA', percent_change_24h: '-3.0' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopLosers(3);
        
        // Verificamos la clasificación y el límite personalizado de 3
        expect(result).toHaveLength(3);
        expect(result[0].symbol).toBe('XRP');
        expect(result[1].symbol).toBe('LTC');
        expect(result[2].symbol).toBe('ETH');
      });

      it('should handle mixed positive and negative changes', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', percent_change_24h: '2.5' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', percent_change_24h: '-5.0' },
            { id: '3', name: 'Ripple', symbol: 'XRP', percent_change_24h: '-10.0' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopLosers(2);
        expect(result).toHaveLength(2);
        expect(result[0].symbol).toBe('XRP');
        expect(result[1].symbol).toBe('ETH');
      });
    });

    describe('getTopByVolume', () => {
      it('should return top coins by volume with default limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', volume24: '20000000000' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', volume24: '10000000000' },
            { id: '3', name: 'Ripple', symbol: 'XRP', volume24: '5000000000' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', volume24: '2000000000' },
            { id: '5', name: 'Cardano', symbol: 'ADA', volume24: '1500000000' },
            { id: '6', name: 'Polkadot', symbol: 'DOT', volume24: '1200000000' },
            { id: '7', name: 'Binance Coin', symbol: 'BNB', volume24: '9000000000' },
            { id: '8', name: 'Chainlink', symbol: 'LINK', volume24: '800000000' },
            { id: '9', name: 'Stellar', symbol: 'XLM', volume24: '700000000' },
            { id: '10', name: 'Bitcoin Cash', symbol: 'BCH', volume24: '1800000000' },
            { id: '11', name: 'Dogecoin', symbol: 'DOGE', volume24: '2500000000' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopByVolume();
        expect(axios.get).toHaveBeenCalledWith('/tickers/', {
          params: { start: 0, limit: 100 },
        });
        
        // Verificamos la clasificación y el límite predeterminado de 10
        expect(result).toHaveLength(10);
        expect(result[0].symbol).toBe('BTC'); // El de mayor volumen
        expect(result[9].symbol).toBe('LINK'); // El de menor volumen entre los 10 primeros
      });

      it('should return top coins by volume with custom limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', volume24: '20000000000' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', volume24: '10000000000' },
            { id: '3', name: 'Ripple', symbol: 'XRP', volume24: '5000000000' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', volume24: '2000000000' },
            { id: '5', name: 'Cardano', symbol: 'ADA', volume24: '1500000000' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopByVolume(3);
        
        // Verificamos la clasificación y el límite personalizado de 3
        expect(result).toHaveLength(3);
        expect(result[0].symbol).toBe('BTC');
        expect(result[1].symbol).toBe('ETH');
        expect(result[2].symbol).toBe('XRP');
      });

      it('should handle invalid volume24 values', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', volume24: 'invalid' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', volume24: '10000000000' },
            { id: '3', name: 'Ripple', symbol: 'XRP', volume24: null },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopByVolume();
        expect(result.length).toBeGreaterThan(0);
        expect(result.find(coin => coin.id === '2')).toBeDefined();
      });
    });

    describe('getTopByMarketCap', () => {
      it('should return top coins by market cap with default limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', market_cap_usd: '500000000000' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', market_cap_usd: '200000000000' },
            { id: '3', name: 'Ripple', symbol: 'XRP', market_cap_usd: '50000000000' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', market_cap_usd: '10000000000' },
            { id: '5', name: 'Cardano', symbol: 'ADA', market_cap_usd: '30000000000' },
            { id: '6', name: 'Polkadot', symbol: 'DOT', market_cap_usd: '25000000000' },
            { id: '7', name: 'Binance Coin', symbol: 'BNB', market_cap_usd: '40000000000' },
            { id: '8', name: 'Chainlink', symbol: 'LINK', market_cap_usd: '15000000000' },
            { id: '9', name: 'Stellar', symbol: 'XLM', market_cap_usd: '8000000000' },
            { id: '10', name: 'Bitcoin Cash', symbol: 'BCH', market_cap_usd: '9000000000' },
            { id: '11', name: 'Dogecoin', symbol: 'DOGE', market_cap_usd: '35000000000' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopByMarketCap();
        expect(axios.get).toHaveBeenCalledWith('/tickers/', {
          params: { start: 0, limit: 100 },
        });
        
        // Verificamos la clasificación y el límite predeterminado de 10
        expect(result).toHaveLength(10);
        expect(result[0].symbol).toBe('BTC'); // El de mayor cap. de mercado
        expect(result[9].symbol).toBe('BCH'); // El de menor cap. de mercado entre los 10 primeros
        expect(result.map(coin => coin.symbol)).not.toContain('XLM'); // Se excluye el de menor cap.
      });

      it('should return top coins by market cap with custom limit', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', market_cap_usd: '500000000000' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', market_cap_usd: '200000000000' },
            { id: '3', name: 'Ripple', symbol: 'XRP', market_cap_usd: '50000000000' },
            { id: '4', name: 'Litecoin', symbol: 'LTC', market_cap_usd: '10000000000' },
            { id: '5', name: 'Cardano', symbol: 'ADA', market_cap_usd: '30000000000' },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopByMarketCap(3);
        
        // Verificamos la clasificación y el límite personalizado de 3
        expect(result).toHaveLength(3);
        expect(result[0].symbol).toBe('BTC');
        expect(result[1].symbol).toBe('ETH');
        expect(result[2].symbol).toBe('XRP');
      });

      it('should handle invalid market_cap_usd values', async () => {
        const mockResponse = {
          data: [
            { id: '1', name: 'Bitcoin', symbol: 'BTC', market_cap_usd: 'invalid' },
            { id: '2', name: 'Ethereum', symbol: 'ETH', market_cap_usd: '200000000000' },
            { id: '3', name: 'Ripple', symbol: 'XRP', market_cap_usd: null },
          ],
        };

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

        const result = await service.getTopByMarketCap();
        expect(result.length).toBeGreaterThan(0);
        expect(result.find(coin => coin.id === '2')).toBeDefined();
      });
    });
  });
}); 