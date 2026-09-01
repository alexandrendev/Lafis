import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { Simulation } from '../../entity/Simulation';
import { interval } from 'rxjs';
import { TranslationServiceService } from '../../service/helpers/translation-service.service';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  simulations: Simulation[] = [];
  selectedSimulation!: Simulation;
  isLoading: { [key: string]: boolean } = {};
  isComparisonMode = false;
  selectedSimulationIds = new Set<string>();

  private readonly api = new ApiService();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    public translationService: TranslationServiceService
  ) {}

  openReport(id: string){
    if (this.isComparisonMode) {
      this.toggleSelection(id);
      return;
    }
    this.router.navigate(['/report', id]);
  }

  onCardKeydown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openReport(id);
    }
  }

  getApertureType(simulation: Simulation): string | undefined {
    return simulation?.context?.aperture?.type;
  }

  getSourceType(simulation: Simulation): string | undefined {
    return simulation?.context?.source?.type;
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() ?? 'created';
  }

  isComparable(simulation: Simulation): boolean {
    return simulation.status === 'FINISHED';
  }

  isSelected(id: string): boolean {
    return this.selectedSimulationIds.has(id);
  }

  toggleComparisonMode(): void {
    this.isComparisonMode = !this.isComparisonMode;
    this.selectedSimulationIds.clear();
  }

  toggleSelection(id: string): void {
    const simulation = this.simulations.find(item => item.id === id);
    if (!simulation || !this.isComparable(simulation)) {
      return;
    }
    if (this.selectedSimulationIds.has(id)) {
      this.selectedSimulationIds.delete(id);
    } else if (this.selectedSimulationIds.size < 6) {
      this.selectedSimulationIds.add(id);
    } else {
      this.notificationService.showAlert('Você pode comparar até seis simulações por vez.');
      return;
    }
    this.selectedSimulationIds = new Set(this.selectedSimulationIds);
  }

  compareSelected(): void {
    if (this.selectedSimulationIds.size < 2) {
      return;
    }
    this.router.navigate(['/compare'], { queryParams: { ids: [...this.selectedSimulationIds].join(',') } });
  }

  startSimulation(event: Event, simulationId: string): void {
    event.stopPropagation();

    if (this.isLoading[simulationId]) {
      this.notificationService.showAlert("A simulação já está em andamento.");
      return;
    }

    this.isLoading[simulationId] = true;

    this.api.startSimulation(simulationId).subscribe({
      next: () => {
          this.notificationService.showAlert("Simulação iniciada com sucesso!");
          this.ngOnInit();
      },
      // error: (error) => {
      //   this.notificationService.showAlert("Falha ao iniciar a simulação.", error);
      //   console.error("Falha ao iniciar a simulação:", error);
      // }
    });
  }

  showNotification(){
    this.notificationService.showAlert("Você ainda não possui nenhuma simulação. Deseja criar uma?", () => {
      this.router.navigate(['/new']);
    });
  }

  ngOnInit(): void {
    this.api.getAllSimulations().subscribe({
      next: (simulations: Simulation[]) => {
        this.simulations = simulations;
        // if (this.simulations.length < 1) {
        //   this.showNotification();
        // }
      },
      error: (error: any) => {
        console.error('Erro ao buscar simulações:', error);
      }
    });
    interval(60000).subscribe(() => {
      this.api.getAllSimulations().subscribe({
        next: (simulations: Simulation[]) => {
          this.simulations = simulations;
        },
        error: (error: any) => {
          console.error('Erro ao buscar simulações:', error);
        }
      });
    }
    );
  }
}
