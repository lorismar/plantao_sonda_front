import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoasVindasRoutingModule } from './boas-vindas-routing.module';
import { BoasVindasComponent } from './boas-vindas.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [BoasVindasComponent],
  imports: [
    CommonModule,
    BoasVindasRoutingModule,
    FontAwesomeModule,
    TooltipModule,
  ],
})
export class BoasVindasModule {}
