import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-item',
  imports: [],
  templateUrl: './video-item.component.html',
  styleUrl: './video-item.component.scss'
})
export class VideoItemComponent {
  @Input() title!: string;
  @Input() source!: string;
}
