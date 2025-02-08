import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollectionRequest, RequestStatus } from '../models/collection-request.model';
import { Store } from '@ngrx/store';
import { User } from '../models/user.model';
import { selectCollectors } from '../store/collection/collection.selectors';    
import { AppState } from '../store/app.state';

@Injectable({
  providedIn: 'root'
})
export class CollectorService {
  private collectors: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
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

  constructor(private store: Store<AppState>) {}

  getCollectors(): Observable<User[]> {
    return of(this.collectors);
  }

  addCollector(collector: User): Observable<User> {
    this.collectors.push(collector);
    return of(collector);
  }

  updateCollector(id: string, updates: Partial<User>): Observable<User | undefined> {
    const index = this.collectors.findIndex(c => c.id === id);
    if (index !== -1) {
      this.collectors[index] = { ...this.collectors[index], ...updates };
      return of(this.collectors[index]);
    }
    return of(undefined);
  }

  updateCollectionRequestStatus(requestId: string, newStatus: RequestStatus): Observable<CollectionRequest | undefined> {
    const requests = this.getCollectionRequests(); // Assume this method retrieves collection requests
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex !== -1) {
        requests[requestIndex].status = newStatus;
        localStorage.setItem('collection_requests', JSON.stringify(requests)); // Save updated requests
        return of(requests[requestIndex]);
    }
    return of(undefined);
  }

  private getCollectionRequests(): CollectionRequest[] {
    return JSON.parse(localStorage.getItem('collection_requests') || '[]');
  }

  deleteCollector(id: string): Observable<boolean> {
    const initialLength = this.collectors.length;
    this.collectors = this.collectors.filter(c => c.id !== id);
    return of(this.collectors.length !== initialLength);
  }
}
