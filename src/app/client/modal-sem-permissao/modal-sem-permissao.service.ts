import { Injectable, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ModalSemPermissaoService implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {}
  modalDeslogar() {
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
