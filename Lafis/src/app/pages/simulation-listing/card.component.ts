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

  constructor(private api: ApiService, private notificationService: NotificationService, private router: Router) {}

  openReport(id: String){
    this.router.navigate(['/teste', id]);
  }

  startSimulation(simulationId: string){
    this.api.startSimulation(simulationId);
    this.notificationService.showAlert("Simulação Iniciada com Sucesso!");
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

