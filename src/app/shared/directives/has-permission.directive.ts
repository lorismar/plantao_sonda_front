import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective implements OnInit {
  @Input() appHasPermission: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    const user = this.keycloak.getUserRoles();
    if (!user.some((role: string) => this.appHasPermission.includes(role))) {
      this.el.nativeElement.remove();
    }
  }
}
