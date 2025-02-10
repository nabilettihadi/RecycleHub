import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { convertPoints } from '../../store/points/points.actions';
import { Observable, map } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css']
})
export class PointsComponent implements OnInit {
  private store = inject(Store);

  currentUser$: Observable<User | null> = this.store.select(selectCurrentUser);
  hasEnoughPoints$ = (requiredPoints: number) => this.currentUser$.pipe(
    map(user => user ? user.points >= requiredPoints : false)
  );

  readonly conversionRates = [
    { points: 100, amount: 50 },
    { points: 200, amount: 120 },
    { points: 500, amount: 350 }
  ];

  convertPoints(points: number, value: number): void {
    if (confirm(`Voulez-vous convertir ${points} points en bon d'achat de ${value} Dh ?`)) {
      this.store.dispatch(convertPoints({ points, value }));
    }
  }

  ngOnInit(): void {}
}