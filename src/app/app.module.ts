import {
  APP_INITIALIZER,
  DEFAULT_CURRENCY_CODE,
  LOCALE_ID,
  NgModule,
} from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { BrowserModule } from '@angular/platform-browser';
import { JWT_OPTIONS } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigService } from './providers/app-config.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HomeComponent } from './views/home/home.component';
import { SharedModule } from './views/shared.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthService } from './client/auth/auth.service';
import { TokenInterceptor } from './client/interceptors/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

registerLocaleData(localePt, 'pt');
import {
  NgxMaskDirective,
  NgxMaskPipe,
  provideEnvironmentNgxMask,
} from 'ngx-mask';
import { registerLocaleData } from '@angular/common';
import { AuthGuard } from './client/auth/auth-guard';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://sso.hmg.tjro.jus.br/auth',
        realm: 'PJRO',
        clientId: 'plantaojudicial',
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false,
        flow: 'standard',
      },
    });
}

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserAnimationsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3333,
    }),
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    FontAwesomeModule,
  ],
  providers: [
    provideEnvironmentNgxMask(),
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true,
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function initConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}
