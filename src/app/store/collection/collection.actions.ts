import { createAction, props } from '@ngrx/store';
import { CollectionRequest } from '../../models/collection-request.model';

// Create Collection Request Actions
export const createCollectionRequest = createAction(
  '[Collection] Create Collection Request',
  props<{ request: CollectionRequest }>()
);

export const createCollectionRequestSuccess = createAction(
  '[Collection] Create Collection Request Success',
  props<{ request: CollectionRequest }>()
);

export const createCollectionRequestFailure = createAction(
  '[Collection] Create Collection Request Failure',
  props<{ error: string }>()
);

// Update Collection Request Actions
export const updateCollectionRequest = createAction(
  '[Collection] Update Collection Request',
  props<{ requestId: string; request: Partial<CollectionRequest> }>()
);

export const updateCollectionRequestSuccess = createAction(
  '[Collection] Update Collection Request Success',
  props<{ request: CollectionRequest }>()
);

export const updateCollectionRequestFailure = createAction(
  '[Collection] Update Collection Request Failure',
  props<{ error: string }>()
);

// Delete Collection Request Actions
export const deleteCollectionRequest = createAction(
  '[Collection] Delete Collection Request',
  props<{ requestId: string }>()
);

export const deleteCollectionRequestSuccess = createAction(
  '[Collection] Delete Collection Request Success',
  props<{ requestId: string }>()
);

export const deleteCollectionRequestFailure = createAction(
  '[Collection] Delete Collection Request Failure',
  props<{ error: string }>()
);
