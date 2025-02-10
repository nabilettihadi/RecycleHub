import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectCollectionState = (state: AppState) => state.collection; // Adjust based on your state structure

export const selectCollectionRequests = createSelector(
  selectCollectionState,
  (collectionState) => collectionState.collectionRequests // Adjust based on how collection requests are stored in the state
);
