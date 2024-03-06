import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '../../providers/app-config.service';
import { KeycloakService } from 'keycloak-angular';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    configService: AppConfigService,
    private readonly keycloak: KeycloakService
  ) {
    this.url = configService.config.baseUrl;
  }

  getRoles(): void {
    this.keycloak.getUserRoles();
  }
  deslogar() {
    localStorage.removeItem('hasShownWelcome');
    localStorage.removeItem('lastActivityTime');
    return this.keycloak.logout();
  }
}
