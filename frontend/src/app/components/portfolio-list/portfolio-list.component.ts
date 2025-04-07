import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { StockService } from '../../services/stock.service';
import { Portfolio } from '../../models/portfolio';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {
  portfolios: Portfolio[] = [];
  loading = false;
  error = '';
  
  portfolioForm: FormGroup;
  stockForm: FormGroup;
  
  selectedPortfolio: Portfolio | null = null;
  
  constructor(
    private portfolioService: PortfolioService,
    private stockService: StockService,
    private fb: FormBuilder
  ) {
    this.portfolioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
    
    this.stockForm = this.fb.group({
      symbol: ['', [Validators.required, Validators.pattern('[A-Za-z]{1,5}')]]
    });
  }

  ngOnInit(): void {
    this.loadPortfolios();
  }

  loadPortfolios(): void {
    this.loading = true;
    this.error = '';
    
    this.portfolioService.getPortfolios()
      .pipe(
        catchError(err => {
          this.error = 'Failed to load portfolios';
          console.error('Portfolio error:', err);
          return of([]);
        })
      )
      .subscribe(data => {
        this.portfolios = data;
        this.loading = false;
      });
  }
  
  createPortfolio(): void {
    if (this.portfolioForm.invalid) return;
    
    const name = this.portfolioForm.get('name')?.value;
    this.loading = true;
    
    this.portfolioService.createPortfolio(name)
      .pipe(
        catchError(err => {
          this.error = 'Failed to create portfolio';
          console.error('Create portfolio error:', err);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.loadPortfolios();
          this.portfolioForm.reset();
        }
        this.loading = false;
      });
  }
  
  deletePortfolio(portfolioId: number): void {
    if (!confirm('Are you sure you want to delete this portfolio?')) return;
    
    this.loading = true;
    
    this.portfolioService.deletePortfolio(portfolioId)
      .pipe(
        catchError(err => {
          this.error = 'Failed to delete portfolio';
          console.error('Delete portfolio error:', err);
          return of(null);
        })
      )
      .subscribe(() => {
        this.loadPortfolios();
        if (this.selectedPortfolio?.id === portfolioId) {
          this.selectedPortfolio = null;
        }
      });
  }
  
  selectPortfolio(portfolio: Portfolio): void {
    this.selectedPortfolio = portfolio;
  }
  
  addStockToPortfolio(): void {
    if (!this.selectedPortfolio || this.stockForm.invalid) return;
    
    const symbol = this.stockForm.get('symbol')?.value.toUpperCase();
    this.loading = true;
    
    // First validate the stock symbol exists
    this.stockService.getStockData(symbol)
      .pipe(
        catchError(err => {
          this.error = 'Invalid stock symbol';
          this.loading = false;
          return of(null);
        })
      )
      .subscribe(stockData => {
        if (stockData && this.selectedPortfolio) {
          // Now add to portfolio
          this.portfolioService.addStockToPortfolio(this.selectedPortfolio.id, symbol)
            .pipe(
              catchError(err => {
                this.error = 'Failed to add stock to portfolio';
                console.error('Add stock error:', err);
                return of(null);
              })
            )
            .subscribe(() => {
              this.loadPortfolios();
              this.stockForm.reset();
            });
        }
        this.loading = false;
      });
  }
  
  removeStockFromPortfolio(portfolioId: number, stockId: number): void {
    this.loading = true;
    
    this.portfolioService.removeStockFromPortfolio(portfolioId, stockId)
      .pipe(
        catchError(err => {
          this.error = 'Failed to remove stock';
          console.error('Remove stock error:', err);
          return of(null);
        })
      )
      .subscribe(() => {
        this.loadPortfolios();
      });
  }
}
