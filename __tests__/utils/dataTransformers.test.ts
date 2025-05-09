import { Ticker } from '@/models/types/crypto';
import {
  getTopGainers,
  getTopLosers,
  searchCoins,
  sortTickersByMarketCap,
  sortTickersByPercentChange,
  sortTickersByVolume
} from '@/utils/dataTransformers';

describe('Data Transformers', () => {
  const mockTickers: Ticker[] = [
    { 
      id: '1', 
      symbol: 'BTC', 
      name: 'Bitcoin', 
      nameid: 'bitcoin',
      rank: 1,
      percent_change_24h: '5.2', 
      percent_change_1h: '1.2',
      percent_change_7d: '8.5',
      price_usd: '40000',
      market_cap_usd: '800000000000',
      volume24: '30000000000',
      volume24_native: '750',
      csupply: '19000000',
      price_btc: '1',
      tsupply: '19000000',
      msupply: '21000000'
    },
    { 
      id: '2', 
      symbol: 'ETH', 
      name: 'Ethereum', 
      nameid: 'ethereum',
      rank: 2,
      percent_change_24h: '-2.1', 
      percent_change_1h: '-0.5',
      percent_change_7d: '-3.2',
      price_usd: '2500',
      market_cap_usd: '300000000000',
      volume24: '15000000000',
      volume24_native: '6000000',
      csupply: '120000000',
      price_btc: '0.062',
      tsupply: '120000000',
      msupply: ''
    },
    { 
      id: '3', 
      symbol: 'XRP', 
      name: 'Ripple', 
      nameid: 'ripple',
      rank: 3,
      percent_change_24h: '10.5', 
      percent_change_1h: '2.3',
      percent_change_7d: '15.7',
      price_usd: '1.2',
      market_cap_usd: '50000000000',
      volume24: '5000000000',
      volume24_native: '4166666667',
      csupply: '45000000000',
      price_btc: '0.00003',
      tsupply: '100000000000',
      msupply: '100000000000'
    }
  ];

  describe('sortTickersByPercentChange', () => {
    it('should sort tickers by percentage change in descending order', () => {
      const sorted = sortTickersByPercentChange(mockTickers);
      expect(sorted[0].symbol).toBe('XRP');
      expect(sorted[1].symbol).toBe('BTC');
      expect(sorted[2].symbol).toBe('ETH');
    });
  });

  describe('getTopGainers', () => {
    it('should return top gainers with correct limit', () => {
      const gainers = getTopGainers(mockTickers, 2);
      expect(gainers.length).toBe(2);
      expect(gainers[0].symbol).toBe('XRP');
      expect(gainers[1].symbol).toBe('BTC');
    });
  });

  describe('getTopLosers', () => {
    it('should return top losers with correct limit', () => {
      const losers = getTopLosers(mockTickers, 1);
      expect(losers.length).toBe(1);
      expect(losers[0].symbol).toBe('ETH');
    });
  });

  describe('searchCoins', () => {
    it('should find coins by name', () => {
      const results = searchCoins(mockTickers, 'Bitcoin');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('1');
    });

    it('should find coins by symbol', () => {
      const results = searchCoins(mockTickers, 'eth');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('2');
    });

    it('should find coins by nameid', () => {
      const results = searchCoins(mockTickers, 'ripp');
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('3');
    });

    it('should return empty array with empty search', () => {
      const results = searchCoins(mockTickers, '');
      expect(results.length).toBe(0);
    });
  });

  describe('sortTickersByMarketCap', () => {
    it('should sort tickers by market cap in descending order', () => {
      const sorted = sortTickersByMarketCap(mockTickers);
      expect(sorted[0].symbol).toBe('BTC');
      expect(sorted[1].symbol).toBe('ETH');
      expect(sorted[2].symbol).toBe('XRP');
    });
  });

  describe('sortTickersByVolume', () => {
    it('should sort tickers by volume in descending order', () => {
      const sorted = sortTickersByVolume(mockTickers);
      expect(sorted[0].symbol).toBe('BTC');
      expect(sorted[1].symbol).toBe('ETH');
      expect(sorted[2].symbol).toBe('XRP');
    });
  });
}); 