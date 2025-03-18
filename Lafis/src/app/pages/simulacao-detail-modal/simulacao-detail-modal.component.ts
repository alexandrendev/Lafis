import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Chart } from 'chart.js/dist';
import { BaseChartDirective } from 'ng2-charts';
import { InfoItemComponent } from '../../components/info-item/info-item.component';


@Component({
  selector: 'app-simulacao-detail-modal',
  imports: [CommonModule, BaseChartDirective, InfoItemComponent],
  templateUrl: './simulacao-detail-modal.component.html',
  styleUrl: './simulacao-detail-modal.component.scss'
})
export class SimulacaoDetailModalComponent {
  @Input() selectedSimulation: any;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  solidAngle!: number;
  escapedPercentual!: number;

  escaped!: number;
  emited!: number;

  chartData: ChartData<'doughnut'> = {
    labels: ['Vazão', 'Emissões'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#A8A8A8', '#36A2EB'],
      }
    ]
  };
   public pieChartType: ChartType = 'pie';

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
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
      }
    },
  };


  close() {
    this.closeModal.emit();
  }


  updateInformation() {
    this.escaped = this.selectedSimulation.escaped;
    this.emited = this.selectedSimulation.emissions - this.selectedSimulation.escaped;

    this.chartData.datasets[0].data = [this.escaped, this.emited];
    // this.pieChartData.datasets[0].data = [this.escaped, this.emited];
    this.solidAngle = (4* Math.PI * this.selectedSimulation.escaped) / this.selectedSimulation.emissions;
    this.escapedPercentual = (this.selectedSimulation.escaped / this.selectedSimulation.emissions) * 100;
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.updateInformation();
    }
  }
}
