import { Injectable } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartProviderService {
  constructor() { }

  chartData: ChartData<'doughnut'> = {
    labels: ['Vazão', 'Emissões'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#A8A8A8', '#36A2EB'],
      },
    ],
  };

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Vazão'], ['Emissões Captadas']],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#36A2EB', '#A8A8A8'],
      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  updateChartData(escaped: number, emissions: number): void {
    const emited = emissions - escaped;

    this.chartData.datasets[0].data = [escaped, emited];
    this.pieChartData.datasets[0].data = [escaped, emited];
  }

  calculateSolidAngleAndEscapedPercentual(escaped: number, emissions: number): {
    solidAngle: number;
    escapedPercentual: number;
  } {
    const solidAngle = (4 * Math.PI * escaped) / emissions;
    const escapedPercentual = (escaped / emissions) * 100;

    return { solidAngle, escapedPercentual };
  }
}
