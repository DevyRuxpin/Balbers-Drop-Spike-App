import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MarketIndex } from '../../models/stock';
import { Chart, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-market-index',
  templateUrl: './market-index.component.html',
  styleUrls: ['./market-index.component.scss']
})
export class MarketIndexComponent implements OnChanges {
  @Input() marketData: MarketIndex | null = null;
  
  chart: any;
  chartConfig: ChartConfiguration = {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'S&P 500',
        data: [],
        fill: false,
        borderColor: '#0066cc',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['marketData'] && this.marketData) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (!this.marketData) return;
    
    // In a real app, we would have historical data to plot
    // For this demo, we'll just use the current data point
    const labels = [this.marketData.timestamp];
    const data = [parseFloat(this.marketData.close)];
    
    this.chartConfig.data.labels = labels;
    this.chartConfig.data.datasets[0].data = data;
    
    // If chart exists, update it, otherwise create it
    if (this.chart) {
      this.chart.update();
    }
  }

  createChart(canvas: HTMLCanvasElement): void {
    this.chart = new Chart(canvas, this.chartConfig);
  }
}
