import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaAreaRegiaoComponent } from './listar-area-regiao/lista-area-regiao.component';
import { CadastroAreaRegiaoComponent } from './cadastrar-area-regiao/cadastro-area-regiao.component';

const routes: Routes = [
  {
    path: '',
    component: ListaAreaRegiaoComponent,
  },
  {
    path: 'cadastrar-area-regiao',
    component: CadastroAreaRegiaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaRegiaoRoutingModule {}
