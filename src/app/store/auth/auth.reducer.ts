import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  
  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Profile
  on(AuthActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Account
  on(AuthActions.deleteAccount, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AuthActions.deleteAccountSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null
  })),
  on(AuthActions.deleteAccountFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    error: null
  }))
);
