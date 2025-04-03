import { Injectable } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartProviderService {
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

  updateChartData(escaped: number, emissions: number): void {
    const emited = emissions - escaped;

    const escapedPercent = (escaped / emissions) * 100;
    const emitedPercent = 100 - escapedPercent;

    this.chartData.labels = [
      `Vazão: (${escapedPercent.toFixed(2)}%)`,
      `Emissões: (${emitedPercent.toFixed(2)}%)`
    ];

    this.chartData.datasets[0].data = [escaped, emited];
    
    this.pieChartData.labels = [
      ['Vazão', `${escapedPercent.toFixed(1)}%`],
      ['Emissões Captadas', `${emitedPercent.toFixed(1)}%`]
    ];
    this.pieChartData.datasets[0].data = [escaped, emited];

    this.chartData.datasets[0].data = [escaped, emited];
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
