import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
      
      console.log('Dados de registro:', this.registerForm.value);
      this.router.navigate(['/login']);
    }
  }
}
