import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-dialog',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, action?: () => void }
  ) {}
}
