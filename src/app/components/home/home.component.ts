import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { selectIsAuthenticated, selectUserType, selectCurrentUser } from '../../store/auth/auth.selectors';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private store = inject(Store);
  isAuthenticated$: Observable<boolean>;
  userType$: Observable<'collector' | 'particular' | undefined>;
  currentUser$ = this.store.select(selectCurrentUser);

  constructor() {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.userType$ = this.store.select(selectUserType);
  }

  onLogout(): void {
    this.store.dispatch(logout());
  }
}