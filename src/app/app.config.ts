import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { pointsReducer } from './store/points/points.reducer';
import { collectionReducer } from './store/collection/collection.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { PointsEffects } from './store/points/points.effects';
import { CollectionEffects } from './store/collection/collection.effects';
import { CollectionService } from './services/collection.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      points: pointsReducer,
      collection: collectionReducer
    }),
    provideEffects([AuthEffects, PointsEffects, CollectionEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    CollectionService
  ]
};
