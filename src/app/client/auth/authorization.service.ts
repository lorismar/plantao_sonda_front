import { Injectable, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService implements OnInit {
  constructor(
    private keycloak: KeycloakService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}
  ehAdministrador() {
    return (
      this.keycloak.isUserInRole('PlantaoJudicial-ManterRegiaoPlantao') &&
      this.keycloak.isUserInRole('PlantaoJudicial-ManterPlantao-1Grau') &&
      this.keycloak.isUserInRole('PlantaoJudicial-ManterPlantao-2Grau') &&
      this.keycloak.isUserInRole('PlantaoJudicial-ManterPlantao-TurmaRecursal')
    );
  }

  manterRegiaoPlantao() {
    return this.keycloak.isUserInRole('PlantaoJudicial-ManterRegiaoPlantao');
  }
  plantaoJudicial1Grau() {
    return this.keycloak.isUserInRole('PlantaoJudicial-ManterPlantao-1Grau');
  }
  plantaoJudicial2Grau() {
    return this.keycloak.isUserInRole('PlantaoJudicial-ManterPlantao-2Grau');
  }
  plantaoJudicialTurmaRecursal() {
    return this.keycloak.isUserInRole(
      'PlantaoJudicial-ManterPlantao-TurmaRecursal'
    );
  }

  modalDeslogar() {
    this.router.navigate(['/home']);
    let timerInterval: any;
    Swal.fire({
      title: 'Usuário sem permissões para acessar o sistema!',
      html: 'Redirecionando para o login...',
      timer: 2500,
      icon: 'warning',
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        // @ts-ignore
        let timer: any = Swal.getPopup().querySelector('b');
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        this.auth.deslogar();
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
      }
    });
  }
}
