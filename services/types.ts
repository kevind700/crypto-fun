// API Base Types
export interface Ticker {
  id: string;
  symbol: string;
  name: string;
  nameid: string;
  rank: number;
  price_usd: string;
  percent_change_24h: string;
  percent_change_1h: string;
  percent_change_7d: string;
  market_cap_usd: string;
  volume24: string;
  volume24_native: string;
  csupply: string;
  price_btc: string;
  tsupply: string;
  msupply: string;
}

export interface GlobalData {
  coins_count: number;
  active_markets: number;
  total_mcap: number;
  total_volume: number;
  btc_d: string;
  eth_d: string;
  mcap_change: string;
  volume_change: string;
  avg_change_percent: number;
  volume_ath: number;
  mcap_ath: number;
}

export interface Exchange {
  id: string;
  name: string;
  url: string;
  country: string;
  date_live: string;
  volume_usd: string;
  active_pairs: number;
  pairs: string;
  confidence_score: string;
  rank: number;
  volume_24h_adjusted?: string;
  trades_24h?: string;
}

export interface CoinMarket {
  name: string;
  base: string;
  quote: string;
  price: string;
  price_usd: string;
  volume: string;
  volume_usd: string;
  time: number;
}

export interface SocialStats {
  name: string;
  symbol: string;
  reddit: {
    subscribers: number;
    active_users: number;
    posts_per_day: number;
    comments_per_day: number;
    posts_per_hour: number;
    comments_per_hour: number;
  };
  twitter: {
    followers: number;
    status_count: number;
    favorites: number;
    lists: number;
    following: number;
    name: string;
    link: string;
  };
  github: {
    closed_issues: number;
    open_pull_issues: number;
    closed_pull_issues: number;
    forks: number;
    stars: number;
    subscribers: number;
    open_issues: number;
    last_update: string;
  };
}

// API Parameters Types
export interface TickersParams {
  start?: number;
  limit?: number;
}

export interface TickerParams {
  id: string | number;
}

export interface ExchangesParams {
  start?: number;
  limit?: number;
}

// UI State Types
export interface UIState {
  isLoading: boolean;
  error: string | null;
  selectedCoin: Ticker | null;
  selectedExchange: Exchange | null;
  searchQuery: string;
  refreshing: boolean;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity?: number) => string;
    strokeWidth?: number;
  }[];
}

export interface MarketMetrics {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  activeMarkets: number;
  totalCoins: number;
}

export interface PriceAlert {
  coinId: string;
  price: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: Date;
}