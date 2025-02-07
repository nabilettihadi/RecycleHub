import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectCurrentUser } from '../store/auth/auth.selectors';

export const authGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectCurrentUser).pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
}; 