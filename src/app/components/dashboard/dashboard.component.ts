import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { logout } from '../../store/auth/auth.actions';
import { map } from 'rxjs/operators';
import { DEFAULT_AVATAR_URL } from '../../shared/constants';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AppState } from '../../store/app.state';
import { CollectionRequest } from '../../models/collection-request.model';
import { CollectionRequestService } from '../../services/collection-request.service';
import { Observable, of } from 'rxjs';
import { deleteCollectionRequest } from '../../store/collection/collection.actions';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private store = inject(Store<AppState>);
  private collectionService = inject(CollectionRequestService);
  
  currentUser$ = this.store.select(selectCurrentUser);
  requests: CollectionRequest[] = [];
  
  pendingRequestsCount$ = of(0);
  nextCollectionDate$ = of('Aucune');
  recentRequests$ = of<CollectionRequest[]>([]);

  defaultAvatarUrl = DEFAULT_AVATAR_URL;

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.requests = this.collectionService.getUserRequests(user.id);
        
        this.updateObservables();
      }
    });
  }

  private updateObservables(): void {
    // Mettre à jour le nombre de requêtes en attente
    this.pendingRequestsCount$ = of(
      this.requests.filter(r => r.status === 'en_attente').length
    );

    // Mettre à jour la prochaine date de collecte
    this.nextCollectionDate$ = of(this.getNextCollectionDate());

    // Mettre à jour les requêtes récentes
    this.recentRequests$ = of(
      this.requests
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
    );
  }

  private getNextCollectionDate(): string {
    const pendingRequests = this.requests.filter(r => r.status === 'en_attente');
    if (pendingRequests.length === 0) return 'Aucune';

    const nextRequest = pendingRequests
      .sort((a, b) => a.collectionDate.getTime() - b.collectionDate.getTime())[0];
    return nextRequest.collectionDate.toLocaleDateString();
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }

  onEditRequest(request: CollectionRequest): void {
    // Implémenter la logique de modification
    console.log('Édition de la requête:', request.id);
  }

  onDeleteRequest(requestId: string): void {
    this.store.dispatch(deleteCollectionRequest({ requestId }));
    this.loadRequests();
  }
}
