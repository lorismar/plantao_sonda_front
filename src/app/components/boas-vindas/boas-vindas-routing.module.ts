import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoasVindasComponent } from './boas-vindas.component';

const routes: Routes = [
  {
    path: '',
    component: BoasVindasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoasVindasRoutingModule {}
