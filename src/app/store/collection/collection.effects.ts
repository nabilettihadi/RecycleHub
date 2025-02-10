import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as CollectionActions from './collection.actions';
import { CollectionService } from '../../services/collection.service';

@Injectable()
export class CollectionEffects {
  private actions$ = inject(Actions);
  private collectionService = inject(CollectionService);

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.loadRequests),
      mergeMap(() =>
        this.collectionService.getCollectionRequests().pipe(
          map(requests => CollectionActions.loadRequestsSuccess({ requests })),
          catchError(error => of(CollectionActions.loadRequestsFailure({ error: error.message })))
        )
      )
    )
  );

  createRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionActions.createCollectionRequest),
      mergeMap(({ request }) =>
        this.collectionService.addCollectionRequest(request).pipe(
          map(createdRequest => CollectionActions.createCollectionRequestSuccess({ request: createdRequest })),
          catchError(error => of(CollectionActions.createCollectionRequestFailure({ error: error.message })))
        )
      )
    )
  );

  // Ajoutez d'autres effets si nécessaire pour update et delete
} 