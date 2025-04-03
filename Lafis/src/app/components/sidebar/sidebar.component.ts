import { Component, inject } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  notificationService = inject(NotificationService);
  router = inject(Router);

  public logout(){
    this.notificationService.showAlert('Você está saindo da sua conta. Clique em OK para confirmar esta ação.', ()=>{
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });  
  }
}
