import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracaoRoutingModule } from './administracao-routing.module';
import { AdministracaoComponent } from './administracao.component';
import { CadastroAreaRegiaoComponent } from './area-regiao/cadastrar-area-regiao/cadastro-area-regiao.component';
import { BreadcrumbModule } from '../../shared/components/breadcrumb/breadcrumb.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../views/shared.module';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SkeletonModule } from 'primeng/skeleton';
import { NgxPaginationModule } from 'ngx-pagination';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import {BadgeModule} from "primeng/badge";

@NgModule({
  declarations: [AdministracaoComponent, CadastroAreaRegiaoComponent],
  imports: [
    CommonModule,
    AdministracaoRoutingModule,
    BreadcrumbModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    CheckboxModule,
    MultiSelectModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TooltipModule,
    AutoCompleteModule,
    SkeletonModule,
    NgxPaginationModule,
    PanelModule,
    AccordionModule,
    BadgeModule,
  ],
  providers: [],
})
export class AdministracaoModule {}
