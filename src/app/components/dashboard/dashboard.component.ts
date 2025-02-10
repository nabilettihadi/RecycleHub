import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { selectUserPendingRequests } from '../../store/collection/collection.selectors';
import { logout } from '../../store/auth/auth.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  
  currentUser$ = this.store.select(selectCurrentUser);
  pendingRequests$ = this.store.select(selectUserPendingRequests);
  
  pendingRequestsCount$ = this.pendingRequests$.pipe(
    map(requests => requests.length)
  );
  
  nextCollectionDate$ = this.pendingRequests$.pipe(
    map(requests => {
      const nextRequest = requests
        .sort((a, b) => new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime())[0];
      return nextRequest ? new Date(nextRequest.collectionDate).toLocaleDateString() : 'Aucune';
    })
  );

  recentRequests$ = this.pendingRequests$.pipe(
    map(requests => requests.slice(0, 5))
  );

  ngOnInit(): void {}

  onLogout(): void {
    this.store.dispatch(logout());
  }

  onEditRequest(request: any): void {
    // Implémenter la logique de modification
  }

  onDeleteRequest(requestId: string): void {
    // Implémenter la logique de suppression
  }
}
