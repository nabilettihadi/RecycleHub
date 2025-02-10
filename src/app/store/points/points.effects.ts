import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as PointsActions from './points.actions';
import { POINTS_RATES, POINTS_CONVERSION_TABLE } from '../../models/points.model';
import { VoucherService } from '../../services/voucher.service';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../auth/auth.selectors';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class PointsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private voucherService = inject(VoucherService);

  convertPoints$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsActions.convertPoints),
      switchMap(({ points }) => 
        this.store.select(selectCurrentUser).pipe(
          mergeMap(user => {
            if (!user) {
              return of(PointsActions.convertPointsFailure({ 
                error: 'Utilisateur non connecté' 
              }));
            }

            const conversion = POINTS_CONVERSION_TABLE.find(c => c.points === points);
            if (!conversion) {
              return of(PointsActions.convertPointsFailure({ 
                error: 'Conversion invalide' 
              }));
            }
            
            try {
              const voucher = this.voucherService.createVoucher(
                user.id,
                conversion.points,
                conversion.value
              );
              
              return of(PointsActions.convertPointsSuccess({ 
                points: conversion.points,
                value: conversion.value 
              }));
            } catch (error) {
              return of(PointsActions.convertPointsFailure({ 
                error: 'Erreur lors de la création du bon d\'achat' 
              }));
            }
          })
        )
      )
    )
  );

  updatePointsAfterCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PointsActions.updatePointsAfterCollection),
      mergeMap(({ userId, wasteType, weight }) => {
        const pointsPerKg = POINTS_RATES[wasteType as keyof typeof POINTS_RATES];
        const earnedPoints = Math.floor(weight * pointsPerKg);
        
        return of(PointsActions.updateUserPoints({ points: earnedPoints }));
      })
    )
  );
} 