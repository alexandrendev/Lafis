import { Component, OnInit } from '@angular/core';
import { DetalhesSimulacaoComponent } from '../../detalhes-simulacao/detalhes-simulacao.component';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DetalhesSimulacaoComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  simulations: Array<{
    id: string;
    apertureType: string;
    sourceType: string;
    emissions: number;
    status: string;
  }> = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.findRunning()
      .then((simulations) => {
        this.simulations = simulations;
      })
      .catch((error) => {
        console.error('Erro ao buscar simulações:', error);
      });;
  }
}
