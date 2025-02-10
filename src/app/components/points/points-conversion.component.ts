import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserPoints, selectUserVouchers } from '../../store/points/points.selectors';
import { convertPointsToVoucher } from '../../store/points/points.actions';

@Component({
  selector: 'app-points-conversion',
  template: `
    <div class="container mx-auto p-4">
      <h2>Mes points : {{ userPoints$ | async }}</h2>
      
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div *ngFor="let rate of conversionRates" 
             class="p-4 border rounded text-center">
          <h3>{{rate.points}} points</h3>
          <p>{{rate.amount}} Dh</p>
          <button (click)="convertPoints(rate.points)"
                  [disabled]="(userPoints$ | async) < rate.points"
                  class="btn btn-primary">
            Convertir
          </button>
        </div>
      </div>
      
      <div class="mt-4">
        <h3>Mes bons d'achat</h3>
        <div *ngFor="let voucher of vouchers$ | async"
             class="p-2 border rounded mb-2">
          <p>Valeur : {{voucher.value}} Dh</p>
          <p>Status : {{voucher.status}}</p>
        </div>
      </div>
    </div>
  `
})
export class PointsConversionComponent {
  userPoints$ = this.store.select(selectUserPoints);
  vouchers$ = this.store.select(selectUserVouchers);
  
  readonly conversionRates = [
    { points: 100, amount: 50 },
    { points: 200, amount: 120 },
    { points: 500, amount: 350 }
  ];
  
  constructor(private store: Store) {}
  
  convertPoints(points: number): void {
    this.store.dispatch(convertPointsToVoucher({ points }));
  }
} 