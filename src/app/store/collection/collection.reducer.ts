import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../models/collection-request.model';
import { User } from '../../models/user.model';
import { createCollectionRequest, updateCollectionRequestStatus, updateCollectionRequest } from './collection.actions';

export interface CollectionState {
  requests: CollectionRequest[];
  collectors: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: CollectionState = {
  requests: [],
  collectors: [],
  loading: false,
  error: null
};

export const collectionReducer = createReducer(
  initialState,
  on(createCollectionRequest, (state, { request }) => ({
    ...state,
    requests: [...state.requests, request]
  })),
  on(updateCollectionRequestStatus, (state, { requestId, newStatus }) => {
    const updatedRequests = state.requests.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    );
    return {
      ...state,
      requests: updatedRequests
    };
  }),
  on(updateCollectionRequest, (state, { requestId, request }) => {
    const updatedRequests = state.requests.map(req => 
      req.id === requestId ? { ...req, ...request } : req
    );
    return {
      ...state,
      requests: updatedRequests
    };
  })
);
