import { Component, Input, OnInit } from '@angular/core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-botao-voltar-header-card',
  templateUrl: './botao-voltar-header-card.component.html',
  styleUrls: ['./botao-voltar-header-card.component.scss'],
})
export class BotaoVoltarHeaderCardComponent implements OnInit {
  ngOnInit(): void {}

  @Input() texto = '';
  @Input() url: string = '';
  @Input() iconVoltarLeft: boolean = false;
  protected readonly faAngleLeft = faAngleLeft;
}
