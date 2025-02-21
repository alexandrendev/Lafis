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
  simulations: Array<{
    id: string;
    apertureType: string;
    sourceType: string;
    emissions: number;
    status: string;
    escaped: number;
  }> = [];
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
