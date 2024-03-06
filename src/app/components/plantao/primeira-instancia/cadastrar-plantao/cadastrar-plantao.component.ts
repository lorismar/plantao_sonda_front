import { Component, OnInit } from '@angular/core';
import { PlantaoModel } from '../../../../model/plantao-model';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  validadorEmail,
  validadorTelefone,
} from '../../../../shared/validatores/validators';
import Swal from 'sweetalert2';
import { PlantaoService } from '../../../../client/plantao/plantao.service';
import { Router } from '@angular/router';
import { AreaRegiaoService } from '../../../../client/area-regiao/area-regiao.service';
import { AuthorizationService } from '../../../../client/auth/authorization.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cadastrar-plantao',
  templateUrl: './cadastrar-plantao.component.html',
  styleUrls: ['./cadastrar-plantao.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class CadastrarPlantaoComponent implements OnInit {
  constructor(
    private plantaoService: PlantaoService,
    private router: Router,
    private areaSegiaoService: AreaRegiaoService,
    public authorizationService: AuthorizationService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    if (!this.authorizationService.plantaoJudicial1Grau()) {
      this.authorizationService.modalDeslogar();
    } else {
      this.buscarAreasRegioes();
    }
  }

  loading: boolean = false;
  plantaoModel = new PlantaoModel();
  listaAreasRegioes: any[] = [];
  comarcasSelecionadas: any[] = [];
  orgaosJulgadoresSelecionados: any[] = [];
  compentenciasSelecionadas: any[] = [];
  nomeRegiaoSelecHtml: string = '';
  selectedItemComarca: any;
  selectedItemServidor: any;
  selectedItemMagistrado: any;
  selectedItemOficialJustica: any;

  suggestions: any;
  suggestionsServidores: any[] = [];
  suggestionsMagistrados: any[] = [];
  selectedItem: any;
  comarcas: any = [];
  servidores: any[] = [];
  regiaoSelecionada: any;
  private searchTimer: any;

  searchComarcas(event: AutoCompleteCompleteEvent) {
    if (event.query.length > 3) {
      this.getComarcas(event.query);
    }
  }
  searchServidores(event: AutoCompleteCompleteEvent) {
    const minLength = 5;
    clearTimeout(this.searchTimer);
    if (event.query.trim().length < minLength) {
      this.searchTimer = setTimeout(() => {
        if (event.query.trim().length < minLength) {
          this.toastrService.info(
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
          this.toastrService.info(
            'Para realizar a pesquisa digite ao menos 5 caracteres',
            'Atenção!'
          );
        }
      }, 2000);
    } else {
      this.getMagistrados(event.query);
    }
  }

  getServidores(nome: string) {
    this.plantaoService.getServidoresPje(nome).subscribe({
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
          this.toastrService.warning('Servidor não encontrado.', 'Atenção!');
        }
      },
    });
  }
  getMagistrados(nome: string) {
    this.plantaoService.getMagistradosPje(nome).subscribe({
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
          this.toastrService.warning('Magistrado não encontrado.', 'Atenção!');
        }
      },
    });
  }
  getComarcas(nome: string) {
    this.areaSegiaoService.getComarcasCidade(nome).subscribe((data) => {
      this.suggestions = data.map((item: any) => item.nome);
    });
  }
  addServidorAoModel(objetoServidorRetorno: any) {
    if (objetoServidorRetorno && objetoServidorRetorno.id) {
      const servidorComIdRenomeado = {
        idPje: objetoServidorRetorno.id,
        nome: objetoServidorRetorno.nome,
        login: objetoServidorRetorno.login,
        email: objetoServidorRetorno.email,
        ativo: objetoServidorRetorno.ativo,
        cargo: 'servidor',
      };

      this.plantaoModel.servidor = servidorComIdRenomeado;
    } else {
      console.error('O objeto do servidor retornado é inválido ou está vazio.');
    }
  }

  addOficialJusticaAoModel(objetoOficialJusticaRetorno: any) {
    if (objetoOficialJusticaRetorno && objetoOficialJusticaRetorno.id) {
      const servidorComIdRenomeado = {
        idPje: objetoOficialJusticaRetorno.id,
        nome: objetoOficialJusticaRetorno.nome,
        login: objetoOficialJusticaRetorno.login,
        email: objetoOficialJusticaRetorno.email,
        ativo: objetoOficialJusticaRetorno.ativo,
        cargo: 'servidor',
      };

      this.plantaoModel.oficialJustica = servidorComIdRenomeado;
    } else {
      console.error('O objeto do servidor retornado é inválido ou está vazio.');
    }
  }
  addMagistradoAoModel(objetoMagistradoRetorno: any) {
    if (objetoMagistradoRetorno && objetoMagistradoRetorno.id) {
      const magistradoComIdRenomeado = {
        idPje: objetoMagistradoRetorno.id,
        nome: objetoMagistradoRetorno.nome,
        login: objetoMagistradoRetorno.login,
        email: objetoMagistradoRetorno.email,
        ativo: objetoMagistradoRetorno.ativo,
        cargo: 'magistrado',
      };

      this.plantaoModel.magistrado = magistradoComIdRenomeado;
    } else {
      console.error('O objeto do servidor retornado é inválido ou está vazio.');
    }
  }

  buscarAreasRegioes() {
    this.areaSegiaoService.getAreasRegioes().subscribe((data: any) => {
      this.listaAreasRegioes = data;
    });
  }
  onItemSelect(event: any) {
    this.selectedItem = event.value;
    this.plantaoModel.cidade = this.selectedItem;
  }

  getRegiaoSelecionada(event: any) {
    this.regiaoSelecionada = event;
    if (this.regiaoSelecionada) {
      this.comarcasSelecionadas = this.regiaoSelecionada.areas[0].comarcas;
      this.compentenciasSelecionadas =
        this.regiaoSelecionada.areas[0].competencias;
      this.orgaosJulgadoresSelecionados =
        this.regiaoSelecionada.areas[0].orgaoJulgadores;
      this.orgaosJulgadoresSelecionados.sort((a, b) => {
        if (a.nome < b.nome) {
          return -1;
        }
        if (a.nome > b.nome) {
          return 1;
        }
        return 0;
      });
      this.plantaoModel.regiaoID = this.regiaoSelecionada.regiaoID;
      this.nomeRegiaoSelecHtml = this.regiaoSelecionada.nomeRegiao;
      this.plantaoModel.regiao = this.regiaoSelecionada.nomeRegiao;
    }
  }

  podeAparecerAccordion() {
    return (
      this.comarcasSelecionadas.length > 0 &&
      this.orgaosJulgadoresSelecionados.length > 0 &&
      this.regiaoSelecionada != null
    );
  }
  confirm1(event: Event) {
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
    this.loading = true;
    this.plantaoService.postPlantoes(this.plantaoModel).subscribe({
      next: (data) => {
        Swal.fire('Sucesso!', 'Plantão cadastrado com sucesso.', 'success');
        this.router.navigate(['/home/plantao']);
        this.loading = false;
      },
      error: (err) => {
        if (err.error.message == 'Sistema PJE não está respondendo') {
          Swal.fire('Atenção!', err.error.message, 'warning');
        } else {
          Swal.fire('Falha!', 'Houve uma falha ao cadastrar!', 'error');
        }
        this.loading = false;
      },
    });
  }
  limparCampos() {
    this.plantaoModel.flag = '';
    this.plantaoModel.regiao = '';
    this.plantaoModel.emailPlantao = '';
    this.plantaoModel.telefonePlantao = '';
    this.plantaoModel.cidade = '';
    this.plantaoModel.servidor = '';
    this.plantaoModel.dataFinal = '';
    this.plantaoModel.dataInicial = '';
    this.plantaoModel.oficialJustica = '';
    this.plantaoModel.magistrado = '';
    this.selectedItemComarca = [];
    this.selectedItem = '';
    this.comarcasSelecionadas = [];
    this.compentenciasSelecionadas = [];
    this.orgaosJulgadoresSelecionados = [];
    this.plantaoModel.regiaoID = 0;
    this.plantaoModel.servidor = { nome: '' };
  }
  formInvalid() {
    return (
      validadorEmail(this.plantaoModel.emailPlantao) &&
      this.plantaoModel.telefonePlantao != '' &&
      validadorTelefone(this.plantaoModel.telefonePlantao) &&
      this.plantaoModel.regiao != '' &&
      this.plantaoModel.flag != '' &&
      this.regiaoSelecionada != '' &&
      this.plantaoModel.cidade != '' &&
      this.plantaoModel.oficialJustica &&
      this.plantaoModel.magistrado &&
      this.plantaoModel.dataInicial < this.plantaoModel.dataFinal &&
      this.plantaoModel.dataInicial != '' &&
      this.plantaoModel.dataInicial != '' &&
      this.plantaoModel.servidor &&
      this.selectedItemComarca != null
    );
  }
  selecionarFlag(item: any): void {
    this.orgaosJulgadoresSelecionados.forEach((i) => {
      if (i !== item) {
        i.selecionado = false;
      }
    });
    item.selecionado = !item.selecionado;
    if (item.selecionado) {
      this.plantaoModel.flag = item.nome;
    } else {
      this.plantaoModel.flag = '';
    }
    console.log(this.plantaoModel.flag);
    console.log(this.orgaosJulgadoresSelecionados);
  }

  protected readonly faPlus = faPlus;
  protected readonly validadorTelefone = validadorTelefone;
  protected readonly validadorEmail = validadorEmail;
  protected readonly event = event;
  protected readonly length = length;
}
