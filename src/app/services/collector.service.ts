import { Injectable } from '@angular/core';
import { User } from '../models/user.model'; // Corrected import path
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCollectors } from '../store/collection/collection.selectors'; // Ensure this selector is defined
import { CollectionRequest } from '../models/collection-request.model';
import { createCollectionRequest } from '../store/collection/collection.actions';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private readonly COLLECTORS_KEY = 'collectors';

  constructor(private store: Store) {
    this.initializeCollectors();
  }

  private initializeCollectors(): void {
    if (!localStorage.getItem(this.COLLECTORS_KEY)) {
      const defaultCollectors: User[] = [
        {
          id: '1',
          email: 'collector1@recyclehub.ma',
          password: 'hashedPassword123',
          firstName: 'Mohammed',
          lastName: 'Alami',
          phoneNumber: '0600000001',
          dateOfBirth: new Date('1990-01-01'),
          address: {
            street: '123 Rue Hassan II',
            city: 'Casablanca',
            postalCode: '20000',
            country: 'Maroc'
          },
          userType: 'collector',
          points: 0
        },
        // Ajouter d'autres collecteurs par défaut
      ];
      localStorage.setItem(this.COLLECTORS_KEY, JSON.stringify(defaultCollectors));
    }
  }

  getCollectors(): Observable<User[]> {
    return this.store.select(selectCollectors);
  }
}
