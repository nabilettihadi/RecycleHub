import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { selectIsAuthenticated, selectUserType } from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private store = inject(Store);
  isAuthenticated$: Observable<boolean>;
  userType$: Observable<'collector' | 'particular' | undefined>;

  constructor() {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.userType$ = this.store.select(selectUserType);
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}