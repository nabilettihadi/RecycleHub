import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => !!user
);

export const selectIsCollector = createSelector(
  selectCurrentUser,
  (user) => user?.userType === 'collector'
);

export const selectIsParticular = createSelector(
  selectCurrentUser,
  (user) => user?.userType === 'particular'
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectUserCity = createSelector(
  selectCurrentUser,
  (user) => user?.address.city
);
