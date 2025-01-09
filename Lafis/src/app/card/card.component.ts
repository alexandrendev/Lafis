import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
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
  }> = [];

  constructor(private api: ApiService) {}

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
