import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDialogComponent } from '../components/notification-dialog/notification-dialog.component';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private dialog: MatDialog) { }

  showAlert(message: string, callback?: () => void): void {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '300px',
      data: { message }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok' && callback) {
        callback();
      }
    });
  }
}
