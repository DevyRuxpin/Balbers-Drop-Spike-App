import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { MarketIndex, TopMovers } from '../../models/stock';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  marketIndex: MarketIndex | null = null;
  topMovers: TopMovers | null = null;
  loading = true;
  error = '';

  constructor(private stockService: StockService) { }

  ngOnInit(): void {
    this.loadMarketData();
  }

  loadMarketData(): void {
    this.loading = true;
    this.error = '';
    
    // Get market index data
    this.stockService.getMarketIndex()
      .pipe(
        catchError(err => {
          this.error = 'Failed to load market data';
          console.error('Market index error:', err);
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.marketIndex = data;
        }
        this.loading = false;
      });
    
    // Get top movers
    this.stockService.getTopMovers()
      .pipe(
        catchError(err => {
          this.error = 'Failed to load top movers';
          console.error('Top movers error:', err);
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.topMovers = data;
        }
      });
  }
}
