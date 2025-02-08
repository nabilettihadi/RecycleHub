import { CollectionRequest } from '../models/collection-request.model'; // Adjust based on your model structure
import { User } from '../models/user.model'; // Import User model
import { AuthState } from './auth/auth.reducer';
import { CollectionState as CollectionStateType } from './collection/collection.reducer';

export interface CollectionState {
  collectors: User[]; // Assuming User is imported from the correct path
  collectionRequests: CollectionRequest[]; // Assuming CollectionRequest is imported from the correct path
}

export interface AppState {
  auth: AuthState;
  collection: CollectionStateType;
  // Add other slices of state as needed
}
