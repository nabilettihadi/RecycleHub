import { createReducer, on } from '@ngrx/store';
import { CollectionRequest } from '../../models/collection-request.model';

export interface CollectionState {
  requests: CollectionRequest[];
  collectors: any[]; // Définir le type approprié pour les collecteurs
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
  // Ajoutez vos actions ici
); 