import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as homeActions from '../../state/home.actions';
import { selectSignedInUser } from '../../../auth/state/auth.selectors';
import { User } from '../../../../shared/models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent implements OnInit {
  private store = inject(Store);
  currentUser: User | null = null;

  ngOnInit() {
    this.store.select(selectSignedInUser).subscribe(user => {
      this.currentUser = user;
    });
  }

  dispatchShowingAuthPopupCaseLogin = () => {
    this.store.dispatch(homeActions.showAuthPopup());
    this.store.dispatch(homeActions.showLoginForm());
  }

  dispatchShowingAuthPopupCaseRegister = () => {
    this.store.dispatch(homeActions.showAuthPopup());
    this.store.dispatch(homeActions.showRegisterForm());
  }
}
