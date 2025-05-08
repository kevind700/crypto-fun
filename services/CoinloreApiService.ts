import {
  getTopGainers,
  getTopLosers,
  searchCoins,
  sortTickersByMarketCap,
  sortTickersByVolume
} from '../utils/dataTransformers';
import BaseApiService from './BaseApiService';
import {
  CoinMarket,
  Exchange,
  ExchangesParams,
  GlobalData,
  SocialStats,
  Ticker,
  TickersParams,
} from './types';

class CoinloreApiService extends BaseApiService {
  private static API_URL = 'https://api.coinlore.net/api';
  protected static instance: CoinloreApiService;

  private constructor() {
    super(CoinloreApiService.API_URL);
  }

  public static getInstance(): CoinloreApiService {
    if (!CoinloreApiService.instance) {
      CoinloreApiService.instance = new CoinloreApiService();
    }
    return CoinloreApiService.instance;
  }

  // Tickers endpoints
  async getTickers(params: TickersParams = {}): Promise<{ data: Ticker[] }> {
    const defaultParams: TickersParams = {
      start: 0,
      limit: 100,
    };
    return this.get<{ data: Ticker[] }>('/tickers/', {
      params: { ...defaultParams, ...params },
    });
  }

  async getTicker(id: string | number): Promise<Ticker[]> {
    return this.get<Ticker[]>('/ticker/', {
      params: { id },
    });
  }

  async getTickersByIds(ids: (string | number)[]): Promise<Ticker[]> {
    return this.get<Ticker[]>('/ticker/', {
      params: { id: ids.join(',') },
    });
  }

  // Global market data
  async getGlobalData(): Promise<GlobalData[]> {
    return this.get<GlobalData[]>('/global/');
  }

  // Exchanges endpoints
  async getExchanges(params: ExchangesParams = {}): Promise<Exchange[]> {
    const defaultParams: ExchangesParams = {
      start: 0,
      limit: 100,
    };
    return this.get<Exchange[]>('/exchanges/', {
      params: { ...defaultParams, ...params },
    });
  }

  async getExchange(name: string): Promise<Exchange[]> {
    return this.get<Exchange[]>(`/exchange/${name}`);
  }

  // Markets endpoints
  async getCoinMarkets(coinId: string | number): Promise<CoinMarket[]> {
    return this.get<CoinMarket[]>(`/coin/markets/`, {
      params: { id: coinId },
    });
  }

  // Social stats endpoints
  async getCoinSocialStats(coinName: string): Promise<SocialStats> {
    return this.get<SocialStats>(`/coin/social_stats/${coinName}`);
  }

  // Custom utility methods
  async searchCoins(query: string): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 2000 });
    return searchCoins(data, query);
  }

  async getTopGainers(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return getTopGainers(data, limit);
  }

  async getTopLosers(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return getTopLosers(data, limit);
  }

  async getTopByVolume(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return sortTickersByVolume(data).slice(0, limit);
  }

  async getTopByMarketCap(limit: number = 10): Promise<Ticker[]> {
    const { data } = await this.getTickers({ limit: 100 });
    return sortTickersByMarketCap(data).slice(0, limit);
  }
}

export default CoinloreApiService;