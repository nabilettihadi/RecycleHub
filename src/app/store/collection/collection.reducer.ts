import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import { CollectionRequest } from '../../models/collection-request.model';

export interface CollectionState {
  collectors: User[];
  collectionRequests: CollectionRequest[];
  currentRequest: CollectionRequest | null;
  loading: boolean;
  error: string | null;
}

export const initialState: CollectionState = {
  collectors: [],
  collectionRequests: [],
  currentRequest: null,
  loading: false,
  error: null
};

export const collectionReducer = createReducer(
  initialState,
  // définir vos reducers ici...
); 