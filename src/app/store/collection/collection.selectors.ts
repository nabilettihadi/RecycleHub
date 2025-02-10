import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { CollectionRequest } from '../../models/collection-request.model';
import { User } from '../../models/user.model';
import { selectCurrentUser } from '../auth/auth.selectors';
import { CollectionState } from './collection.reducer';

export const selectCollectionState = createFeatureSelector<CollectionState>('collection');

export const selectAllRequests = createSelector(
  selectCollectionState,
  (state) => state.collectionRequests
);

export const selectRequestsByCollectorCity = createSelector(
  selectAllRequests,
  selectCurrentUser,
  (requests: CollectionRequest[], user: User | null) => {
    if (!user || user.userType !== 'collector') return [];
    return requests.filter(request => 
      request.collectionAddress.city.toLowerCase() === user.address.city.toLowerCase()
    );
  }
);

// Ajoutons aussi un sélecteur pour les demandes en attente d'un utilisateur
export const selectUserPendingRequests = createSelector(
  selectAllRequests,
  selectCurrentUser,
  (requests: CollectionRequest[], user: User | null) => {
    if (!user) return [];
    return requests.filter(request => 
      request.userId === user.id && 
      request.status === 'en_attente'
    );
  }
);

// Sélecteur pour la demande courante
export const selectCurrentRequest = createSelector(
  selectCollectionState,
  (state) => state.currentRequest
);

export const selectCollectors = createSelector(
  selectCollectionState,
  (state) => state.collectors
);
