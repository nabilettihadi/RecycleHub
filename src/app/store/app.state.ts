import { CollectionRequest } from '../models/collection-request.model';
import { User } from '../models/user.model';
import { AuthState } from './auth/auth.reducer';

export interface CollectionStateModel {
  collectors: User[];
  collectionRequests: CollectionRequest[];
  currentRequest: CollectionRequest | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
    auth: AuthState;
    collection: CollectionStateModel;
}
