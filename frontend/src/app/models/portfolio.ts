export interface Portfolio {
    id: number;
    name: string;
    stocks: PortfolioStock[];
  }
  
  export interface PortfolioStock {
    id: number;
    symbol: string;
  }
  