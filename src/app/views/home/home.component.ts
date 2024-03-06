import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(public keycloak: KeycloakService) {}
  roles: any;
  ngOnInit(): void {
    this.roles = this.keycloak.getKeycloakInstance().resourceAccess;
  }
  toggleMenu() {
    document.querySelector('body')?.classList.toggle('collapsedMenu');
  }
}
