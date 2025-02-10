import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { AppState } from '../app.state';

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthState = createSelector(
  selectAuth,
  (state: AuthState) => state
);

export const selectCurrentUser = createSelector(
  selectAuth,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (state: AuthState) => !!state.user
);

export const selectUserType = createSelector(
  selectAuth,
  (state: AuthState) => state.user?.userType
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectUserActiveRequests = createSelector(
  selectAuthState,
  (state: AuthState): string[] => state.user?.activeRequests || []
);