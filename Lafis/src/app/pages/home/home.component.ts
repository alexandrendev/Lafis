import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { Simulation } from '../../entity/Simulation';
import { TranslationServiceService } from '../../service/helpers/translation-service.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  simulations: Simulation[] = [];
  isLoading = true;

  private readonly api = inject(ApiService);
  readonly translationService = inject(TranslationServiceService);

  ngOnInit(): void {
    this.api.getAllSimulations().subscribe({
      next: simulations => { this.simulations = simulations; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  get runningSimulations(): Simulation[] { return this.simulations.filter(simulation => simulation.status === 'RUNNING'); }
  get recentSimulations(): Simulation[] { return this.simulations.slice(0, 4); }
  get comparisonCandidates(): Simulation[] { return this.simulations.filter(simulation => simulation.status === 'FINISHED').slice(0, 2); }
  get comparisonIds(): string { return this.comparisonCandidates.map(simulation => simulation.id).join(','); }
  displayName(simulation: Simulation): string { return simulation.name?.trim() || 'Simulação sem nome'; }
  apertureType(simulation: Simulation): string { return simulation.apertureType ?? simulation.context?.aperture?.type ?? '-'; }
  sourceType(simulation: Simulation): string { return simulation.sourceType ?? simulation.context?.source?.type ?? '-'; }
}
