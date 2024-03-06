import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarPlantaoComponent } from './primeira-instancia/listar-plantao/listar-plantao.component';
import { CadastrarPlantaoComponent } from './primeira-instancia/cadastrar-plantao/cadastrar-plantao.component';
import { ListarPlantaoSegundaInstanciaComponent } from './segunda-instancia/listar-plantao-segunda-instancia/listar-plantao-segunda-instancia.component';
import { CadastrarPlantaoSegundaInstanciaComponent } from './segunda-instancia/cadastrar-plantao-segunda-instancia/cadastrar-plantao-segunda-instancia.component';
import { CadastrarTurmaRecursalComponent } from './turma-recursal/cadastrar-turma-recursal/cadastrar-turma-recursal.component';
import { ListarTurmaRecursalComponent } from './turma-recursal/listar-turma-recursal/listar-turma-recursal.component';

const routes: Routes = [
  {
    path: '',
    component: ListarPlantaoComponent,
  },
  {
    path: 'cadastrar-plantao',
    component: CadastrarPlantaoComponent,
  },
  {
    path: 'lista-plantao-segunda-instancia',
    component: ListarPlantaoSegundaInstanciaComponent,
  },
  {
    path: 'cadastrar-plantao-segunda-instancia',
    component: CadastrarPlantaoSegundaInstanciaComponent,
  },
  {
    path: 'cadastrar-plantao-turma-recursal',
    component: CadastrarTurmaRecursalComponent,
  },
  {
    path: 'lista-plantao-turma-recursal',
    component: ListarTurmaRecursalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantaoRoutingModule {}
