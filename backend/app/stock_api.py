import requests
from flask import current_app
import time

class StockAPI:
    @staticmethod
    def get_market_index():
        """Get market index data (S&P 500)"""
        api_key = current_app.config['STOCK_API_KEY']
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=SPY&interval=5min&apikey={api_key}'
        
        try:
            response = requests.get(url)
            data = response.json()
            
            if 'Time Series (5min)' not in data:
                return {'error': 'API limit reached or invalid response'}, 429
            
            time_series = data['Time Series (5min)']
            latest_data = list(time_series.items())[0]
            
            return {
                'symbol': 'SPY',
                'timestamp': latest_data[0],
                'open': latest_data[1]['1. open'],
                'high': latest_data[1]['2. high'],
                'low': latest_data[1]['3. low'],
                'close': latest_data[1]['4. close'],
                'volume': latest_data[1]['5. volume']
            }
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_top_gainers_losers():
        """Get top gainers and losers for the day"""
        # In a real implementation, we'd use a proper API endpoint
        # For the free tier, we'll simulate this with a list of major stocks
        symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT',
                  'DIS', 'NFLX', 'PYPL', 'INTC', 'AMD', 'CSCO', 'CMCSA', 'PEP', 'ADBE', 'COST']
        
        results = []
        api_key = current_app.config['STOCK_API_KEY']
        
        for symbol in symbols[:5]:  # Limit API calls for demo
            try:
                url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'
                response = requests.get(url)
                data = response.json()
                
                if 'Global Quote' not in data:
                    time.sleep(12)  # API rate limiting
                    continue
                
                quote = data['Global Quote']
                
                results.append({
                    'symbol': symbol,
                    'price': float(quote['05. price']),
                    'change': float(quote['09. change']),
                    'change_percent': quote['10. change percent'].strip('%')
                })
                
                time.sleep(12)  # API rate limiting
            except Exception as e:
                print(f"Error fetching {symbol}: {str(e)}")
        
        # Sort results by change percentage
        results.sort(key=lambda x: float(x['change_percent']), reverse=True)
        
        # Split into gainers and losers
        gainers = [r for r in results if float(r['change_percent']) > 0][:10]
        losers = sorted([r for r in results if float(r['change_percent']) <= 0], 
                       key=lambda x: float(x['change_percent']))[:10]
        
        return {
            'gainers': gainers,
            'losers': losers
        }
    
    @staticmethod
    def get_stock_data(symbol):
        """Get data for a specific stock"""
        api_key = current_app.config['STOCK_API_KEY']
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'
        
        try:
            response = requests.get(url)
            data = response.json()
            
            if 'Global Quote' not in data:
                return {'error': 'API limit reached or invalid symbol'}, 429
            
            quote = data['Global Quote']
            
            return {
                'symbol': symbol,
                'price': quote['05. price'],
                'change': quote['09. change'],
                'change_percent': quote['10. change percent'],
                'volume': quote['06. volume'],
                'latest_trading_day': quote['07. latest trading day']
            }
        except Exception as e:
            return {'error': str(e)}, 500
