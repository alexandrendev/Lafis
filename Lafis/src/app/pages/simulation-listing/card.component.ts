import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';
import { SimulacaoDetailModalComponent } from '../../pages/simulacao-detail-modal/simulacao-detail-modal.component';
import { InfoItemComponent } from '../../components/info-item/info-item.component';

@Component({
  selector: 'app-card',
  imports: [CommonModule, SimulacaoDetailModalComponent, InfoItemComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  simulations: Simulation[] = [];
  selectedSimulation!: Simulation;
  isModalOpen: boolean = false;

  constructor(private api: ApiService) {}

  openModal(simulation: any) {
    this.selectedSimulation = simulation;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  startSimulation(simulationId: string){
    this.api.startSimulation(simulationId);
  }

  ngOnInit(): void {
    this.api
      .getAllSimulations()
      .then((simulations) => {
        this.simulations = simulations;
      })
      .catch((error) => {
        console.error('Erro ao buscar simulações:', error);
      });
  }
}

export interface Simulation {
  id: string;
  context: {
    aperture: {
      type: string;
      radius: number;
      depth: number;
    };
    source: {
      type: string;
      radius: number;
      height: number;
      width: number;
      depth: number;
    };
  };
  emissions: number;
  sourceHeight: number;
  escaped: number;
  status: string;
  created: any;
}
