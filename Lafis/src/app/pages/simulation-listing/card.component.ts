import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { SimulacaoDetailModalComponent } from '../../pages/simulacao-detail-modal/simulacao-detail-modal.component';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { Simulation } from '../../entity/Simulation';

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

  constructor(private api: ApiService, private notificationService: NotificationService, private router: Router) {}

  openReport(id: String){
    this.router.navigate(['/teste', id]);
  }

  async startSimulation(simulationId: string): Promise<void>{

    if (this.isLoading[simulationId]) {
      this.notificationService.showAlert("A simulação já está em andamento.");
      return;
    }

    this.isLoading[simulationId] = true;

    try {
      const result = await this.api.startSimulation(simulationId);
      if(result){
        this.notificationService.showAlert("Simulação iniciada com sucesso!");
        this.ngOnInit();
      }
    } catch (error) {
      this.notificationService.showAlert("Falha ao iniciar a simulação.");
    } finally {
      this.isLoading[simulationId] = false;
    }
  }

  showNotification(){
    this.notificationService.showAlert("Você ainda não possui nenhuma simulação. Deseja criar uma?", () => {
      this.router.navigate(['/new']);
    });
  }

  ngOnInit(): void {
    this.api
      .getAllSimulations()
      .then((simulations) => {
        this.simulations = simulations;
        if (this.simulations.length < 1) {
          this.showNotification();
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar simulações:', error);
      });
  }
}

