import { Component, inject, OnInit } from '@angular/core';
import { Simulation } from '../../entity/Simulation';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartProviderService } from '../../service/chart/chart-provider.service';
import { MathService } from '../../service/math/math.service';

@Component({
  selector: 'app-simulation-report',
  imports: [InfoItemComponent, CommonModule, BaseChartDirective],
  templateUrl: './simulation-report.component.html',
  styleUrl: './simulation-report.component.scss'
})
export class SimulationReportComponent implements OnInit{
  simulation!: Simulation;
  chartOptions;
  chartData;
  pieChartData;
  public pieChartType: ChartType = 'pie';
  solidAngle!: number;
  error!: number;
  escapedPercent!: number;

  private readonly api = inject(ApiService);
  private readonly _math = inject(MathService);

  constructor(private route: ActivatedRoute, private chart: ChartProviderService){

    this.chartOptions = this.chart.chartOptions;
    this.chartData = this.chart.chartData;
    this.pieChartData = this.chart.pieChartData;
  }


  ngOnInit(): void{    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.findById(id).subscribe({
        next: (simulation: Simulation) => {
          this.simulation = simulation;
          this.updateCharts();
        },
        error: (error: any) => {
          console.error('Erro ao carregar simulação:', error);
        }
      });
    } else {
      console.error('ID da simulação não encontrado na URL.');
    }
  }

  private updateCharts(): void {
    const { escaped, emissions } = this.simulation;
    this.chart.updateChartData(escaped, emissions);
  

    this.chartData = { ...this.chart.chartData };
    this.pieChartData = { ...this.chart.pieChartData };

    this.solidAngle = this.simulation.escaped / this.simulation.emissions;
    this.error = this._math.getSolidAngleDeviation(this.solidAngle, this.simulation.emissions);
    this.escapedPercent = (this.simulation.escaped / this.simulation.emissions) * 100;
  }

  printReport(){
    window.print();
  }
}
