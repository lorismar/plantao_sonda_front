import { Component, OnInit } from '@angular/core';
import {
  faCircle,
  faExclamation,
  faExclamationCircle,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { obterNomeMesAtual } from '../../../shared/validatores/validators';

@Component({
  selector: 'app-inicio-consulta',
  templateUrl: './inicio-consulta.component.html',
  styleUrls: ['./inicio-consulta.component.scss'],
})
export class InicioConsultaComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  salvarLocalStorage(tipoPlantao: string) {
    localStorage.setItem('tipoPlantao', tipoPlantao);
    this.router.navigate(['consulta/lista']);
  }

  protected readonly faExclamationCircle = faExclamationCircle;
  protected readonly faCircle = faCircle;
  protected readonly obterNomeMesAtual = obterNomeMesAtual;
}
