import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/api/account/auth.service';
import { NotificationService } from '../../../service/notification.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  error: string | null = null;
  fb = inject(FormBuilder);
  router = inject(Router);
  api = inject(AuthService);
  notificationService = inject(NotificationService);

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.minLength(8)])
  });


  passwordMatchValidator(form: any) {
    return form.get('password').value === form.get('confirmPassword').value 
      ? null : { mismatch: true };
  }

  onRegister() {
    if (this.registerForm.valid) {
      const {email, password} = this.registerForm.value as { email: string, password: string };
      this.api.register(email, password).subscribe({
        next: () => {
          this.notificationService.showAlert("Conta registrada com sucesso!", ()=>{
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          this.notificationService.showAlert('Erro: ' + error);
        }
      });
      console.log('Dados de registro:', this.registerForm.value);
    }
  }
}
