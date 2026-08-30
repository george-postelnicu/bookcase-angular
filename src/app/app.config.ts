import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors, withXhr} from '@angular/common/http';

import {routes} from './app.routes';
import {fakeResponseInterceptor} from "./fake-response.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr(), 
      withInterceptors([fakeResponseInterceptor])
    )
  ]
};
