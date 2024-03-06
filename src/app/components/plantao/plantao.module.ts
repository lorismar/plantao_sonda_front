import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PlantaoRoutingModule } from './plantao-routing.module';
import { CadastrarPlantaoComponent } from './primeira-instancia/cadastrar-plantao/cadastrar-plantao.component';
import { ListarPlantaoComponent } from './primeira-instancia/listar-plantao/listar-plantao.component';
import { BreadcrumbModule } from '../../shared/components/breadcrumb/breadcrumb.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../../views/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SkeletonModule } from 'primeng/skeleton';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListarPlantaoSegundaInstanciaComponent } from './segunda-instancia/listar-plantao-segunda-instancia/listar-plantao-segunda-instancia.component';
import { CadastrarPlantaoSegundaInstanciaComponent } from './segunda-instancia/cadastrar-plantao-segunda-instancia/cadastrar-plantao-segunda-instancia.component';
import { ListarTurmaRecursalComponent } from './turma-recursal/listar-turma-recursal/listar-turma-recursal.component';
import { CadastrarTurmaRecursalComponent } from './turma-recursal/cadastrar-turma-recursal/cadastrar-turma-recursal.component';
import { InputPlantaoModule } from '../../shared/components/input-plantao/input-plantao.module';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeSelectModule } from 'primeng/treeselect';
import { CalendarModule } from 'primeng/calendar';
import {ProgressSpinnerModule} from "primeng/progressspinner";

@NgModule({
  declarations: [
    CadastrarPlantaoComponent,
    ListarPlantaoComponent,
    ListarPlantaoSegundaInstanciaComponent,
    CadastrarPlantaoSegundaInstanciaComponent,
    ListarTurmaRecursalComponent,
    CadastrarTurmaRecursalComponent,
  ],
  imports: [
    CommonModule,
    PlantaoRoutingModule,
    BreadcrumbModule,
    SkeletonModule,
    FontAwesomeModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    SkeletonModule,
    NgxMaskPipe,
    FieldsetModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextModule,
    TooltipModule,
    NgxPaginationModule,
    SharedModule,
    InputPlantaoModule,
    InputTextareaModule,
    ConfirmPopupModule,
    NgSelectModule,
    TreeSelectModule,
    CalendarModule,
    ProgressSpinnerModule,
  ],
  providers: [DatePipe],
})
export class PlantaoModule {}
