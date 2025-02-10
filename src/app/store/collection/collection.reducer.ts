import { createReducer, on } from '@ngrx/store';
import { CollectionStateModel } from '../app.state';
import * as CollectionActions from './collection.actions';

export const initialState: CollectionStateModel = {
  collectors: [],
  collectionRequests: [],
  currentRequest: null,
  loading: false,
  error: null
};

export const collectionReducer = createReducer(
  initialState,
  on(CollectionActions.loadRequests, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionActions.loadRequestsSuccess, (state, { requests }) => ({
    ...state,
    collectionRequests: requests,
    loading: false
  })),
  on(CollectionActions.loadRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
); 