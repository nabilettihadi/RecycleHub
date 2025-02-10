import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as PointsActions from './points.actions';
import { POINTS_CONVERSION_TABLE } from '../../models/points.model';

@Injectable()
export class PointsEffects {
  private actions$ = inject(Actions);

  convertPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsActions.convertPoints),
      mergeMap(({ points }) => {
        const conversion = POINTS_CONVERSION_TABLE.find(c => c.points === points);
        if (!conversion) {
          return of(PointsActions.convertPointsFailure({ 
            error: 'Conversion invalide' 
          }));
        }
        
        // Ici vous pouvez ajouter la logique pour sauvegarder la conversion
        // dans votre système de persistance
        
        return of(PointsActions.convertPointsSuccess({ 
          points: conversion.points, 
          value: conversion.value 
        }));
      })
    )
  );
} 