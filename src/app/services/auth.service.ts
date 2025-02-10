import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { LoginForm, RegisterForm } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly COLLECTORS_KEY = 'collectors';

  constructor() {
    this.initializeDefaultUsers();
    this.initializeCollectors();
  }

  private initializeDefaultUsers(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'admin@recyclehub.ma',
          password: 'password123', // En production, utiliser un hash
          firstName: 'Admin',
          lastName: 'System',
          phoneNumber: '0600000000',
          dateOfBirth: new Date('1990-01-01'),
          address: {
            street: '123 Rue Mohammed V',
            city: 'Casablanca',
            postalCode: '20000', // Changé ici
            country: 'Maroc'
          },
          userType: 'collector',
          points: 0
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  private initializeCollectors() {
    if (!localStorage.getItem(this.COLLECTORS_KEY)) {
      const defaultCollectors = [
        {
          id: 'collector1',
          email: 'collector1@recyclehub.ma',
          firstName: 'Ahmed',
          lastName: 'Alami',
          userType: 'collector',
          city: 'Casablanca'
        },
        {
          id: 'collector2',
          email: 'collector2@recyclehub.ma',
          firstName: 'Karim',
          lastName: 'Bennani',
          userType: 'collector',
          city: 'Rabat'
        }
      ];
      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(defaultCollectors));
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

  login({ email, password }: LoginForm): Observable<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return of(user).pipe(delay(1000)); // Simulate API delay
    }

    return throwError(() => new Error('Invalid email or password'));
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
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
}
