import { Component, OnInit } from '@angular/core';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import {
  Plantao2InstanciaModel,
  Servidor,
} from '../../../../model/plantao-2-instancia-model';
import { validadorTelefone } from '../../../../shared/validatores/validators';
import { AreaRegiaoService } from '../../../../client/area-regiao/area-regiao.service';
import { PlantaoSegundaInstanciaService } from '../../../../client/plantao/plantao-segunda-instancia/plantao-segunda-instancia.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AuthorizationService } from '../../../../client/auth/authorization.service';
import { PlantaoService } from '../../../../client/plantao/plantao.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastrar-plantao-segunda-instancia',
  templateUrl: './cadastrar-plantao-segunda-instancia.component.html',
  styleUrls: ['./cadastrar-plantao-segunda-instancia.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CadastrarPlantaoSegundaInstanciaComponent implements OnInit {
  constructor(
    private plantaoSegundaInstanciaService: PlantaoSegundaInstanciaService,
    private router: Router,
    private authorizationService: AuthorizationService,
    private toastService: ToastrService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  selectedItemComarca: any;
  suggestions!: any[];
  selectedItem: any;
  loading: boolean = false;
  inputsServidores: any[] = [
    { cargo: 'Desembargador', nome: '' },
    { cargo: 'Coordenador', nome: '' },
  ];
  novoServidor: Servidor = {
    cargo: '',
    nome: '',
  };
  suggestionsServidores: any[] = [];
  suggestionsMagistrados: any[] = [];
  nomeServidorVazio: boolean = false;
  plantao2InstanciaModel = new Plantao2InstanciaModel();
  private searchTimer: any;

  ngOnInit(): void {
    if (!this.authorizationService.plantaoJudicial2Grau()) {
      this.authorizationService.modalDeslogar();
    } else {
      this.getOrgaoJulgador();
    }
  }
  getOrgaoJulgador() {
    this.plantaoSegundaInstanciaService.getOrgaoJulgadorColegiado().subscribe({
      next: (data) => {
        this.suggestions = data.map((item: any) => item);
      },
      error: (error) => {
        if (error.error.message == 'Sistema PJE não está respondendo') {
          Swal.fire(
            'Atenção!',
            'Sistema PJE não está respondendo, tente novamente mais tarde!',
            'warning'
          );
        } else {
          this.toastService.warning(
            'Houve uma falha ao buscar Órgãos Julgadores.' +
              error.error.message,
            'Atenção!'
          );
        }
      },
    });
  }
  transformarOrgaoJulgador(orgaoOriginal: any): any {
    this.plantao2InstanciaModel.idOrgaoJulgadorColegiado = orgaoOriginal.id;
    const { orgaoJulgador, ...orgaoSemOrgaoJulgador } = orgaoOriginal;
    if (orgaoSemOrgaoJulgador.orgaoJulgadores) {
      orgaoSemOrgaoJulgador.orgaoJulgadores =
        orgaoSemOrgaoJulgador.orgaoJulgadores.map((orgao: any) => {
          const { orgaoJulgador, ...orgaoSemCargosELocalizacao } = orgao;
          if (orgao.orgaoJulgador) {
            const { ativo, nome, sigla, localizacao } = orgao.orgaoJulgador;
            return {
              ...orgaoSemCargosELocalizacao,
              id: orgao.id,
              ativo,
              nome,
              sigla,
              idLocalizacao: localizacao?.id,
            };
          }
          return orgaoSemCargosELocalizacao;
        });
    }

    return orgaoSemOrgaoJulgador;
  }

  onItemSelect(event: any) {
    this.selectedItem = event.value;
    const orgaoTransformado = this.transformarOrgaoJulgador(this.selectedItem);
    this.plantao2InstanciaModel.orgaoJulgadorColegiado = {
      ...orgaoTransformado,
      orgaoJulgadorID: this.selectedItem.id,
    };
  }

  adicionarNovoServidor() {
    this.inputsServidores.push({ ...this.novoServidor });
    this.novoServidor = { cargo: '', nome: '' };
  }
  getServidores(nome: string) {
    this.plantaoSegundaInstanciaService.getServidoresPje(nome).subscribe({
      next: (data) => {
        this.suggestionsServidores = data.map((item: any) => item.usuarioLogin);
      },
      error: (err) => {
        if (err.error.message == 'Sistema PJE não está respondendo') {
          Swal.fire(
            'Atenção!',
            'Sistema PJE não está respondendo, tente novamente mais tarde!',
            'warning'
          );
        } else {
          this.toastService.warning('Servidor não encontrado.', 'Atenção!');
        }
      },
    });
  }
  getMagistrados(nome: string) {
    this.plantaoSegundaInstanciaService.getMagistradosPje(nome).subscribe({
      next: (data) => {
        this.suggestionsMagistrados = data.map(
          (item: any) => item.usuarioLogin
        );
      },
      error: (err) => {
        if (err.error.message == 'Sistema PJE não está respondendo') {
          Swal.fire(
            'Atenção!',
            'Sistema PJE não está respondendo, tente novamente mais tarde!',
            'warning'
          );
        } else {
          this.toastService.warning(
            'Desembargador não encontrado.',
            'Atenção!'
          );
        }
      },
    });
  }
  addServidorAoModel(objetoServidorRetorno: any, i: number) {
    if (objetoServidorRetorno && objetoServidorRetorno.id) {
      const servidorComIdRenomeado = {
        idPje: objetoServidorRetorno.id,
        nome: objetoServidorRetorno.nome,
        login: objetoServidorRetorno.login,
        email: objetoServidorRetorno.email,
        ativo: objetoServidorRetorno.ativo,
        cargo: i == 1 ? 'servidor' : 'servidor',
      };

      this.plantao2InstanciaModel.servidores[i] = servidorComIdRenomeado;
    } else {
      console.error('O objeto do servidor retornado é inválido ou está vazio.');
    }
  }
  addMagistradoAoModel(objetoServidorRetorno: any, i: number) {
    if (objetoServidorRetorno && objetoServidorRetorno.id) {
      const servidorComIdRenomeado = {
        idPje: objetoServidorRetorno.id,
        nome: objetoServidorRetorno.nome,
        login: objetoServidorRetorno.login,
        email: objetoServidorRetorno.email,
        ativo: objetoServidorRetorno.ativo,
        cargo: 'magistrado',
      };

      this.plantao2InstanciaModel.servidores[i] = servidorComIdRenomeado;
    } else {
      console.error('O objeto do servidor retornado é inválido ou está vazio.');
    }
  }
  searchServidores(event: AutoCompleteCompleteEvent) {
    const minLength = 5;
    clearTimeout(this.searchTimer);
    if (event.query.trim().length < minLength) {
      this.searchTimer = setTimeout(() => {
        if (event.query.trim().length < minLength) {
          this.toastService.info(
            'Para realizar a pesquisa digite ao menos 5 caracteres',
            'Atenção!'
          );
        }
      }, 2000);
    } else {
      this.getServidores(event.query);
    }
  }
  searchMagistrados(event: AutoCompleteCompleteEvent) {
    const minLength = 5;
    clearTimeout(this.searchTimer);
    if (event.query.trim().length < minLength) {
      this.searchTimer = setTimeout(() => {
        if (event.query.trim().length < minLength) {
          this.toastService.info(
            'Para realizar a pesquisa digite ao menos 5 caracteres',
            'Atenção!'
          );
        }
      }, 2000);
    } else {
      this.getMagistrados(event.query);
    }
  }
  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Será realizado a lotação no PJE, deseja continuar?',
      icon: 'pi pi-exclamation-triangle text-warning',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.salvar();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
          life: 3000,
        });
      },
    });
  }
  salvar() {
    let posicoesVazias: number[] = [];

    for (let i: number = 0; i < this.inputsServidores.length; i++) {
      if (this.inputsServidores[i].nome === '') {
        this.nomeServidorVazio = true;
        posicoesVazias.push(i + 1);
      }
    }

    if (!this.nomeServidorVazio) {
      this.loading = true;
      this.plantaoSegundaInstanciaService
        .postPlantao2Instancia(this.plantao2InstanciaModel)
        .subscribe({
          next: (data) => {
            Swal.fire('Sucesso!', 'Plantão cadastrado com sucesso.', 'success');
            this.router.navigate([
              '/home/plantao/lista-plantao-segunda-instancia',
            ]);
            this.loading = false;
          },
          error: (error) => {
            Swal.fire(
              'Falha',
              'Houve um erro ao realizar o cadastro de plantão.' +
                error.error.message,
              'error'
            );
            this.loading = false;
          },
        });
    } else {
      const mensagem =
        posicoesVazias.length > 1
          ? `Os servidores da ${posicoesVazias.join(
              'ª, '
            )}ª posições estão com os nomes vazios. É necessário buscar e selecionar o Servidor desejado.`
          : `O servidor da ${posicoesVazias.join(
              ', '
            )}ª posição está com o nome vazio. É necessário buscar e selecionar o Servidor desejado.`;

      Swal.fire('Atenção!', mensagem, 'warning');
    }
  }

  excluirServidor(index: number) {
    this.inputsServidores.splice(index, 1);
    this.plantao2InstanciaModel.servidores.splice(index, 1);
  }
  limparCampos() {
    this.inputsServidores.length = 2;
    this.inputsServidores = [
      { cargo: 'Desembargador', nome: '' },
      { cargo: 'Coordenador', nome: '' },
    ];
    this.selectedItem = '';
    this.selectedItemComarca = '';
    this.plantao2InstanciaModel = new Plantao2InstanciaModel();
  }

  formInvalid() {
    return (
      validadorTelefone(this.plantao2InstanciaModel.telefonePlantao) &&
      this.plantao2InstanciaModel.servidores.length > 1 &&
      this.plantao2InstanciaModel.endereco !== '' &&
      this.plantao2InstanciaModel.dataInicial !== '' &&
      this.plantao2InstanciaModel.dataFinal !== '' &&
      this.plantao2InstanciaModel.orgaoJulgadorColegiado != null &&
      this.selectedItemComarca != null
    );
  }
  protected readonly faPlus = faPlus;
  protected readonly validadorTelefone = validadorTelefone;
  protected readonly faTrashCan = faTrashCan;
}
