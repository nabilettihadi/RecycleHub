import { createAction, props } from '@ngrx/store';

export const convertPoints = createAction(
  '[Points] Convert Points',
  props<{ points: number }>()
);

export const convertPointsSuccess = createAction(
  '[Points] Convert Points Success',
  props<{ points: number, value: number }>()
);

export const convertPointsFailure = createAction(
  '[Points] Convert Points Failure',
  props<{ error: string }>()
);

export const updateUserPoints = createAction(
  '[Points] Update User Points',
  props<{ points: number }>()
);

export const updatePointsAfterCollection = createAction(
  '[Points] Update After Collection',
  props<{ 
    userId: string,
    wasteType: string,
    weight: number 
  }>()
); 