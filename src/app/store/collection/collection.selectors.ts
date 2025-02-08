import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from './collection.reducer';

// Sélecteur de base pour l'état de collection
export const selectCollectionState = createFeatureSelector<CollectionState>('collection');

// Sélecteur pour les demandes de collection
export const selectCollectionRequests = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.requests
);

// Sélecteur pour les collecteurs
export const selectCollectors = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.collectors
);

// Sélecteur pour l'état de chargement
export const selectCollectionLoading = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.loading
);

// Sélecteur pour les erreurs
export const selectCollectionError = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.error
);
