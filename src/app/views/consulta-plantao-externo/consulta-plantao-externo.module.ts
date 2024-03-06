import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaPlantaoExternoRoutingModule } from './consulta-plantao-externo-routing.module';
import { InicioConsultaComponent } from './inicio-consulta/inicio-consulta.component';
import { ListaConsultaPlantaoComponent } from './lista-consulta-plantao/lista-consulta-plantao.component';
import { SharedModule } from '../shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { NgxMaskPipe } from 'ngx-mask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";

@NgModule({
  declarations: [InicioConsultaComponent, ListaConsultaPlantaoComponent],
  imports: [
    CommonModule,
    ConsultaPlantaoExternoRoutingModule,
    SharedModule,
    FontAwesomeModule,
    TooltipModule,
    FormsModule,
    NgxMaskPipe,
    AutoCompleteModule,
    DialogModule,
    DropdownModule,
    MultiSelectModule,
  ],
})
export class ConsultaPlantaoExternoModule {}
