import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CollectionRequest } from '../models/collection-request.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly COLLECTION_REQUESTS_KEY = 'collection_requests';

  getCollectionRequests(): Observable<CollectionRequest[]> {
    const requests = JSON.parse(localStorage.getItem(this.COLLECTION_REQUESTS_KEY) || '[]');
    return of(requests);
  }

  addCollectionRequest(request: CollectionRequest): Observable<CollectionRequest> {
    const requests = this.getStoredRequests();
    requests.push(request);
    this.saveRequests(requests);
    return of(request);
  }

  deleteRequest(requestId: string): void {
    const requests = this.getStoredRequests();
    const updatedRequests = requests.filter(r => r.id !== requestId);
    this.saveRequests(updatedRequests);
  }

  private getStoredRequests(): CollectionRequest[] {
    return JSON.parse(localStorage.getItem(this.COLLECTION_REQUESTS_KEY) || '[]');
  }

  private saveRequests(requests: CollectionRequest[]): void {
    localStorage.setItem(this.COLLECTION_REQUESTS_KEY, JSON.stringify(requests));
  }
} 