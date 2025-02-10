import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../../store/auth/auth.actions';
import { User } from '../../../models/user.model';
import { DEFAULT_AVATAR_URL } from '../../../shared/constants';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo et liens de navigation -->
          <div class="flex items-center">
            <a routerLink="/" class="text-2xl font-bold text-green-600">RecycleHub</a>
            
            <div class="ml-10 flex space-x-8">
              <a routerLink="/dashboard" 
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Tableau de bord
              </a>
              <a routerLink="/collection-request" 
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Demande de collecte
              </a>
              <a routerLink="/points" 
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Mes points
              </a>
            </div>
          </div>

          <!-- Profil et déconnexion -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center" *ngIf="user">
              <!-- Photo de profil -->
              <img [src]="user.profilePicture || defaultAvatarUrl"
                   [alt]="user.firstName"
                   class="h-10 w-10 rounded-full">
              <span class="ml-2 text-sm text-gray-700">{{ user.points }} points</span>
            </div>
            
            <button routerLink="/profile" 
                    class="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700">
              Mon Profil
            </button>
            
            <button (click)="onLogout()" 
                    class="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Input() user: User | null = null;
  private store = inject(Store);
  defaultAvatarUrl = DEFAULT_AVATAR_URL;

  onLogout(): void {
    this.store.dispatch(logout());
  }
} 