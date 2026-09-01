import { Injectable } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartProviderService {
  chartOptions: ChartOptions = {
    responsive: true,
    locale: 'pt-BR',
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
        backgroundColor: ['#A8A8A8', '#005a0ce6'],
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

    const percentage = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    });

    this.chartData.labels = [
      `Vazão: (${percentage.format(escapedPercent)}%)`,
      `Emissões: (${percentage.format(emitedPercent)}%)`
    ];

    this.chartData.datasets[0].data = [escaped, emited];
    
    this.pieChartData.labels = [
      ['Vazão', `${percentage.format(escapedPercent)}%`],
      ['Emissões Captadas', `${percentage.format(emitedPercent)}%`]
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
