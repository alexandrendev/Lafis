import { Component, HostListener, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ApiService } from '../../service/api/api.service';
import { Simulation } from '../../entity/Simulation';
import { TranslationServiceService } from '../../service/helpers/translation-service.service';

interface ConfigurationRow {
  label: string;
  values: string[];
  differs: boolean;
}

interface ConfigurationGroup {
  title: string;
  rows: ConfigurationRow[];
}

interface ComparisonExtremes {
  lower: Simulation;
  lowerIndex: number;
  higher: Simulation;
  higherIndex: number;
}

@Component({
  selector: 'app-simulation-comparison',
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './simulation-comparison.component.html',
  styleUrl: './simulation-comparison.component.scss'
})
export class SimulationComparisonComponent implements OnInit {
  simulations: Simulation[] = [];
  configurationGroups: ConfigurationGroup[] = [];
  configurationChanges: string[] = [];
  showEqualParameters = false;
  readonly barChartType: 'bar' = 'bar';
  readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    locale: 'pt-BR',
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };
  solidAngleChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  efficiencyChartData: ChartData<'bar'> = { labels: [], datasets: [] };

  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  readonly translationService = inject(TranslationServiceService);
  private readonly colors = ['#1f6b3b', '#315a96', '#b96d16', '#7c3f89', '#0f766e', '#9f1239'];

  ngOnInit(): void {
    const ids = (this.route.snapshot.queryParamMap.get('ids') ?? '').split(',').filter(Boolean).slice(0, 6);
    if (ids.length < 2) return;

    this.api.getAllSimulations().subscribe((simulations: Simulation[]) => {
      this.simulations = ids
        .map(id => simulations.find(simulation => simulation.id === id))
        .filter((simulation): simulation is Simulation => !!simulation && simulation.status === 'FINISHED');
      this.buildConfigurationGroups();
      this.updateCharts();
    });
  }

  solidAngle(simulation: Simulation): number { return simulation.solidAngle ?? 0; }
  solidAngleInPi(simulation: Simulation): number { return this.solidAngle(simulation) / Math.PI; }
  efficiency(simulation: Simulation): number { return simulation.emissions ? (simulation.escaped / simulation.emissions) * 100 : 0; }
  label(simulation: Simulation, index: number): string { return `S${index + 1}`; }
  displayName(simulation: Simulation, index: number): string { return simulation.name?.trim() || this.label(simulation, index); }
  apertureType(simulation: Simulation): string { return simulation.apertureType?.toLowerCase() ?? simulation.context?.aperture?.type ?? '-'; }
  sourceType(simulation: Simulation): string { return simulation.sourceType?.toLowerCase() ?? simulation.context?.source?.type ?? '-'; }
  visibleRows(group: ConfigurationGroup): ConfigurationRow[] { return this.showEqualParameters ? group.rows : group.rows.filter(row => row.differs); }
  colorFor(index: number): string { return this.colors[index] ?? this.colors[0]; }

  comparisonExtremes(): ComparisonExtremes {
    const ordered = this.simulations
      .map((simulation, index) => ({ simulation, index }))
      .sort((a, b) => this.solidAngle(a.simulation) - this.solidAngle(b.simulation));
    const lower = ordered[0];
    const higher = ordered[ordered.length - 1];
    return { lower: lower.simulation, lowerIndex: lower.index, higher: higher.simulation, higherIndex: higher.index };
  }

  solidAngleDifference(): number {
    const { lower, higher } = this.comparisonExtremes();
    return this.solidAngle(higher) - this.solidAngle(lower);
  }

  relativeSolidAngleDifference(): number | null {
    const { lower } = this.comparisonExtremes();
    return this.solidAngle(lower) > 0 ? (this.solidAngleDifference() / this.solidAngle(lower)) * 100 : null;
  }

  extremesOverlapAt95Percent(): boolean {
    const { lower, higher } = this.comparisonExtremes();
    const combinedMargin = (lower.solidAngleError ?? 0) + (higher.solidAngleError ?? 0);
    return this.solidAngleDifference() <= combinedMargin;
  }

  combinedConfidenceMargin(): number {
    const { lower, higher } = this.comparisonExtremes();
    return (lower.solidAngleError ?? 0) + (higher.solidAngleError ?? 0);
  }

  apertureSummary(simulation: Simulation): string {
    const aperture = simulation.context?.aperture;
    const dimensions = aperture?.radius !== undefined
      ? `R ${this.withUnit(aperture.radius)}`
      : `${this.withUnit(aperture?.width)} × ${this.withUnit(aperture?.depth)}`;
    return `${this.withUnit(aperture?.height)} de altura · ${dimensions}`;
  }

  sourceSummary(simulation: Simulation): string {
    const source = simulation.context?.source;
    const position = `(${this.withUnit(source?.centerX ?? source?.x)}, ${this.withUnit(source?.centerY ?? source?.y)}, ${this.withUnit(source?.centerZ ?? source?.z)})`;
    const dimension = source?.radius !== undefined
      ? `R ${this.withUnit(source.radius)}`
      : source?.height !== undefined
        ? `${this.withUnit(source.height)} × ${this.withUnit(source.width)} × ${this.withUnit(source.depth)}`
        : 'sem dimensões';
    return `${dimension} · centro ${position}`;
  }

  printComparison(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document.body.classList.add('printing-comparison');
    this.addComparisonPrintPageRule();
    requestAnimationFrame(() => setTimeout(() => window.print(), 100));
  }

  @HostListener('window:afterprint')
  onAfterPrint(): void {
    document.body.classList.remove('printing-comparison');
    document.getElementById('comparison-print-page-rule')?.remove();
  }

  private buildConfigurationGroups(): void {
    const row = (label: string, value: (simulation: Simulation) => string): ConfigurationRow => {
      const values = this.simulations.map(value);
      return { label, values, differs: new Set(values).size > 1 };
    };
    const aperture = (simulation: Simulation) => simulation.context?.aperture;
    const source = (simulation: Simulation) => simulation.context?.source;

    this.configurationGroups = [
      {
        title: 'Abertura',
        rows: [
          row('Tipo', simulation => this.translationService.translateApertureType(this.apertureType(simulation))),
          row('Altura do poço', simulation => this.withUnit(aperture(simulation)?.height)),
          row('Raio', simulation => this.withUnit(aperture(simulation)?.radius)),
          row('Largura', simulation => this.withUnit(aperture(simulation)?.width)),
          row('Profundidade', simulation => this.withUnit(aperture(simulation)?.depth))
        ]
      },
      {
        title: 'Fonte',
        rows: [
          row('Tipo', simulation => this.translationService.translateSourceType(this.sourceType(simulation))),
          row('Centro X', simulation => this.withUnit(source(simulation)?.centerX ?? source(simulation)?.x)),
          row('Centro Y', simulation => this.withUnit(source(simulation)?.centerY ?? source(simulation)?.y)),
          row('Centro Z', simulation => this.withUnit(source(simulation)?.centerZ ?? source(simulation)?.z)),
          row('Raio', simulation => this.withUnit(source(simulation)?.radius)),
          row('Altura', simulation => this.withUnit(source(simulation)?.height)),
          row('Largura', simulation => this.withUnit(source(simulation)?.width)),
          row('Profundidade', simulation => this.withUnit(source(simulation)?.depth))
        ]
      },
      {
        title: 'Execução',
        rows: [
          row('Emissões', simulation => new Intl.NumberFormat('pt-BR').format(simulation.emissions)),
          row('Duração', simulation => simulation.duration || '-')
        ]
      }
    ];
    this.configurationChanges = this.configurationGroups
      .filter(group => group.title !== 'Execução')
      .flatMap(group => group.rows.filter(row => row.differs).map(row => `${group.title}: ${row.label}`));
  }

  private withUnit(value: number | undefined): string {
    return value === undefined ? '—' : `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(value)} cm`;
  }

  private addComparisonPrintPageRule(): void {
    document.getElementById('comparison-print-page-rule')?.remove();
    const style = document.createElement('style');
    style.id = 'comparison-print-page-rule';
    style.textContent = '@page { size: A4 landscape; margin: 10mm; }';
    document.head.appendChild(style);
  }

  private updateCharts(): void {
    const labels = this.simulations.map((simulation, index) => this.label(simulation, index));
    const colors = this.simulations.map((_, index) => this.colors[index]);
    this.solidAngleChartData = {
      labels,
      datasets: [{ label: 'Ângulo sólido (sr)', data: this.simulations.map(simulation => this.solidAngle(simulation)), backgroundColor: colors, borderRadius: 6 }]
    };
    this.efficiencyChartData = {
      labels,
      datasets: [{ label: 'Vazão (%)', data: this.simulations.map(simulation => this.efficiency(simulation)), backgroundColor: colors, borderRadius: 6 }]
    };
  }
}
