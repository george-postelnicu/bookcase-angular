import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FakeResponseInterceptor} from "./fake-response-interceptor.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    {provide: HTTP_INTERCEPTORS, useClass: FakeResponseInterceptor, multi: true}
  ]
};
