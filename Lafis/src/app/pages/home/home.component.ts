import { Component, inject } from '@angular/core';
import { Simulation } from '../../entity/Simulation';
import { ApiService } from '../../service/api/api.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoItemComponent } from '../../components/video-item/video-item.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, VideoItemComponent],
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
