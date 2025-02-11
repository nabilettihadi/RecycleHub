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
  on(CollectionActions.createCollectionRequest, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(CollectionActions.createCollectionRequestSuccess, (state, { request }) => ({
    ...state,
    collectionRequests: [...state.collectionRequests, request],
    loading: false
  })),
  on(CollectionActions.createCollectionRequestFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(CollectionActions.deleteCollectionRequestSuccess, (state, { requestId }) => ({
    ...state,
    collectionRequests: state.collectionRequests.filter(request => request.id !== requestId)
  }))
); 