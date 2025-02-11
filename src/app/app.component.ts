import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from './models/user.model';
import { loginSuccess } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'RecycleHub';

  private store = inject(Store);

  ngOnInit() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user: User = JSON.parse(userJson);
      this.store.dispatch(loginSuccess({ user }));
    }
    
  }
}
