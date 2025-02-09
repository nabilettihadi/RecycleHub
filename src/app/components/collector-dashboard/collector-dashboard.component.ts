import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionRequest, Address, RequestStatus } from '../../models/collection-request.model';
import { updateCollectionRequest } from '../../store/collection/collection.actions';
import { CommonModule } from '@angular/common';
import { selectCollectionRequests } from '../../store/collection/collection.selectors';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css']
})
export class CollectorDashboardComponent implements OnInit {
    collectionRequests$: Observable<CollectionRequest[]>;

    constructor(private store: Store<AppState>) {
        this.collectionRequests$ = this.store.select(selectCollectionRequests).pipe(
          map(requests => requests.map(request => ({
            ...request,
            collectionAddress: request.collectionAddress || { 
              street: 'Adresse non disponible', 
              city: '', 
              postalCode: '' 
            }
          })))
        );
    }

    ngOnInit(): void {
        // Fetch collection requests logic here
    }

    getStreet(address: Address | string | undefined): string {
        if (!address) return 'Adresse non disponible';
        if (typeof address === 'string') return address;
        return address.street || 'Adresse non disponible';
    }

    onUpdateStatus(requestId: string, newStatus: RequestStatus): void {
        this.store.dispatch(updateCollectionRequest({ requestId, request: { status: newStatus } }));
    }

    acceptRequest(requestId: string | undefined): void {
        if (requestId) {
            this.store.dispatch(updateCollectionRequest({ 
                requestId, 
                request: { status: 'validee' } 
            }));
        }
    }

    rejectRequest(requestId: string | undefined): void {
        if (requestId) {
            this.store.dispatch(updateCollectionRequest({ 
                requestId, 
                request: { status: 'rejetee' } 
            }));
        }
    }
}
