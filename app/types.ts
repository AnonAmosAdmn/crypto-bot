// app/types.ts
export type Cryptocurrency = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  ath: number;
  sparkline_in_7d?: {
    price: number[];
  };
};

export type CryptoHolding = {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  image?: string;
};