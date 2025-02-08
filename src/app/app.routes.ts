import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { CollectorDashboardComponent } from './components/collector-dashboard/collector-dashboard.component'; // Importing the component

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'collector-dashboard',
    component: CollectorDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'collection-request',
    loadComponent: () => import('./components/collection-request/collection-request.component').then(m => m.CollectionRequestComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  }
];
