import { createReducer, on } from '@ngrx/store';
import * as PointsActions from './points.actions';

export interface PointsState {
  loading: boolean;
  error: string | null;
  currentPoints: number;
  conversions: { points: number; value: number; date: Date }[];
}

export const initialState: PointsState = {
  loading: false,
  error: null,
  currentPoints: 0,
  conversions: []
};

export const pointsReducer = createReducer(
  initialState,
  
  on(PointsActions.convertPoints, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(PointsActions.convertPointsSuccess, (state, { points, value }) => ({
    ...state,
    loading: false,
    currentPoints: state.currentPoints - points,
    conversions: [...state.conversions, { points, value, date: new Date() }]
  })),
  
  on(PointsActions.convertPointsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(PointsActions.updateUserPoints, (state, { points }) => ({
    ...state,
    currentPoints: points
  }))
); 