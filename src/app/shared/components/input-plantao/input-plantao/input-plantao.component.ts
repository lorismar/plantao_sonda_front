import { Component, Input, OnInit } from '@angular/core';
import {
  validadorEmail,
  validadorTelefone,
} from '../../../validatores/validators';

@Component({
  selector: 'app-input-plantao',
  templateUrl: './input-plantao.component.html',
  styleUrls: ['./input-plantao.component.scss'],
})
export class InputPlantaoComponent implements OnInit {
  @Input() label: string = '';
  @Input() typeInput: string = '';
  @Input() ngModelInput: any;
  @Input() classeInput: string = '';
  @Input() placeholder: string = '';
  @Input() ngClassInputValid: any;
  @Input() ngClassInputInvalid: any;
  @Input() obrigatorio: boolean = false;
  @Input() mask: string = '';
  @Input() validacao: any;
  @Input() validadores: boolean = false;

  constructor() {}
  ngOnInit(): void {}
  validador(): boolean {
    if (!this.validadores) {
      return this.ngModelInput != '';
    } else {
      const isTelefoneValido = validadorTelefone(this.ngModelInput);
      const isEmailValido = validadorEmail(this.ngModelInput);

      return (
        (isTelefoneValido || isEmailValido) &&
        (!isTelefoneValido || !isEmailValido)
      );
    }
  }
}
