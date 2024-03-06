import { Component, OnInit } from '@angular/core';
import { TurmaRecursalService } from '../../../../client/plantao/turma-recursal/turma-recursal.service';
import { Router } from '@angular/router';
import { TurmaRecursalModel } from '../../../../model/turma-recursal-model';
import { validadorTelefone } from '../../../../shared/validatores/validators';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { AuthorizationService } from '../../../../client/auth/authorization.service';

@Component({
  selector: 'app-cadastrar-turma-recursal',
  templateUrl: './cadastrar-turma-recursal.component.html',
  styleUrls: ['./cadastrar-turma-recursal.component.scss'],
})
export class CadastrarTurmaRecursalComponent implements OnInit {
  constructor(
    private turmaRecursalService: TurmaRecursalService,
    private router: Router,
    public authorizationService: AuthorizationService
  ) {}

  loading: boolean = false;
  turmaRecursal = new TurmaRecursalModel();

  ngOnInit(): void {
    if (!this.authorizationService.plantaoJudicialTurmaRecursal()) {
      this.authorizationService.modalDeslogar();
    }
  }

  limparCampos() {
    this.turmaRecursal.telefonePlantao = '';
    this.turmaRecursal.dataInicial = '';
    this.turmaRecursal.dataFinal = '';
    this.turmaRecursal.magistrado = '';
    this.turmaRecursal.orgaoJulgador = '';
  }
  salvar() {
    this.loading = true;
    this.turmaRecursalService.postTurmaRecursal(this.turmaRecursal).subscribe({
      next: (data) => {
        Swal.fire('Sucesso!', 'Plantão cadastrado com sucesso.', 'success');
        this.router.navigate(['/home/plantao/lista-plantao-turma-recursal']);
        this.loading = false;
      },
      error: (err) => {
        Swal.fire('Falha!', 'Houve uma falha ao cadastrar o Plantão.', 'error');
        this.loading = false;
      },
    });
  }
  formInvalid() {
    return (
      this.turmaRecursal.orgaoJulgador !== '' &&
      this.turmaRecursal.magistrado !== '' &&
      this.turmaRecursal.dataFinal !== '' &&
      this.turmaRecursal.dataInicial !== '' &&
      validadorTelefone(this.turmaRecursal.telefonePlantao)
    );
  }

  protected readonly validadorTelefone = validadorTelefone;
  protected readonly faPlus = faPlus;
}
