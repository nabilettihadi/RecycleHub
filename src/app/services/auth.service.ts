import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { LoginForm, RegisterForm } from '../models/auth.model';
import { Collector } from '../models/auth.model';
import { CollectionRequest } from '../models/collection-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly COLLECTORS_KEY = 'collectors';
  private readonly INITIALIZED_KEY = 'app_initialized';

  constructor() {
    // Initialiser les données seulement si ce n'est pas déjà fait
    if (!localStorage.getItem(this.INITIALIZED_KEY)) {
      this.initializeDefaultData();
      localStorage.setItem(this.INITIALIZED_KEY, 'true');
    }
  }

  private initializeDefaultData(): void {
    // Initialiser les collecteurs seulement s'ils n'existent pas
    if (!localStorage.getItem(this.COLLECTORS_KEY)) {
      const defaultCollectors: Collector[] = [
        {
          id: '1',
          email: 'collector1@recyclehub.ma',
          password: 'password123',
          firstName: 'Ahmed',
          lastName: 'Alami',
          phoneNumber: '0600000001',
          userType: 'collector',
          dateOfBirth: new Date('1990-01-01'),
          address: {
            street: '123 Rue Mohammed V',
            city: 'Casablanca',
            postalCode: '20000',
            country: 'Maroc'
          },
          points: 0
        }
      ];
      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(defaultCollectors));
    }

    // Initialiser les utilisateurs seulement s'ils n'existent pas
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: User[] = [];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }

    // Initialiser les demandes de collecte seulement si elles n'existent pas
    if (!localStorage.getItem('collection_requests')) {
      localStorage.setItem('collection_requests', JSON.stringify([]));
    }

    // Initialiser l'historique des points seulement s'il n'existe pas
    if (!localStorage.getItem('points_history')) {
      localStorage.setItem('points_history', JSON.stringify([]));
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  register(registerData: RegisterForm): Observable<User> {
    const users = this.getUsers();
    const existingUser = users.find(u => u.email === registerData.email);

    if (existingUser) {
      return throwError(() => new Error('Email already exists'));
    }

    const newUser: User = {
      ...registerData,
      id: Date.now().toString(),
      userType: 'particular',
      points: 0
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return of(newUser);
  }

  login(email: string, password: string): Observable<User> {
    console.log('Tentative de connexion avec:', { email, password });
    
    // Vérifier d'abord dans les collecteurs
    const collectors = JSON.parse(localStorage.getItem(this.COLLECTORS_KEY) || '[]') as Collector[];
    console.log('Collecteurs trouvés:', collectors);
    
    // Vérification stricte des identifiants
    const collector = collectors.find(c => {
      const emailMatch = c.email.toLowerCase() === email.toLowerCase();
      const passwordMatch = c.password === password;
      console.log('Vérification:', { 
        email, 
        storedEmail: c.email, 
        emailMatch,
        passwordMatch 
      });
      return emailMatch && passwordMatch;
    });
    
    console.log('Collecteur trouvé:', collector);
    
    if (collector) {
      const userCollector: User = {
        ...collector,
        points: 0,
        pointsHistory: [],
      };
      console.log('Conversion en User:', userCollector);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userCollector));
      return of(userCollector).pipe(delay(500));
    }

    // Sinon vérifier dans les particuliers
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]') as User[];
    const user = users.find((u: User) => u.email === email && u.password === password);

    if (user) {
      console.log('Utilisateur particulier trouvé:', user);
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return of(user).pipe(delay(500));
    }

    console.log('Aucun utilisateur trouvé');
    return throwError(() => new Error('Identifiants invalides'));
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  isAuthenticated(): boolean {
    const isAuth = !!localStorage.getItem(this.CURRENT_USER_KEY);
    console.log('État d\'authentification:', isAuth);
    return isAuth;
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    const user = userJson ? JSON.parse(userJson) : null;
    console.log('Utilisateur actuel:', user);
    return user;
  }

  updateProfile(userId: string, userData: Partial<User>): Observable<User> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    if (updatedUser.id === JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY) || '{}').id) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    return of(updatedUser);
  }

  updateUser(updatedUser: User): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index === -1) return false;
    
    users[index] = updatedUser;
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return true;
  }

  deleteAccount(userId: string): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const userIndex = users.findIndex((u: User) => u.id === userId);
    
    if (userIndex === -1) {
      return throwError(() => new Error('Utilisateur non trouvé'));
    }
    
    users.splice(userIndex, 1);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.removeItem(this.CURRENT_USER_KEY);
    return of(true);
  }

  validateAge(dateOfBirth: Date): boolean {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  }

  resetStorage(): void {
    // Ne réinitialiser que si explicitement demandé (par exemple pour le développement)
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données ?')) {
      localStorage.clear();
      this.initializeDefaultData();
      console.log('Storage réinitialisé');
    }
  }
}
