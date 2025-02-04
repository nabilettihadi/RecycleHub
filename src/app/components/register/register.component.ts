import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterForm } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      profilePicture: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    const formValue: RegisterForm = {
      ...this.registerForm.value,
      address: this.registerForm.value.address!,
      dateOfBirth: new Date(this.registerForm.value.dateOfBirth!)
    } as RegisterForm;

    this.authService.register(formValue).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Redirection...';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.message || 'Une erreur est survenue';
        this.successMessage = '';
      }
    });
  }
}
