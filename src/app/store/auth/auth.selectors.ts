import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectAuthState = createSelector(
  selectAuth,
  (state) => state
);

export const selectUser = createSelector(
  selectAuth,
  (state) => state.user
);

export const selectAuthLoading = createSelector(
  selectAuth,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuth,
  (state) => state.error
);
