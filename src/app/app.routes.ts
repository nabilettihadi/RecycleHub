import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { collectorGuard } from './guards/collector.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'collector-dashboard',
    loadComponent: () => import('./components/collector-dashboard/collector-dashboard.component')
      .then(m => m.CollectorDashboardComponent),
    canActivate: [authGuard, collectorGuard]
  },
  { 
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'collection-request',
    loadComponent: () => import('./components/collection-request/collection-request.component')
      .then(m => m.CollectionRequestComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'points',
    loadComponent: () => import('./components/points/points.component')
      .then(m => m.PointsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'collector-profile',
    loadComponent: () => import('./components/collector-profile/collector-profile.component')
      .then(m => m.CollectorProfileComponent),
    canActivate: [authGuard, collectorGuard]
  }
];
