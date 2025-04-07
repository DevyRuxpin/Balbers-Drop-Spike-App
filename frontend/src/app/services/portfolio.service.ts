import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Portfolio } from '../models/portfolio';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private http: HttpClient) { }
  
  getPortfolios(): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${environment.apiUrl}/portfolios`);
  }
  
  createPortfolio(name: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/portfolios`, { name });
  }
  
  deletePortfolio(portfolioId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/portfolios/${portfolioId}`);
  }
  
  addStockToPortfolio(portfolioId: number, symbol: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/portfolios/${portfolioId}/stocks`, { symbol });
  }
  
  removeStockFromPortfolio(portfolioId: number, stockId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/portfolios/${portfolioId}/stocks/${stockId}`);
  }
}
