import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-item',
  imports: [],
  templateUrl: './info-item.component.html',
  styleUrl: './info-item.component.scss'
})
export class InfoItemComponent {

  @Input() label!: String;
  @Input() value!: any;
}
