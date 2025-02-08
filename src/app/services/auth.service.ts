import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { LoginForm, RegisterForm } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'recyclehub_users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor() {
    this.initializeUsers();
  }

  private initializeUsers() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const defaultUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'collector@example.com',
          password: 'password123',
          phoneNumber: '0612345678',
          address: {
            street: '123 Main St',
            city: 'Casablanca',
            zipCode: '20000'
          },
          dateOfBirth: new Date('1990-01-01'),
          role: 'collector',
          points: 0
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers));
    }
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
      role: 'particular',
      points: 0
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return of(newUser);
  }

  login(email: string, password: string): Observable<User | null> {
    const users: User[] = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    return of(user || null);
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

  deleteAccount(userId: string): Observable<void> {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    users.splice(userIndex, 1);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.removeItem(this.CURRENT_USER_KEY);
    
    return of(void 0);
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }
}
