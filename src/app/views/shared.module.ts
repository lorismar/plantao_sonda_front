import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from '../shared/components/header/header.component';
import { SidenavComponent } from '../shared/components/sidenav/sidenav.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { AcessibilidadeComponent } from '../shared/components/acessibilidade/acessibilidade.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BotaoVoltarHeaderCardComponent } from '../shared/components/botao-voltar-header-card/botao-voltar-header-card.component';
import { LogoffComponent } from '../shared/components/logoff/logoff.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { HasPermissionDirective } from '../shared/directives/has-permission.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    AcessibilidadeComponent,
    BotaoVoltarHeaderCardComponent,
    LogoffComponent,
    HasPermissionDirective,
  ],
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule,
  ],
  exports: [
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    AcessibilidadeComponent,
    BotaoVoltarHeaderCardComponent,
    HasPermissionDirective,
  ],
})
export class SharedModule {}
