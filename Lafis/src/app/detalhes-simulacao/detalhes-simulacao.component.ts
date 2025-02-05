import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalhes-simulacao',
  imports: [],
  templateUrl: './detalhes-simulacao.component.html',
  styleUrl: './detalhes-simulacao.component.scss'
})
export class DetalhesSimulacaoComponent {
  @Input() id?: string;
  @Input() apertureType?: string;
  @Input() sourceType?: string;
  @Input() emissions?: number;
  @Input() status?: string;

  constructor() {
  }

}
