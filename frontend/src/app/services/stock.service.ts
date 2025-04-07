import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MarketIndex, Stock, TopMovers } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private http: HttpClient) { }
  
  getMarketIndex(): Observable<MarketIndex> {
    return this.http.get<MarketIndex>(`${environment.apiUrl}/market-index`);
  }
  
  getTopMovers(): Observable<TopMovers> {
    return this.http.get<TopMovers>(`${environment.apiUrl}/top-movers`);
  }
  
  getStockData(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(`${environment.apiUrl}/stock/${symbol}`);
  }
}
