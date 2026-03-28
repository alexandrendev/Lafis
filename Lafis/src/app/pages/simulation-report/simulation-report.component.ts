import { Component, inject, OnInit } from '@angular/core';
import { Simulation } from '../../entity/Simulation';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartProviderService } from '../../service/chart/chart-provider.service';
import { TranslationServiceService } from '../../service/helpers/translation-service.service';

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
  emissionsPerSecond!: number;

  private readonly api = inject(ApiService);

  constructor(
    private route: ActivatedRoute,
    private chart: ChartProviderService,
    public translationService: TranslationServiceService
    ){

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

  get apertureType(): string | undefined {
    return this.simulation?.context?.aperture?.type;
  }

  get sourceType(): string | undefined {
    return this.simulation?.context?.source?.type;
  }

  get pointCenterX(): number | undefined {
    const source = this.simulation?.context?.source as any;
    return source?.centerX ?? source?.x;
  }

  get pointCenterY(): number | undefined {
    const source = this.simulation?.context?.source as any;
    return source?.centerY ?? source?.y;
  }

  get pointCenterZ(): number | undefined {
    const source = this.simulation?.context?.source as any;
    return source?.centerZ ?? source?.z;
  }

  get apertureHeight(): number {
    return this.simulation.context?.aperture?.height ?? 0;
  }

  get apertureWidth(): number {
    return this.simulation.context?.aperture?.width ?? 0;
  }

  get apertureDepth(): number {
    return this.simulation.context?.aperture?.depth ?? 0;
  }

  get apertureRadius(): number {
    return this.simulation.context?.aperture?.radius ?? 0;
  }

  get sourceHeightValue(): number {
    return this.simulation.context?.source?.height ?? 0;
  }

  get sourceWidthValue(): number {
    return this.simulation.context?.source?.width ?? 0;
  }

  get sourceDepthValue(): number {
    return this.simulation.context?.source?.depth ?? 0;
  }

  get sourceRadiusValue(): number {
    return this.simulation.context?.source?.radius ?? 0;
  }

  private updateCharts(): void {
    const { escaped, emissions } = this.simulation;
    this.chart.updateChartData(escaped, emissions);
  

    this.chartData = { ...this.chart.chartData };
    this.pieChartData = { ...this.chart.pieChartData };

    this.solidAngle = this.simulation.solidAngle ?? 0;
    this.error = this.simulation.solidAngleError ?? 0;
    this.escapedPercent = (this.simulation.escaped / this.simulation.emissions) * 100;

    const seconds = this.extractTotalSeconds(this.simulation.duration);

    this.emissionsPerSecond = this.simulation.emissions / seconds;

  }

  private extractTotalSeconds(timeStr: string): number {
    const regex = /(\d+)\s*min\s*(\d+)\s*sec\s*(\d+)\s*ms/;
    const matches = timeStr.match(regex);
  
    if (matches) {
      const minutes = parseInt(matches[1], 10);
      const seconds = parseInt(matches[2], 10);
      const milliseconds = parseInt(matches[3], 10);
  
      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
      return totalSeconds;
    } else {
      throw new Error('Formato de tempo inválido');
    }
  }

  printReport(){
    window.print();
  }
}
