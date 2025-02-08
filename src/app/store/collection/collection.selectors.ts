import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from './collection.reducer';
import { User } from '../../models/user.model';

export const selectCollectionState = createFeatureSelector<CollectionState>('collection');

export const selectCollectors = createSelector(
  selectCollectionState,
  (state: CollectionState) => state.collectors
);

export const selectCollectionRequests = createSelector( 
  selectCollectionState,
  (state: CollectionState) => state.requests
);

export const selectLoading = createSelector( 
  selectCollectionState,
  (state: CollectionState) => state.loading
);

export const selectError = createSelector( 
  selectCollectionState,
  (state: CollectionState) => state.error
);
