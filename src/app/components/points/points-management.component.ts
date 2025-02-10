import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { POINTS_CONVERSION_TABLE } from '../../models/points.model';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { convertPoints } from '../../store/points/points.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-points-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Gestion des Points</h2>
      
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Vos Points</h3>
        <p class="text-3xl font-bold text-green-600">{{ userPoints$ | async }} points</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div *ngFor="let conversion of conversionTable" 
             class="bg-white rounded-lg shadow p-6 text-center">
          <h4 class="font-semibold mb-2">{{ conversion.points }} points</h4>
          <p class="text-2xl font-bold text-green-600 mb-4">{{ conversion.value }} Dh</p>
          <button (click)="convertPoints(conversion.points)"
                  [disabled]="isDisabled(conversion.points) | async"
                  class="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 
                         disabled:opacity-50 disabled:cursor-not-allowed">
            Convertir
          </button>
        </div>
      </div>
    </div>
  `
})
export class PointsManagementComponent {
  private store = inject(Store);
  userPoints$ = this.store.select(selectCurrentUser).pipe(
    map(user => user?.points || 0)
  );
  conversionTable = POINTS_CONVERSION_TABLE;

  isDisabled(requiredPoints: number) {
    return this.userPoints$.pipe(
      map(points => points < requiredPoints)
    );
  }

  convertPoints(points: number): void {
    this.store.dispatch(convertPoints({ points }));
  }
} 