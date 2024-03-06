import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  faCircleMinus,
  faCirclePlus,
  faExclamationTriangle,
  faEye,
  faPenToSquare,
  faPlus,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { PlantaoService } from '../../../../client/plantao/plantao.service';
import Swal from 'sweetalert2';
import { AuthorizationService } from '../../../../client/auth/authorization.service';
import { PlantaoModel } from '../../../../model/plantao-model';
import { AreaRegiaoService } from '../../../../client/area-regiao/area-regiao.service';
import {
  capitalizeFirstLetterEachWord,
  validadorEmail,
  validadorTelefone,
} from '../../../../shared/validatores/validators';
import { KeycloakService } from 'keycloak-angular';
import { OriginalPlantaoModel } from '../../../../model/original-plantao-model';
import { ToastrService } from 'ngx-toastr';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-listar-plantao',
  templateUrl: './listar-plantao.component.html',
  styleUrls: ['./listar-plantao.component.scss'],
})
export class ListarPlantaoComponent implements OnInit, OnDestroy {
  @ViewChild('comarcaInput') comarcaInput: any;
  constructor(
    private plantaoService: PlantaoService,
    public authorizationService: AuthorizationService,
    private areaSegiaoService: AreaRegiaoService,
    private keycloakService: KeycloakService,
    private toastService: ToastrService
  ) {
    this.plantaoModel.servidor = {
      nome: '',
    };
    this.plantaoModel.oficialJustica = {
      nome: '',
    };
    this.plantaoModel.magistrado = {
      nome: '',
    };
  }
  listaPlantoes: any[] = [];
  loading: boolean = false;
  loadingModalEdicao: boolean = false;
  loadingBotaoSalvar: boolean = false;
  plantaoModel = new PlantaoModel();
  listaAreasRegioes: any[] = [];
  comarcasSelecionadas: any[] = [];
  orgaosJulgadoresSelecionados: any[] = [];
  compentenciasSelecionadas: any[] = [];
  idPlantao: any;
  selectedItem: any;
  total: number = 0;
  size: number = 10;
  page: number = 0;
  editando: boolean = false;
  visible: boolean = false;
  dataInicial: string = '';
  dataFinal: string = '';
  alteracoesRecentes: any[] = [];
  originalPlantaoModel = new OriginalPlantaoModel();
  nomeMagistrado: string = '';
  sugestoesMagistrados: any[] = [];
  magistrados: any[] = [];
  servidores: any[] = []; // Aqui você colocaria a resposta da sua API
  sugestoesServidores: any[] = [];
  selectedItemComarca: any;
  suggestions: any;
  idServidor: number = 0;
  idOficialJustica: number = 0;
  idMagistrado: number = 0;
  regiaoSelecionada: any;
  suggestionsServidores: any[] = [];
  suggestionsMagistrados: any[] = [];
  private searchTimer: any;
  filtroLista = {
    comarca: '',
    dataCadastro: '',
    dataInicial: '',
    dataFinal: '',
  };
  suggestionsFiltro: any[] = [];
  loadingFiltro: boolean = false;
  filtrado: boolean = false;

  ngOnInit(): void {
    if (!this.authorizationService.plantaoJudicial1Grau()) {
      this.authorizationService.modalDeslogar();
    } else {
      this.buscarPlantoes();
    }
  }

  carregarServidores() {
    // this.plantaoService.getServidoresPje().subscribe(
    //   (data: any) => {
    //     this.servidores = data;
    //     this.prepararSugestoesServidores();
    //   },
    //   (error) => {
    //     console.error('Erro ao buscar servidores:', error.error.message);
    //   }
    // );
  }
  prepararSugestoesServidores() {
    this.sugestoesServidores = this.servidores.map((servidor) => {
      return {
        nome: servidor.usuarioLogin.nome,
        id: servidor.usuarioLogin.id,
      };
    });
  }
  buscarServidores(event: any) {
    // if (event && event.length > 0) {
    //   this.plantaoService.getServidoresPje().subscribe(
    //     (data: any) => {
    //       this.servidores = data;
    //       const servidoresEncontrados = this.servidores.filter((servidor) =>
    //         servidor.usuarioLogin.nome
    //           .toLowerCase()
    //           .includes(event.toLowerCase())
    //       );
    //
    //       this.sugestoesServidores = servidoresEncontrados.map(
    //         (servidor) => servidor.usuarioLogin
    //       );
    //     },
    //     (error) => {
    //       console.error('Erro ao buscar servidores:', error);
    //     }
    //   );
    // } else {
    //   this.sugestoesServidores = [];
    // }
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
          this.toastService.warning('Magistrado não encontrado.', 'Atenção!');
        }
      },
    });
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
  addMagistradoAoModel(objetoMagistradoRetorno: any) {
    if (objetoMagistradoRetorno) {
      const magistradoComIdRenomeado = {
        idPje: objetoMagistradoRetorno.idPje
          ? objetoMagistradoRetorno.idPje
          : objetoMagistradoRetorno.id,
        id: this.idMagistrado,
        idLotacaoPje: objetoMagistradoRetorno.idLotacaoPje,
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
  addServidorAoModel(objetoServidorRetorno: any) {
    if (objetoServidorRetorno) {
      const magistradoComIdRenomeado = {
        idPje: objetoServidorRetorno.idPje
          ? objetoServidorRetorno.idPje
          : objetoServidorRetorno.id,
        idLotacaoPje: objetoServidorRetorno.idLotacaoPje,
        nome: objetoServidorRetorno.nome,
        login: objetoServidorRetorno.login,
        email: objetoServidorRetorno.email,
        ativo: objetoServidorRetorno.ativo,
        cargo: 'servidor',
        id: this.idServidor,
      };

      this.plantaoModel.servidor = magistradoComIdRenomeado;
    } else {
      console.error('O objeto do servidor retornado é inválido ou está vazio.');
    }
  }

  addOficialJusticaAoModel(objetoOficialJusticaRetorno: any) {
    if (objetoOficialJusticaRetorno) {
      const magistradoComIdRenomeado = {
        idPje: objetoOficialJusticaRetorno.idPje
          ? objetoOficialJusticaRetorno.idPje
          : objetoOficialJusticaRetorno.id,
        nome: objetoOficialJusticaRetorno.nome,
        login: objetoOficialJusticaRetorno.login,
        email: objetoOficialJusticaRetorno.email,
        ativo: objetoOficialJusticaRetorno.ativo,
        cargo: 'servidor',
        id: this.idOficialJustica,
        idLotacaoPje: objetoOficialJusticaRetorno.idLotacaoPje,
      };

      this.plantaoModel.oficialJustica = magistradoComIdRenomeado;
    } else {
      console.error('O objeto do servidor retornado é inválido ou está vazio.');
    }
  }

  getComarcas(nome: string) {
    this.areaSegiaoService.getComarcasCidade(nome).subscribe((data) => {
      this.suggestions = data.map((item: any) => item.nome);
      this.suggestionsFiltro = data.map((item: any) => item.nome);
    });
  }

  search(event: AutoCompleteCompleteEvent) {
    if (event.query.length > 3) {
      this.getComarcas(event.query);
    }
  }
  searchFiltro(event: AutoCompleteCompleteEvent) {
    if (event.query.length > 3) {
      this.getComarcas(event.query);
    }
  }
  onItemSelectFiltro(event: any) {
    this.filtroLista.comarca = event.value;
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
      this.plantaoModel.regiaoID = this.regiaoSelecionada.regiaoID;
      this.plantaoModel.regiao = this.regiaoSelecionada.nomeRegiao;
    }
  }
  podeAparecerAccordion() {
    return (
      this.comarcasSelecionadas.length > 0 &&
      this.regiaoSelecionada != null &&
      this.plantaoModel.regiao != '' &&
      this.orgaosJulgadoresSelecionados.length > 0
    );
  }
  showDialog(item: any): void {
    this.comarcasSelecionadas = [];
    this.compentenciasSelecionadas = [];
    this.orgaosJulgadoresSelecionados = [];
    this.carregarServidores();
    this.buscarAreasRegioes();
    this.plantaoModel.regiaoID = item.regiaoID;
    this.loadingModalEdicao = true;
    this.plantaoService
      .getPlantaoPorId(item.plantaoID)
      .subscribe((data: any) => {
        this.idServidor = data.servidor.id;
        this.idMagistrado = data.magistrado.id;
        this.idOficialJustica = data.oficialJustica.id;
        this.originalPlantaoModel = { ...data };
        this.populateFields(data);
        this.addServidorAoModel(data.servidor);
        this.addMagistradoAoModel(data.magistrado);
        this.addOficialJusticaAoModel(data.oficialJustica);
      });
    this.editando = true;
  }
  populateFields(data: any): void {
    this.plantaoModel.dataInicial = data.dataInicial;
    this.plantaoModel.regiao = data.nomeRegiao;
    this.plantaoModel.dataFinal = data.dataFinal;
    this.plantaoModel.magistrado = data.magistrado;
    this.plantaoModel.servidor = data.servidor;
    this.plantaoModel.telefonePlantao = data.telefonePlantao;
    this.plantaoModel.oficialJustica = data.oficialJustica;
    this.plantaoModel.cidade = data.cidade;
    this.plantaoModel.emailPlantao = data.emailPlantao;
    this.idPlantao = data.plantaoID;
  }
  limparCampos() {
    this.plantaoModel.regiao = '';
    this.plantaoModel.emailPlantao = '';
    this.plantaoModel.telefonePlantao = '';
    this.plantaoModel.cidade = '';
    this.plantaoModel.servidor = '';
    this.plantaoModel.dataFinal = '';
    this.plantaoModel.dataInicial = '';
    this.plantaoModel.oficialJustica = '';
    this.plantaoModel.magistrado = '';
    this.plantaoModel.justificativa = '';
    this.selectedItemComarca = [];
    this.selectedItem = '';
    this.plantaoModel.cidade = '';
  }

  buscarPlantoes() {
    this.loading = true;

    setTimeout(() => {
      this.plantaoService.getPlantoesPaginados(this.size, this.page).subscribe(
        (data: any) => {
          this.listaPlantoes = data.content.map((planta: any) => {
            const capitalizedPlantao = {
              ...planta,
              magistrado:
                planta.magistrado && planta.magistrado.nome
                  ? capitalizeFirstLetterEachWord(planta.magistrado.nome)
                  : 'Nome não retornado',
              nomeRegiao: planta.nomeRegiao
                ? capitalizeFirstLetterEachWord(planta.nomeRegiao)
                : 'Região não disponível',
              servidor:
                planta.servidor && planta.servidor.nome
                  ? capitalizeFirstLetterEachWord(planta.servidor.nome)
                  : 'Nome não disponível',
              oficialJustica:
                planta.oficialJustica && planta.oficialJustica.nome
                  ? capitalizeFirstLetterEachWord(planta.oficialJustica.nome)
                  : 'Nome não disponível',
            };

            return capitalizedPlantao;
          });

          this.total = data.totalElements;
          this.loading = false;
        },
        (error) => {
          Swal.fire('Falha!', 'Ocorreu um erro ao buscar os plantões', 'error');
          this.loading = false;
        }
      );
    }, 1000);
  }

  buscarAreasRegioes() {
    this.areaSegiaoService.getAreasRegioes().subscribe((data: any) => {
      this.listaAreasRegioes = data;
    });
  }
  firstName() {
    this.keycloakService.loadUserProfile().then((usuario: any) => {
      this.plantaoModel.responsavel = usuario.firstName;
    });
  }
  salvar() {
    this.firstName();
    this.loadingBotaoSalvar = true;
    this.plantaoService
      .putEditarPlantao(this.plantaoModel, this.idPlantao)
      .subscribe({
        next: (data: any) => {
          Swal.fire('Sucesso!', 'Plantão editado com sucesso.', 'success');
          this.page = 0;
          this.buscarPlantoes();
          this.limparCampos();
          this.loadingModalEdicao = false;
          this.loadingBotaoSalvar = false;
        },
        error: (err: any) => {
          this.buscarPlantoes();
          if (err.error.message == 'Sistema PJE não está respondendo') {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Atenção!',
              html: 'Sistema PJE não está respondendo',
              showConfirmButton: true,
              confirmButtonText: 'Ok',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonColor: '#46b4e8',
            }).then((response) => {
              if (response.value) {
                this.loadingBotaoSalvar = false;
                this.loadingModalEdicao = true;
                this.editando = true;
              }
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Falha!',
              html: 'Houve uma falha ao editar o Plantão.',
              showConfirmButton: true,
              confirmButtonText: 'Ok',
              allowEscapeKey: false,
              allowOutsideClick: false,
              confirmButtonColor: '#46b4e8',
            }).then((response) => {
              if (response.value) {
                this.loadingBotaoSalvar = false;
                this.loadingModalEdicao = true;
                this.editando = true;
              }
            });
          }
          this.loading = false;
          this.editando = false;
          this.loadingModalEdicao = true;
          this.loadingBotaoSalvar = false;
        },
      });
  }
  formInvalid() {
    return (
      validadorEmail(this.plantaoModel.emailPlantao) &&
      this.plantaoModel.telefonePlantao != '' &&
      validadorTelefone(this.plantaoModel.telefonePlantao) &&
      this.plantaoModel.regiao != '' &&
      this.plantaoModel.cidade != '' &&
      this.plantaoModel.oficialJustica &&
      this.plantaoModel.magistrado &&
      this.plantaoModel.dataInicial < this.plantaoModel.dataFinal &&
      this.plantaoModel.dataInicial != '' &&
      this.plantaoModel.dataInicial != '' &&
      this.plantaoModel.servidor &&
      this.plantaoModel.justificativa != ''
    );
  }

  carregarPagina(page: any) {
    if (this.filtrado) {
      this.loading = true;
      this.plantaoService
        .getFiltro(
          this.filtroLista.comarca,
          this.filtroLista.dataCadastro,
          this.filtroLista.dataInicial,
          this.filtroLista.dataFinal,
          this.size,
          page - 1
        )
        .subscribe((data: any) => {
          this.listaPlantoes = data.content.map((planta: any) => {
            const capitalizedPlantao = {
              ...planta,
              magistrado: capitalizeFirstLetterEachWord(
                planta.magistrado?.nome
              ),
              nomeRegiao: capitalizeFirstLetterEachWord(planta.nomeRegiao),
              servidor: capitalizeFirstLetterEachWord(planta.servidor?.nome),
              oficialJustica: capitalizeFirstLetterEachWord(
                planta.oficialJustica?.nome
              ),
            };

            return capitalizedPlantao;
          });
          this.total = data.totalElements;
          this.loading = false;
        });
    } else {
      this.loading = true;
      this.plantaoService
        .getPlantoesPaginados(this.size, page - 1)
        .subscribe((data: any) => {
          this.listaPlantoes = data.content.map((planta: any) => {
            const capitalizedPlantao = {
              ...planta,
              magistrado: capitalizeFirstLetterEachWord(
                planta.magistrado?.nome
              ),
              nomeRegiao: capitalizeFirstLetterEachWord(planta.nomeRegiao),
              servidor: capitalizeFirstLetterEachWord(planta.servidor?.nome),
              oficialJustica: capitalizeFirstLetterEachWord(
                planta.oficialJustica?.nome
              ),
            };

            return capitalizedPlantao;
          });
          this.total = data.totalElements;
          this.loading = false;
        });
    }
  }

  atualizarLista() {
    this.editando = false;
    this.page = 0;
    this.limparCampos();
    this.buscarAreasRegioes();
    this.buscarPlantoes();
  }
  dialogAlteracao(item: any) {
    this.plantaoService
      .getPlantaoPorId(item.plantaoID)
      .subscribe((data: any) => {
        this.dataInicial = data.dataInicial;
        this.dataFinal = data.dataFinal;
        this.alteracoesRecentes = data.alteracoesRecentes;
      });
    this.visible = true;
  }
  limparModalAlteracao() {
    this.visible = false;
  }
  ngOnDestroy() {}

  formInvalidFiltro() {
    return (
      this.filtroLista.dataInicial !== '' ||
      this.filtroLista.dataFinal !== '' ||
      this.filtroLista.dataCadastro !== '' ||
      this.filtroLista.comarca !== ''
    );
  }

  limparPesquisaFiltro() {
    this.comarcaInput.clear();
    this.filtroLista.comarca = '';
    this.filtroLista.dataCadastro = '';
    this.filtroLista.dataInicial = '';
    this.filtroLista.dataFinal = '';
    this.loadingFiltro = false;
    this.filtrado = false;
    this.page = 0;
    this.buscarPlantoes();
  }

  filtrar() {
    this.page = 0;
    this.filtrado = true;
    this.loading = true;
    this.plantaoService
      .getFiltro(
        this.filtroLista.comarca,
        this.filtroLista.dataCadastro,
        this.filtroLista.dataInicial,
        this.filtroLista.dataFinal,
        this.size,
        this.page
      )
      .subscribe({
        next: (data) => {
          this.filtrado = true;
          this.listaPlantoes = data.content.map((planta: any) => {
            const capitalizedPlantao = {
              ...planta,
              magistrado: capitalizeFirstLetterEachWord(
                planta.magistrado?.nome
              ),
              nomeRegiao: capitalizeFirstLetterEachWord(planta.nomeRegiao),
              servidor: capitalizeFirstLetterEachWord(planta.servidor?.nome),
              oficialJustica: capitalizeFirstLetterEachWord(
                planta.oficialJustica?.nome
              ),
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

  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faPlus = faPlus;
  protected readonly validadorTelefone = validadorTelefone;
  protected readonly validadorEmail = validadorEmail;
  protected readonly faExclamationTriangle = faExclamationTriangle;
  protected readonly faSearch = faSearch;
  protected readonly Event = Event;
  protected readonly event = event;
}
