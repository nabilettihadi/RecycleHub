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

  constructor() {
    this.initializeCollectors();
  }

  private initializeCollectors(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const collectors: User[] = [
        {
          id: '1',
          email: 'collector1@recyclehub.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          address: {
            street: '123 Green Street',
            city: 'Casablanca',
            zipCode: '20000'
          },
          phoneNumber: '0600000001',
          dateOfBirth: new Date('1990-01-01'),
          userType: 'collector',
          points: 0
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(collectors));
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
}
