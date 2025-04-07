import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Stock } from '../../models/stock';
import { Chart, ChartConfiguration } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-movers',
  templateUrl: './top-movers.component.html',
  styleUrls: ['./top-movers.component.scss']
})
export class TopMoversComponent implements OnChanges {
  @Input() stocks: Stock[] | undefined;
  @Input() type: 'gainers' | 'losers' = 'gainers';
  
  chart: any;
  chartConfig: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: '% Change',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false
        }
      },
      onClick: (event, elements) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          if (this.stocks && this.stocks[index]) {
            this.viewStockDetails(this.stocks[index].symbol);
          }
        }
      }
    }
  };

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stocks'] && this.stocks) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!this.stocks || this.stocks.length === 0) return;
    
    const labels = this.stocks.map(stock => stock.symbol);
    const data = this.stocks.map(stock => parseFloat(stock.change_percent));
    
    // Set colors based on type
    const colors = this.type === 'gainers' 
      ? data.map(() => 'rgba(40, 167, 69, 0.7)') 
      : data.map(() => 'rgba(220, 53, 69, 0.7)');
      
    const borderColors = this.type === 'gainers'
      ? data.map(() => 'rgba(40, 167, 69, 1)')
      : data.map(() => 'rgba(220, 53, 69, 1)');
    
    this.chartConfig.data.labels = labels;
    this.chartConfig.data.datasets[0].data = data;
    this.chartConfig.data.datasets[0].backgroundColor = colors;
    this.chartConfig.data.datasets[0].borderColor = borderColors;
    
    // If chart exists, update it
    if (this.chart) {
      this.chart.update();
    }
  }

  createChart(canvas: HTMLCanvasElement): void {
    this.chart = new Chart(canvas, this.chartConfig);
  }
  
  viewStockDetails(symbol: string): void {
    this.router.navigate(['/stock', symbol]);
  }
}
