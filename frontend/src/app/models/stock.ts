export interface Stock {
    symbol: string;
    price: number;
    change: number;
    change_percent: string;
    volume?: string;
    latest_trading_day?: string;
  }
  
  export interface MarketIndex {
    symbol: string;
    timestamp: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
  }
  
  export interface TopMovers {
    gainers: Stock[];
    losers: Stock[];
  }
  