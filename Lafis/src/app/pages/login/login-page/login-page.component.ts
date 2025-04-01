import { Component, inject, Inject } from '@angular/core';
import { AuthService } from '../../../service/api/account/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm: FormGroup = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  error: string = '';

  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  onLogin(){
    this._authService.login(this.loginForm.value.login, this.loginForm.value.password)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this._router.navigate(['/home']);
      },
      error: (error: any) => {
        this.error = 'Erro ao realizar login. Confira suas credenciais e tente novamente.';
      }
    });
  }
  
}
