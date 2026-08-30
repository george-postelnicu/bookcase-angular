import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors, withXhr} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

import {routes} from './app.routes';
import {fakeResponseInterceptor} from "./fake-response.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr(), 
      withInterceptors([fakeResponseInterceptor])
    ),
    provideAnimationsAsync()
  ]
};
