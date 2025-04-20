import { Component, inject } from '@angular/core';
import { Simulation } from '../../entity/Simulation';
import { ApiService } from '../../service/api/api.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public simulations!: Simulation[];
  api = inject(ApiService);
  finishedSimulations!: number;

  getSimulations(){
    this.api.getAllSimulations().subscribe({
      next: (simulations: Simulation[]) => {
        this.simulations = simulations;
        this.finishedSimulations = this.getFinishedSimulations().length;
      }
    });
  }

  ngOnInit() {
    this.getSimulations();
  }

  getFinishedSimulations(){
    return this.simulations.filter((simulation) => simulation.status === 'FINISHED');
  }
  
}
