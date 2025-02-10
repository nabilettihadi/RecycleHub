import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { logout } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20 items-center">
          <!-- Logo et titre -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center">
              <img src="assets/logo.png" alt="RecycleHub Logo" class="h-12 w-auto mr-4">
              <span class="text-3xl font-bold text-green-600">RecycleHub</span>
            </a>
          </div>

          <!-- Navigation -->
          <div class="flex items-center space-x-6">
            <ng-container *ngIf="user; else authButtons">
              <!-- Menu pour Collecteur -->
              <ng-container *ngIf="user.userType === 'collector'">
                <a routerLink="/collector-dashboard" 
                   class="text-gray-700 hover:text-green-600 transition duration-300 font-medium">
                  Demandes de Collecte
                </a>
              </ng-container>

              <!-- Menu pour Particulier -->
              <ng-container *ngIf="user.userType === 'particular'">
                <div class="flex items-center space-x-4">
                  <a routerLink="/collection-request" 
                     class="text-gray-700 hover:text-green-600 transition duration-300 font-medium 
                            flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Nouvelle Collecte
                  </a>
                  <a routerLink="/dashboard" 
                     class="text-gray-700 hover:text-green-600 transition duration-300 font-medium">
                    Mes Demandes
                  </a>
                  <a routerLink="/points" 
                     class="text-gray-700 hover:text-green-600 transition duration-300 font-medium 
                            flex items-center">
                    <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6 10a1 1 0 011-1h4a1 1 0 110 2H7a1 1 0 01-1-1z"/>
                    </svg>
                    {{ user.points || 0 }} Points
                  </a>
                </div>
              </ng-container>

              <!-- Menu Utilisateur (commun) -->
              <div class="relative group ml-4">
                <button class="flex items-center space-x-2 text-gray-700 hover:text-green-600">
                  <img [src]="getProfileImage(user)" 
                       [alt]="user.firstName"
                       class="h-8 w-8 rounded-full object-cover">
                  <span>{{ user.firstName }}</span>
                </button>
                <div class="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible 
                            group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <a routerLink="/profile" 
                     class="block px-4 py-2 text-gray-800 hover:bg-green-50">
                    Mon Profil
                  </a>
                  <hr class="my-2">
                  <button (click)="onLogout()" 
                          class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                    Déconnexion
                  </button>
                </div>
              </div>
            </ng-container>

            <!-- Template pour utilisateur non connecté -->
            <ng-template #authButtons>
              <a routerLink="/login" 
                 class="text-gray-700 hover:text-green-600 transition duration-300 font-medium">
                Connexion
              </a>
              <a routerLink="/register" 
                 class="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300">
                Inscription
              </a>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Input() user: User | null = null;
  
  constructor(private store: Store) {}

  getProfileImage(user: User): string {
    if (user.profilePicture) {
      return user.profilePicture;
    }
    return user.userType === 'collector' 
      ? 'assets/images/recycling-illustration.svg'
      : 'assets/default-avatar.png';
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
} 