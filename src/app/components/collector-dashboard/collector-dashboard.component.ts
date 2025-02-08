import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CollectionRequest } from '../../models/collection-request.model';
import { selectCollectionRequests } from '../../store/collection/collection.selectors';
import { AppState } from '../../store/app.state';
import { updateCollectionRequest } from '../../store/collection/collection.actions';

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
    this.collectionRequests$ = this.store.select(selectCollectionRequests);
  }

  ngOnInit(): void {}

  acceptRequest(requestId: string | undefined): void {
    if (requestId) {
      this.store.dispatch(updateCollectionRequest({ requestId, request: { status: 'validee' } }));

    }
  }

  rejectRequest(requestId: string | undefined): void {
    if (requestId) {
      this.store.dispatch(updateCollectionRequest({ requestId, request: { status: 'rejetee' } }));

    }
  }
}
