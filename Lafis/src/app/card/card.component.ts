import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit{

  id: string = 'id teste';
  apertureType: string = 'abertura';
  sourceType: string = 'fonte';
  emissions: number = 219093;
  status: string = 'Rodando'

  simulations:any[] = [];

  constructor(private api: ApiService){}

  ngOnInit(): void {    
    this.api.getAllSimulations().subscribe(
     (data)=>{
      this.simulations = data;
     },
     (error) => {
      console.error('Erro ao carregar simulações', error);
    }
    );

    console.log(this.simulations);
  }

}
