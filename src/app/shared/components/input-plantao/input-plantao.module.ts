import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputPlantaoComponent } from './input-plantao/input-plantao.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@NgModule({
  declarations: [InputPlantaoComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
  exports: [InputPlantaoComponent],
})
export class InputPlantaoModule {}
