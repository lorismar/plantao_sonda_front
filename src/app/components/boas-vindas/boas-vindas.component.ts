import { Component, OnInit } from '@angular/core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-boas-vindas',
  templateUrl: './boas-vindas.component.html',
  styleUrls: ['./boas-vindas.component.scss'],
})
export class BoasVindasComponent implements OnInit {
  constructor(public keycloak: KeycloakService) {}
  roles: any;
  ngOnInit(): void {
    this.roles = this.keycloak.getKeycloakInstance().resourceAccess;
  }
  protected readonly faAngleLeft = faAngleLeft;
}
