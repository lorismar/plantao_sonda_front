import { CanActivate, Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthGuard implements CanActivate, OnInit {
  constructor(private keycloak: KeycloakService, private router: Router) {}

  ngOnInit() {}

  async canActivate() {
    try {
      const isLoggedIn = await this.keycloak.isLoggedIn();
      if (isLoggedIn) {
        return true;
      } else {
        await this.keycloak.login();
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar a autenticação:', error);
      return false;
    }
  }
}
