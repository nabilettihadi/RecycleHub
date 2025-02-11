import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from './core/auth/service/auth.service';
import { loginSuccess } from './modules/auth/state/auth.actions';
import { User } from './shared/models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  private store = inject(Store);
  private authService = inject(AuthService);
  
  ngOnInit(): void {
    const user : User | null = this.authService.getLoggedInUser();
    if (user) {
      this.store.dispatch(loginSuccess({user : user}));
    }
  }
}
