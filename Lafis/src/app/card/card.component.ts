import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  id: string = 'id teste';
  apertureType: string = 'abertura';
  sourceType: string = 'fonte';
  emissions: number = 219093;
}
