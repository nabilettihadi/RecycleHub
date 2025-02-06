import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { register } from '../../../store/auth/auth.actions';
import { selectAuthState } from '../../../store/auth/auth.selectors';
import { RegisterForm } from '../../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  registerForm: FormGroup;
  selectedFile: File | null = null;
  loading$ = this.store.select(state => selectAuthState(state).loading);
  error$ = this.store.select(state => selectAuthState(state).error);
  imagePreview: string | null = null;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dateOfBirth: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      userType: ['particular', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Preview the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      
      // Créer l'objet RegisterForm avec les données du formulaire
      const registerData: RegisterForm = {
        ...formValue,
        dateOfBirth: new Date(formValue.dateOfBirth), // Convertir la string en Date
        profilePicture: undefined // Sera mis à jour si une image est sélectionnée
      };

      // Si une image est sélectionnée, la convertir en base64
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          registerData.profilePicture = reader.result as string;
          this.store.dispatch(register({ user: registerData }));
        };
        reader.readAsDataURL(this.selectedFile);
      } else {
        this.store.dispatch(register({ user: registerData }));
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}