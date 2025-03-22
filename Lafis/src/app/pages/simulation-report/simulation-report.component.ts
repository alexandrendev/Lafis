import { Component, OnInit } from '@angular/core';
import { Simulation } from '../../entity/Simulation';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../service/api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simulation-report',
  imports: [InfoItemComponent, CommonModule],
  templateUrl: './simulation-report.component.html',
  styleUrl: './simulation-report.component.scss'
})
export class SimulationReportComponent implements OnInit{
  simulation!: Simulation;

  constructor(private route: ActivatedRoute, private api: ApiService){
  }

  ngOnInit(): void{    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.findById(id)
        .then(simulation => {
          this.simulation = simulation;
          console.log('Simulação carregada:', this.simulation);
        })
        .catch(error => {
          console.error('Erro ao carregar simulação:', error);
        });
    } else {
      console.error('ID da simulação não encontrado na URL.');
    }

    console.log(id);
  }
}
