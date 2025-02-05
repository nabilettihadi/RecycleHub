import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ user: Omit<User, 'id' | 'points'> }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Update Profile Actions
export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ userId: string; userData: Partial<User> }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

// Delete Account Actions
export const deleteAccount = createAction(
  '[Auth] Delete Account',
  props<{ userId: string }>()
);

export const deleteAccountSuccess = createAction(
  '[Auth] Delete Account Success'
);

export const deleteAccountFailure = createAction(
  '[Auth] Delete Account Failure',
  props<{ error: string }>()
);

// Logout Action
export const logout = createAction('[Auth] Logout');
