import { Component, OnInit } from '@angular/core';
import {
  faArrowRightToBracket,
  faBars,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../../../client/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  labelEvent = {
    application: 'Sistema de Plantão Judicial',
    titleApplication: 'Sistema de Plantão Judicial',
    sgc: '',
    title: '',
    cardInfo: '',
    calendar: '',
    list: '',
  };
  toggleMenu() {
    document.querySelector('body')?.classList.toggle('collapsedMenu');
  }
  openModalDeslogar() {
    Swal.fire({
      position: 'center',
      title: 'Deseja sair do Sistema de Plantão Judicial?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        confirmButton: 'btn-primary',
      },
    }).then((result) => {
      if (result.value) {
        this.auth.deslogar();
        let timerInterval: any;
        Swal.fire({
          title: 'Saindo...',
          timer: 1000,
          timerProgressBar: true,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            const b = Swal.getHtmlContainer()?.querySelector('b');
            if (b) {
              timerInterval = setInterval(() => {
                const timerLeft = Swal.getTimerLeft();
                if (typeof timerLeft === 'number') {
                  b.textContent = timerLeft.toString();
                }
              }, 100);
            }
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        });
      }
    });
  }
  protected readonly faBars = faBars;
  protected readonly faUsers = faUsers;
  protected readonly faArrowRightToBracket = faArrowRightToBracket;
  protected readonly faUser = faUser;
}
