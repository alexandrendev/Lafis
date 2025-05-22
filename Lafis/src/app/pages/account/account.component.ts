import { Component } from '@angular/core';
import { InfoItemComponent } from '../../components/info-item/info-item.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-account',
  imports: [InfoItemComponent, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  created!: string;
  email!: string;

  AccountComponent(){

  }

  public requestPasswordReset(){
    alert('Deseja alterar sua senha?');
  }
}
