import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRegiaoRoutingModule } from './area-regiao-routing.module';
import { ListaAreaRegiaoComponent } from './listar-area-regiao/lista-area-regiao.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from '../../../shared/components/breadcrumb/breadcrumb.module';
import { SharedModule } from '../../../views/shared.module';
import { SkeletonModule } from 'primeng/skeleton';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import {ConfirmDialogModule} from "primeng/confirmdialog";

@NgModule({
  declarations: [ListaAreaRegiaoComponent],
  imports: [
    CommonModule,
    AreaRegiaoRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    SharedModule,
    SkeletonModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ChipsModule,
    AutoCompleteModule,
    TooltipModule,
    NgxPaginationModule,
    ChipModule,
    TagModule,
    BadgeModule,
    ConfirmPopupModule,
    MultiSelectModule,
    CheckboxModule,
    DividerModule,
    FieldsetModule,
    PanelModule,
    AccordionModule,
    ConfirmDialogModule,
  ],
  providers: [HttpClient],
})
export class AreaRegiaoModule {}
