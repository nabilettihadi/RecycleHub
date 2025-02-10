import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PointsState } from './points.reducer';

export const selectPointsState = createFeatureSelector<PointsState>('points');

export const selectCurrentPoints = createSelector(
  selectPointsState,
  (state) => state.currentPoints
);

export const selectPointsLoading = createSelector(
  selectPointsState,
  (state) => state.loading
);

export const selectPointsError = createSelector(
  selectPointsState,
  (state) => state.error
);

export const selectPointsConversions = createSelector(
  selectPointsState,
  (state) => state.conversions
); 