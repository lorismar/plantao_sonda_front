import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import Swal from 'sweetalert2';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private readonly keycloak: KeycloakService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return new Observable<HttpEvent<any>>((observer) => {
      this.keycloak
        .getToken()
        .then((token: string | null) => {
          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
          next
            .handle(request)
            .toPromise()
            .then(
              (response) => {
                observer.next(response);
                observer.complete();
              },
              (error) => {
                if (error.status === 401 && !this.keycloak.isLoggedIn()) {
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
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.keycloak.logout();
                    }
                  });
                }
                observer.error(error);
              }
            );
        })
        .catch((error) => observer.error(error));
    });
  }
}
