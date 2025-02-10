import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectUserType } from '../store/auth/auth.selectors';

export const collectorGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUserType).pipe(
    map(userType => {
      if (userType === 'collector') {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
}; 