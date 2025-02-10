import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { CollectorDashboardComponent } from './components/collector-dashboard/collector-dashboard.component'; // Importing the component
import { PointsManagementComponent } from './components/points/points-management.component';
import { collectorGuard } from './guards/collector.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'collector-dashboard',
    component: CollectorDashboardComponent,
    canActivate: [authGuard, collectorGuard]
  },
  { 
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
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
  },
  {
    path: 'points',
    component: PointsManagementComponent,
    canActivate: [authGuard]
  }
];
