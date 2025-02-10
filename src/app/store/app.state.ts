import { CollectionRequest } from '../models/collection-request.model'; // Adjust based on your model structure
import { User } from '../models/user.model'; // Import User model
import { AuthState } from './auth/auth.reducer';

// Exporter l'interface pour qu'elle soit accessible
export interface CollectionStateModel {
  collectors: User[]; // Assuming User is imported from the correct path
  collectionRequests: CollectionRequest[]; // Assuming CollectionRequest is imported from the correct path
  currentRequest: CollectionRequest | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
    auth: AuthState;
    collection: CollectionStateModel;
    // Add other slices of state as needed
}
