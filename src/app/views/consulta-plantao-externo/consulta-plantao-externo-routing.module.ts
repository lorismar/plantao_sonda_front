import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioConsultaComponent } from './inicio-consulta/inicio-consulta.component';
import { ListaConsultaPlantaoComponent } from './lista-consulta-plantao/lista-consulta-plantao.component';

const routes: Routes = [
  {
    path: '',
    component: InicioConsultaComponent,
  },
  {
    path: 'lista',
    component: ListaConsultaPlantaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaPlantaoExternoRoutingModule {}
