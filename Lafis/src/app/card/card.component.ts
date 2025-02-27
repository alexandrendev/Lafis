import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
import { SimulacaoDetailModalComponent } from '../simulacao-detail-modal/simulacao-detail-modal.component';

@Component({
  selector: 'app-card',
  imports: [CommonModule, SimulacaoDetailModalComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  simulations: Simulation[] = [];
  selectedSimulation: any = null;
  isModalOpen: boolean = false;

  constructor(private api: ApiService) {}

  openModal(simulation: any) {
    this.selectedSimulation = simulation;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
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

interface Simulation {
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
}
