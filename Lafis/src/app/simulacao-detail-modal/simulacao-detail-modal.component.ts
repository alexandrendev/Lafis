import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-simulacao-detail-modal',
  imports: [CommonModule],
  templateUrl: './simulacao-detail-modal.component.html',
  styleUrl: './simulacao-detail-modal.component.scss'
})
export class SimulacaoDetailModalComponent {
  @Input() selectedSimulation: any;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
