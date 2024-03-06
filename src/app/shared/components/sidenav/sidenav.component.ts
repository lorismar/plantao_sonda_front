import { Component, OnInit } from '@angular/core';
import {
  faBuildingUser,
  faGear,
  faPlus,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { UsuarioModel } from '../../../model/usuario-model';
import { AuthorizationService } from '../../../client/auth/authorization.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public isLoggedIn = false;
  constructor(private keycloak: KeycloakService) {}

  usuarioModel = new UsuarioModel();

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();
    if (this.isLoggedIn) {
      this.keycloak.loadUserProfile().then((data: KeycloakProfile) => {
        this.usuarioModel.nome = data.firstName;
        this.usuarioModel.idUsuario = data.id;
        this.usuarioModel.email = data.email;
        this.usuarioModel.emailVerificado = data.emailVerified;
      });
    }
  }

  protected readonly faUser = faUser;
  protected readonly faGear = faGear;
  protected readonly faBuildingUser = faBuildingUser;
}
