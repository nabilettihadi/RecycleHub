import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionRequest, Address, RequestStatus } from '../../models/collection-request.model';
import { updateCollectionRequest } from '../../store/collection/collection.actions';
import { CommonModule } from '@angular/common';
import { selectAllRequests, selectRequestsByCollectorCity } from '../../store/collection/collection.selectors';
import { AppState } from '../../store/app.state';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CollectionRequestService } from '../../services/collection-request.service';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css']
})
export class CollectorDashboardComponent implements OnInit {
  private store = inject(Store<AppState>);
  private collectionService = inject(CollectionRequestService);
  
  requests$ = this.store.select(selectRequestsByCollectorCity);
  currentFilter = 'en_attente';
  
  validatedCount$ = this.requests$.pipe(
    map(requests => requests.filter(r => r.status === 'validee').length)
  );
  
  pendingCount$ = this.requests$.pipe(
    map(requests => requests.filter(r => r.status === 'en_attente').length)
  );
  
  totalCollected$ = this.requests$.pipe(
    map(requests => requests
      .filter(r => r.status === 'validee')
      .reduce((total, r) => total + this.getTotalWeight(r), 0)
    )
  );
  
  filteredRequests$ = this.requests$.pipe(
    map(requests => requests.filter(r => r.status === this.currentFilter))
  );

  currentUser$ = this.store.select(selectCurrentUser);
  availableRequests: CollectionRequest[] = [];
  
  pendingRequestsCount$: Observable<number> = of(0);
  totalWeight$: Observable<number> = of(0);
  recentRequests$: Observable<CollectionRequest[]> = of([]);

  defaultAvatarUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.availableRequests = this.collectionService.getRequestsByCity(user.address.city);
        this.updateObservables();
      }
    });
  }

  private updateObservables(): void {
    const pendingRequests = this.availableRequests.filter(r => r.status === 'en_attente');
    
    this.pendingRequestsCount$ = of(pendingRequests.length);
    
    this.totalWeight$ = of(
      pendingRequests.reduce((total, req) => total + req.totalWeight, 0) / 1000
    );
    
    this.recentRequests$ = of(
      this.availableRequests
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
    );
  }

  filterByStatus(status: string): void {
    this.currentFilter = status;
  }

  getTotalWeight(request: CollectionRequest): number {
    return request.wasteItems.reduce((total, item) => total + item.weight, 0) / 1000; // Convert to kg
  }

  getStatusClass(status: string): string {
    const classes = {
      'en_attente': 'bg-yellow-100 text-yellow-800',
      'occupee': 'bg-blue-100 text-blue-800',
      'en_cours': 'bg-purple-100 text-purple-800',
      'validee': 'bg-green-100 text-green-800',
      'rejetee': 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${classes[status as keyof typeof classes]}`;
  }

  onAcceptRequest(request: CollectionRequest): void {
    this.collectionService.updateRequestStatus(request.id, 'occupee' as RequestStatus);
    this.updateObservables();
  }

  onRejectRequest(request: CollectionRequest): void {
    this.collectionService.updateRequestStatus(request.id, 'rejetee' as RequestStatus);
    this.updateObservables();
  }

  onStartCollection(request: CollectionRequest): void {
    this.collectionService.updateRequestStatus(request.id, 'en_cours' as RequestStatus);
    this.updateObservables();
  }

  onValidateCollection(request: CollectionRequest): void {
    this.collectionService.validateCollection(request.id);
    this.updateObservables();
  }

  getCurrentCollectorCity(): string {
    const collector = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return collector.city || '';
  }

  getStreet(address: Address | string | undefined): string {
    if (!address) return 'Adresse non disponible';
    if (typeof address === 'string') return address;
    return address.street || 'Adresse non disponible';
  }

  onUpdateStatus(requestId: string, newStatus: RequestStatus): void {
    this.store.dispatch(updateCollectionRequest({ requestId, request: { status: newStatus } }));
  }

  rejectRequest(requestId: string | undefined): void {
    if (requestId) {
      this.store.dispatch(updateCollectionRequest({ 
        requestId, 
        request: { status: 'rejetee' } 
      }));
    }
  }

  markAsOccupied(requestId: string): void {
    this.store.dispatch(updateCollectionRequest({ 
      requestId, 
      request: { status: 'occupee' } 
    }));
  }

  closeValidationModal(): void {
    // Implémentation de la fermeture du modal de validation
  }

  onFileSelected(event: any): void {
    // Implémentation de la gestion des fichiers sélectionnés
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}
