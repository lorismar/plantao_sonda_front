import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoasVindasModule } from '../boas-vindas/boas-vindas.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import(
        '../../components/administracao/area-regiao/area-regiao.module'
      ).then((m) => m.AreaRegiaoModule),
  },
  {
    path: 'plantao',
    loadChildren: () =>
      import('../plantao/plantao.module').then((m) => m.PlantaoModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracaoRoutingModule {}
