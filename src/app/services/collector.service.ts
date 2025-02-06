import { Injectable } from '@angular/core';
import { User } from '../auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private readonly COLLECTORS_KEY = 'recyclehub_collectors';

  constructor() {
    this.initializeCollectors();
  }

  private initializeCollectors() {
    if (!localStorage.getItem(this.COLLECTORS_KEY)) {
      const collectors: User[] = [
        {
          email: 'collector1@recyclehub.com',
          password: 'password123',
          firstName: 'Mohammed',
          lastName: 'Alami',
          address: 'Casablanca, Maarif',
          phone: '0612345678',
          birthDate: new Date('1990-01-01'),
          role: 'collecteur'
        },
        {
          email: 'collector2@recyclehub.com',
          password: 'password123',
          firstName: 'Ahmed',
          lastName: 'Benani',
          address: 'Rabat, Agdal',
          phone: '0623456789',
          birthDate: new Date('1988-05-15'),
          role: 'collecteur'
        },
        {
          email: 'collector3@recyclehub.com',
          password: 'password123',
          firstName: 'Karim',
          lastName: 'Idrissi',
          address: 'Marrakech, Guéliz',
          phone: '0634567890',
          birthDate: new Date('1992-08-20'),
          role: 'collecteur'
        }
      ];
      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(collectors));
    }
  }

  getCollectors(): User[] {
    return JSON.parse(localStorage.getItem(this.COLLECTORS_KEY) || '[]');
  }
}
