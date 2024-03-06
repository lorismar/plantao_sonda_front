import { Component, OnInit, ViewChild } from '@angular/core';
import { PlantaoSegundaInstanciaService } from '../../../../client/plantao/plantao-segunda-instancia/plantao-segunda-instancia.service';
import {
  faExclamationTriangle,
  faEye,
  faPenToSquare,
  faPlus,
  faSearch,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import {
  Plantao2InstanciaModel,
  Servidor,
} from '../../../../model/plantao-2-instancia-model';
import {
  capitalizeFirstLetterEachWord,
  validadorEmail,
  validadorTelefone,
} from '../../../../shared/validatores/validators';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AreaRegiaoService } from '../../../../client/area-regiao/area-regiao.service';
import Swal from 'sweetalert2';
import { KeycloakService } from 'keycloak-angular';
import { AuthorizationService } from '../../../../client/auth/authorization.service';
import { OrigialPlantao2Model } from '../../../../model/origial-plantao2-model';
import { PlantaoService } from '../../../../client/plantao/plantao.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-listar-plantao-segunda-instancia',
  templateUrl: './listar-plantao-segunda-instancia.component.html',
  styleUrls: ['./listar-plantao-segunda-instancia.component.scss'],
})
export class ListarPlantaoSegundaInstanciaComponent implements OnInit {
  @ViewChild('comarcaInput') comarcaInput: any;
  @ViewChild('servidorInput') servidorInput: any;
  constructor(
    private plantao2instanciaService: PlantaoSegundaInstanciaService,
    public authorizationService: AuthorizationService,
    private keycloakService: KeycloakService,
    private plantaoService: PlantaoService,
    private toastService: ToastrService
  ) {}

  listaPlantoes: any[] = [];
  plantao2InstanciaModel = new Plantao2InstanciaModel();
  original2plantaoModel = new OrigialPlantao2Model();

  total: number = 0;
  size: number = 10;
  page: number = 0;

  loadingModalEdicao: boolean = false;
  loadingBotaoSalvar: boolean = false;
  editando: boolean = false;
  loading: boolean = false;
  visible: boolean = false;
  loadingVisualizarEdicao: boolean = false;

  inputsServidores: any[] = [
    { cargo: 'Desembargador', nome: '' },
    { cargo: 'Coordenador', nome: '' },
  ];
  filtroLista = {
    orgaoJulgador: '',
    dataInicial: '',
    dataFinal: '',
  };
  suggestionsFiltro: any[] = [];
  loadingFiltro: boolean = false;
  filtrado: boolean = false;

  suggestionsMagistrados: any[] = [];
  selectedItem: any;
  selectedItemOrgaoJulgador: any;
  novoServidor: Servidor = {
    cargo: '',
    nome: '',
  };
  suggestions: any;
  suggestionsServidores: any[] = [];
  idPlantao: any;
  alteracoesRecentes: any[] = [];
  nomeServidorVazio: boolean = false;
  mes: string = '';
  selectedItemFiltro: any;
  private searchTimer: any;

  ngOnInit(): void {
    if (!this.authorizationService.plantaoJudicial2Grau()) {
      this.authorizationService.modalDeslogar();
    } else {
      this.buscarPlantoes();
      this.getOrgaoJulgadorFiltro();
    }
  }
  getOrgaoJulgadorFiltro() {
    this.plantao2instanciaService
      .getOrgaoJulgadorColegiado()
      .subscribe((data) => {
        this.suggestionsFiltro = data;
      });
  }
  buscarPlantoes(): void {
    this.plantao2instanciaService
      .getPlantao2Instancia(this.size, this.page)
      .subscribe((data: any) => {
        this.listaPlantoes = data.content.map((planta: any) => {
          const desembargadorName =
            planta.servidores && planta.servidores.length > 0
              ? capitalizeFirstLetterEachWord(planta.servidores[0].nome)
              : '';
          const capitalizedPlantao = {
            ...planta,
            desembargador: desembargadorName,
          };
          return capitalizedPlantao;
        });

        this.total = data.totalElements;
      });
  }
  carregarPagina(page: any) {
    this.loading = true;
    if (this.filtrado) {
      this.plantao2instanciaService
        .getFiltro(
          this.filtroLista.orgaoJulgador,
          this.filtroLista.dataInicial,
          this.filtroLista.dataFinal,
          this.size,
          this.page
        )
        .subscribe((data: any) => {
          this.listaPlantoes = data.content.map((planta: any) => {
            const desembargadorName =
              planta.servidores && planta.servidores.length > 0
                ? capitalizeFirstLetterEachWord(planta.servidores[0].nome)
                : '';
            const capitalizedPlantao = {
              ...planta,
              desembargador: desembargadorName,
            };
            return capitalizedPlantao;
          });
          this.total = data.totalElements;
          this.loading = false;
        });
    } else {
      this.plantao2instanciaService
        .getPlantao2Instancia(this.size, page - 1)
        .subscribe((data: any) => {
          this.listaPlantoes = data.content.map((planta: any) => {
            const desembargadorName =
              planta.servidores && planta.servidores.length > 0
                ? capitalizeFirstLetterEachWord(planta.servidores[0].nome)
                : '';
            const capitalizedPlantao = {
              ...planta,
              desembargador: desembargadorName,
            };
            return capitalizedPlantao;
          });
          this.total = data.totalElements;
          this.loading = false;
        });
    }
  }
  showDialog(item: any): void {
    this.loadingVisualizarEdicao = true;
    this.editando = true;
    this.loadingModalEdicao = true;
    this.plantao2InstanciaModel.justificativa = '';
    this.plantao2instanciaService
      .getPlantao2InstanciaPorId(item.plantaoID)
      .subscribe((data: any) => {
        this.original2plantaoModel = { ...data };
        this.plantao2InstanciaModel.orgaoJulgadorColegiado = {
          ...data.orgaoJulgadorColegiado,
          orgaoJulgadorID: data.orgaoJulgadorColegiado.id,
          orgaoJulgadores: data.orgaoJulgadorColegiado.orgaoJulgadores.map(
            (orgao: any) => {
              return {
                ...orgao,
              };
            }
          ),
        };

        this.selectedItemOrgaoJulgador =
          this.plantao2InstanciaModel.orgaoJulgadorColegiado;
        this.getOrgaoJulgador();
        this.populateFields(data);
        setTimeout(() => {
          this.loadingVisualizarEdicao = false;
        }, 500);
      });
  }

  populateFields(data: any): void {
    this.idPlantao = data.plantaoID;
    this.plantao2InstanciaModel.servidores = data.servidores;
    this.plantao2InstanciaModel.telefonePlantao = data.telefonePlantao;
    this.plantao2InstanciaModel.orgaoJulgadorColegiado =
      this.selectedItemOrgaoJulgador;
    this.plantao2InstanciaModel.endereco = data.endereco;
    this.plantao2InstanciaModel.dataInicial = data.dataInicial;
    this.plantao2InstanciaModel.dataFinal = data.dataFinal;
    this.inputsServidores = data.servidores;
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
  getMagistrados(nome: string) {
    this.plantao2instanciaService.getMagistradosPje(nome).subscribe({
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
  limparCampos() {
    this.plantao2InstanciaModel.dataFinal = '';
    this.plantao2InstanciaModel.dataInicial = '';
    this.plantao2InstanciaModel.telefonePlantao = '';
    this.plantao2InstanciaModel.endereco = '';
    this.plantao2InstanciaModel.servidores = [];
    this.inputsServidores.length = 2;
    this.inputsServidores[0].nome = '';
    this.inputsServidores[1].nome = '';
    this.plantao2InstanciaModel.orgaoJulgadorColegiado = [];
    this.selectedItem = '';
    this.selectedItemOrgaoJulgador = [];
    this.plantao2InstanciaModel.justificativa = '';
    this.plantao2InstanciaModel = new Plantao2InstanciaModel();
    this.servidorInput.clear();
  }
  limparModalAlteracao() {
    this.visible = false;
  }

  getOrgaoJulgador() {
    this.plantao2instanciaService
      .getOrgaoJulgadorColegiado()
      .subscribe((data: any[]) => {
        const formatarOrgao = (orgao: any) => {
          const orgaoFormatado: any = {
            id: orgao.id,
            nome: orgao.nome,
            idLocalizacao: orgao.idLocalizacao,
            idJurisdicao: orgao.idJurisdicao,
            ativo: orgao.ativo,
          };
          if (orgao.orgaoJulgadores && orgao.orgaoJulgadores.length > 0) {
            orgaoFormatado.orgaoJulgadores = orgao.orgaoJulgadores.map(
              (orgaoJulgador: any) => {
                return {
                  id: orgaoJulgador.id,
                  ativo: orgaoJulgador.orgaoJulgador.localizacao.ativo || null,
                  nome: orgaoJulgador.orgaoJulgador.localizacao.nome || null,
                  sigla: orgaoJulgador.orgaoJulgador.sigla || null,
                  idLocalizacao:
                    orgaoJulgador.orgaoJulgador.localizacao.id || null,
                };
              }
            );
          }

          return orgaoFormatado;
        };

        this.suggestions = data.map(formatarOrgao);
        const position = this.findPosition();
        this.selectedItemOrgaoJulgador = this.suggestions[position];
      });
  }
  findPosition(): number {
    const index = this.suggestions.findIndex(
      (suggestion: any) => suggestion.id === this.selectedItemOrgaoJulgador.id
    );
    return index;
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
          this.toastService.warning('Servidor não encontrado.', 'Atenção!');
        }
      },
    });
  }
  onItemSelect(event: any) {
    this.selectedItemOrgaoJulgador = event.value;
    this.plantao2InstanciaModel.orgaoJulgadorColegiado = {
      ...this.selectedItemOrgaoJulgador,
      orgaoJulgadorID: event.value.id,
    };
  }

  excluirServidor(index: number) {
    this.plantao2InstanciaModel.servidores.splice(index, 1);
  }

  adicionarNovoServidor() {
    this.inputsServidores.push({ ...this.novoServidor });
    this.novoServidor = { cargo: '', nome: '' };
  }
  firstName() {
    this.keycloakService.loadUserProfile().then((usuario: any) => {
      this.plantao2InstanciaModel.responsavel = usuario.firstName;
    });
  }
  salvar() {
    this.firstName();
    this.loadingBotaoSalvar = true;
    let posicoesVazias: number[] = [];

    for (let i: number = 0; i < this.inputsServidores.length; i++) {
      if (this.inputsServidores[i].nome === '') {
        this.nomeServidorVazio = true;
        posicoesVazias.push(i + 1);
      }
    }
    if (!this.nomeServidorVazio) {
      this.plantao2instanciaService
        .putEditarPlantao2Instancia(this.plantao2InstanciaModel, this.idPlantao)
        .subscribe({
          next: (data) => {
            Swal.fire('Sucesso!', 'Plantão editado com sucesso.', 'success');
            this.page = 0;
            this.buscarPlantoes();
            this.loadingModalEdicao = false;
            this.loadingBotaoSalvar = false;
            this.editando = false;
          },
          error: (error) => {
            this.loadingModalEdicao = false;
            this.loading = false;
            this.loadingBotaoSalvar = false;
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Falha!',
              html: 'Houve um erro ao editar plantão!',
              showConfirmButton: true,
              confirmButtonText: 'Ok',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonColor: '#46b4e8',
            }).then((response) => {
              if (response.value) {
                this.loadingModalEdicao = true;
                this.editando = true;
              }
            });
          },
        });
    } else {
      this.loading = false;
      this.loadingModalEdicao = false;
      this.loadingBotaoSalvar = false;
      const mensagem =
        posicoesVazias.length > 1
          ? `Os servidores da ${posicoesVazias.join(
              'ª, '
            )}ª posições estão com os nomes vazios. É necessário buscar e selecionar o Servidor desejado.`
          : `O servidor da ${posicoesVazias.join(
              ', '
            )}ª posição está com o nome vazio. É necessário buscar e selecionar o Servidor desejado.`;

      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Atenção!',
        html: mensagem,
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonColor: '#46b4e8',
      }).then((response) => {
        if (response.value) {
          this.loadingModalEdicao = true;
          this.editando = true;
        }
      });
    }
  }
  formInvalid() {
    return (
      this.plantao2InstanciaModel.justificativa != '' &&
      validadorTelefone(this.plantao2InstanciaModel.telefonePlantao) &&
      this.plantao2InstanciaModel.servidores.length > 1 &&
      this.plantao2InstanciaModel.endereco !== '' &&
      this.plantao2InstanciaModel.dataInicial !== '' &&
      this.plantao2InstanciaModel.dataFinal !== '' &&
      this.plantao2InstanciaModel.orgaoJulgadorColegiado != null &&
      this.selectedItemOrgaoJulgador != null
    );
  }

  dialogAlteracao(item: any) {
    this.plantao2instanciaService
      .getPlantao2InstanciaPorId(item.plantaoID)
      .subscribe((data: any) => {
        this.mes = data.periodo;
        this.alteracoesRecentes = data.alteracoesRecentes;
      });
    this.visible = true;
  }
  atualizarListagem() {
    this.page = 0;
    this.buscarPlantoes();
    this.editando = false;
    this.limparPesquisaFiltro();
  }

  onItemSelectFiltro(event: any) {
    this.filtroLista.orgaoJulgador = event.value.nome;
  }
  limparPesquisaFiltro() {
    this.filtroLista = {
      orgaoJulgador: '',
      dataFinal: '',
      dataInicial: '',
    };
    this.selectedItemFiltro = null;
    this.loadingFiltro = false;
    this.filtrado = false;
    this.page = 0;
    this.buscarPlantoes();
  }
  filtrar() {
    this.page = 0;
    this.filtrado = true;
    this.loading = true;
    this.plantao2instanciaService
      .getFiltro(
        this.filtroLista.orgaoJulgador,
        this.filtroLista.dataInicial,
        this.filtroLista.dataFinal,
        this.size,
        this.page
      )
      .subscribe({
        next: (data) => {
          this.filtrado = true;
          this.listaPlantoes = data.content.map((planta: any) => {
            const desembargadorName =
              planta.servidores && planta.servidores.length > 0
                ? capitalizeFirstLetterEachWord(planta.servidores[0].nome)
                : '';
            const capitalizedPlantao = {
              ...planta,
              desembargador: desembargadorName,
            };
            return capitalizedPlantao;
          });
          this.total = data.totalElements;
          if (this.total == 0 && this.filtrado) {
            Swal.fire(
              'Atenção!',
              'Nenhum plantão encontrado com os campos informados.',
              'warning'
            );
          } else {
            this.toastService.success(
              data.totalElements == 1
                ? data.totalElements + ' plantão encontrado.'
                : data.totalElements + ' plantões encontrados.',
              'Sucesso!'
            );
          }
          this.loading = false;
        },
        error: (error) => {
          this.toastService.warning(
            'Falha ao filtrar Plantões!. ' + error.error.message,
            'Atenção'
          );
          this.loading = false;
        },
      });
  }
  formInvalidFiltro() {
    return (
      this.filtroLista.dataInicial !== '' ||
      this.filtroLista.dataFinal !== '' ||
      this.filtroLista.orgaoJulgador !== ''
    );
  }
  protected readonly faPlus = faPlus;
  protected readonly faPenToSquare = faPenToSquare;
  protected readonly validadorTelefone = validadorTelefone;
  protected readonly faTrashCan = faTrashCan;
  protected readonly faExclamationTriangle = faExclamationTriangle;
  protected readonly faSearch = faSearch;
}
