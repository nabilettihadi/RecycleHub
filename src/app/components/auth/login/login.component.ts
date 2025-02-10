import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink, RouterModule } from '@angular/router';
import * as AuthActions from '../../../store/auth/auth.actions';
import { selectAuthState, selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  
  loginForm: FormGroup;
  loading$ = this.store.select(state => selectAuthState(state).loading);
  error$ = this.store.select(state => selectAuthState(state).error);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Pour le développement, pré-remplir les champs
    this.loginForm.patchValue({
      email: 'collector1@recyclehub.ma',
      password: 'password123'
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Tentative de connexion avec:', { email, password }); // Pour déboguer
      this.store.dispatch(AuthActions.login({ email, password }));
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}