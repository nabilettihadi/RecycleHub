import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { pointsReducer } from './store/points/points.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { PointsEffects } from './store/points/points.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      points: pointsReducer
    }),
    provideEffects([AuthEffects, PointsEffects]),
    provideHttpClient()
  ]
};
