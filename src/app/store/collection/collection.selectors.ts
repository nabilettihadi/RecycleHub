import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, CollectionStateModel } from '../app.state';
import { CollectionRequest } from '../../models/collection-request.model';
import { User } from '../../models/user.model';
import { selectCurrentUser } from '../auth/auth.selectors';

export const selectCollectionState = createFeatureSelector<CollectionStateModel>('collection');

export const selectAllRequests = createSelector(
  selectCollectionState,
  (state: CollectionStateModel) => state?.collectionRequests || []
);

export const selectRequestsByCollectorCity = createSelector(
  selectAllRequests,
  selectCurrentUser,
  (requests, user) => {
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
  (requests, user) => {
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

export const selectCollectionRequests = createSelector(
  selectCollectionState,
  (state) => state.collectionRequests
);
