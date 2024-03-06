import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../components/boas-vindas/boas-vindas.module').then(
            (m) => m.BoasVindasModule
          ),
      },
      {
        path: 'area-regiao',
        loadChildren: () =>
          import('../../components/administracao/administracao.module').then(
            (m) => m.AdministracaoModule
          ),
      },
      {
        path: 'plantao',
        loadChildren: () =>
          import('../../components/plantao/plantao.module').then(
            (m) => m.PlantaoModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
