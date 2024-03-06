import { Component, HostListener, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from './client/auth/auth.service';
import { ModalSemPermissaoService } from './client/modal-sem-permissao/modal-sem-permissao.service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'plantaojudicial-frontend';
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  private timeoutId: any;
  roles: any;

  constructor(
    private readonly keycloak: KeycloakService,
    private router: Router,
    private auth: AuthService,
    private modal: ModalSemPermissaoService,
    private config: PrimeNGConfig
  ) {
    this.resetTimeout();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  onUserActivity() {
    this.resetTimeout();
  }

  resetTimeout() {
    clearTimeout(this.timeoutId);
    if (!this.roles?.hasOwnProperty('plantaojudicial')) {
      return;
    }
    this.timeoutId = setTimeout(() => {
      localStorage.setItem('lastActivityTime', '1');
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Atenção!',
        html: 'Sua sessão expirou! Por favor, faça login novamente.',
        showConfirmButton: true,
        confirmButtonText: 'Ir para o Login',
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonColor: '#46b4e8',
      }).then((retorno) => {
        if (retorno.value) {
          if (retorno.value) {
            localStorage.removeItem('lastActivityTime');
            this.keycloak.logout();
          }
        }
      });
    }, 1740000);
  }

  public async ngOnInit() {
    this.roles = this.keycloak.getKeycloakInstance().resourceAccess;
    if (!this.roles?.hasOwnProperty('plantaojudicial')) {
      return;
    }
    if (
      !this.keycloak.isTokenExpired() &&
      !this.roles.hasOwnProperty('plantaojudicial')
    ) {
      Swal.fire({
        title: 'Usuário sem permissões para acessar o sistema!',
        html: 'Redirecionando para o login...',
        timer: 2800,
        icon: 'warning',
        timerProgressBar: true,
        allowEscapeKey: false,
        allowOutsideClick: false,
        willOpen: () => {
          const container = document.querySelector(
            '.swal2-container'
          ) as HTMLElement;
          if (container) {
            container.style.backgroundColor = '#f6f6f6';
          }
          setTimeout(() => {
            this.auth.deslogar();
          }, 2500);
        },
        didOpen: () => {
          const container = document.querySelector(
            '.swal2-container'
          ) as HTMLElement;
          if (container) {
            container.style.backgroundColor = '#f6f6f6';
          }
        },
        willClose: () => {
          const container = document.querySelector(
            '.swal2-container'
          ) as HTMLElement;
          if (container) {
            container.style.backgroundColor = '#f6f6f6';
          }
          this.auth.deslogar();
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
        }
      });
    } else {
      if (localStorage.getItem('lastActivityTime')) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Atenção!',
          html: 'Sua sessão expirou! Por favor, faça login novamente.',
          showConfirmButton: true,
          confirmButtonText: 'Ir para o Login',
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonColor: '#46b4e8',
        }).then((retorno) => {
          if (retorno.value) {
            if (retorno.value) {
              localStorage.removeItem('lastActivityTime');
              this.keycloak.logout();
            }
          }
        });
      } else {
        if (this.isLoggedIn) {
          this.userProfile = await this.keycloak.loadUserProfile();
        }
        const hasShownWelcome = localStorage.getItem('hasShownWelcome');
        if (!hasShownWelcome) {
          localStorage.removeItem('lastActivityTime');
          this.keycloak.loadUserProfile().then((usuario) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Bem vindo(a), ' + usuario.firstName,
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate(['/home']);
            localStorage.setItem('hasShownWelcome', 'true');
          });
        }
      }
    }
  }
}
