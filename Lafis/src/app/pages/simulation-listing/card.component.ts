import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { SimulacaoDetailModalComponent } from '../../pages/simulacao-detail-modal/simulacao-detail-modal.component';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { Simulation } from '../../entity/Simulation';
import { interval } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [CommonModule, InfoItemComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  simulations: Simulation[] = [];
  selectedSimulation!: Simulation;
  isLoading: { [key: string]: boolean } = {};

  private readonly api = new ApiService();

  constructor(private notificationService: NotificationService, private router: Router) {}

  openReport(id: String){
    this.router.navigate(['/report', id]);
  }

  async startSimulation(simulationId: string): Promise<void>{

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

