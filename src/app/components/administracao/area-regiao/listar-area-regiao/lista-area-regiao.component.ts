import { Component, OnInit } from '@angular/core';
import {
  faExclamationTriangle,
  faPenToSquare,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { AreaRegiaoService } from '../../../../client/area-regiao/area-regiao.service';
import Swal from 'sweetalert2';
import { AreaRegiaoModel } from '../../../../model/area-regiao-model';
import { AuthorizationService } from '../../../../client/auth/authorization.service';
import { capitalizeFirstLetterEachWord } from '../../../../shared/validatores/validators';
import { ModalSemPermissaoService } from '../../../../client/modal-sem-permissao/modal-sem-permissao.service';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

interface Localizacao {
  id: number;
  nome: string;
  ativo: boolean;
}

interface OrgaoJulgador {
  id: number;
  nome: string;
  sigla: string;
  ativo: boolean;
  localizacao: Localizacao;
}

@Component({
  selector: 'app-listar-area-regiao',
  templateUrl: './lista-area-regiao.component.html',
  styleUrls: ['./lista-area-regiao.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class ListaAreaRegiaoComponent implements OnInit {
  constructor(
    private areaRegiaoService: AreaRegiaoService,
    public authorizationService: AuthorizationService,
    private modal: ModalSemPermissaoService,
    private keycloakService: KeycloakService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private toastService: ToastrService
  ) {}
  ngOnInit(): void {
    if (!this.authorizationService.manterRegiaoPlantao()) {
      this.modal.modalDeslogar();
    } else {
      this.buscarAreaRegiao();
      this.buscarOrgaoPje();
      this.buscarComarcaPje();
    }
  }

  areaRegiaoModel = new AreaRegiaoModel();
  listaAreaRegioesTabela: any[] = [];
  loading: boolean = false;
  visible: boolean = false;
  visibleAlteracoes: boolean = false;
  dataCriacao: string = '';
  sugestoes: any[] = [];
  inputs: any[] = [];
  inputsCompetencia: any[] = [];
  inputsOrgaosJulgadores: any[] = [{ selectedItemOrgaosJulgadores: null }];
  ultimoItemComarcaSelecionado: any;
  ultimoItemCompetenciaSelecionado: any;
  ultimoItemSelecionado: any;
  idAreaRegiao: any;
  loadingModalEdicao: boolean = false;
  loadingBotaoSalvar: boolean = false;
  semComarcasSelecionadas: boolean = false;
  total: number = 0;
  size: number = 10;
  page: number = 0;
  editando: boolean = false;
  visibleComarcas: boolean = false;
  visibleCompetencias: boolean = false;
  visibleOrgaoJulgadores: boolean = false;
  comarcasModal: any[] = [];
  competenciasModal: any[] = [];
  orgaoJulgadoresModal: any[] = [];
  alteracoesRecentes: any[] = [];
  orgaoJulgadores: any[] = [];
  selectedOrgaoJulgadores: any[] = [];
  selectedComarcas: any[] = [];
  comarcas: any[] = [];
  orgaosEncontrados: OrgaoJulgador[] = [];
  resultadosAnteriores: {
    termoBuscado: string;
    orgaosEncontrados: any[];
    selected: boolean;
  }[] = [];
  put: boolean = false;
  limparCamposEdicao: boolean = false;

  showDialog(regiao: any): void {
    this.limparCamposEdicao = false;
    this.put = false;
    this.idAreaRegiao = regiao.regiaoID;
    this.resultadosAnteriores = [];
    this.buscarOrgaoPje();
    this.areaRegiaoModel.justificativa = '';
    this.editando = true;
    this.loadingModalEdicao = true;
    this.areaRegiaoModel.nomeRegiao = regiao.nomeRegiao;
    this.areaRegiaoModel.nomeArea = regiao.areas[0].nomeArea;
    if (
      regiao.areas[0].competencias[0] &&
      regiao.areas[0].competencias[0].nome != ''
    ) {
      this.areaRegiaoModel.competencia[0].nome =
        regiao.areas[0].competencias[0].nome;
      this.areaRegiaoModel.competencia[0].competenciaID =
        regiao.areas[0].competencias[0].competenciaID;
    }
    this.inputs = regiao.areas[0].comarcas;
    this.areaRegiaoModel.comarca = regiao.areas[0].comarcas;
    this.selectedComarcas = regiao.areas[0].comarcas;
    this.visible = true;
    this.editando = true;
    const arrayIDs = this.extractOrgaoJulgadorIDs();
    const positions = this.findIndicesOfIDs(arrayIDs);
    this.selectedOrgaoJulgadores = positions.map(
      (index) => this.orgaoJulgadores[index]
    );
    const arrayIDsComarcas = this.extractComarcasIDs();
    const positionsComarcas = this.findIndicesOfIDsComarcas(arrayIDsComarcas);
    this.selectedComarcas = positionsComarcas.map(
      (index) => this.comarcas[index]
    );
    this.areaRegiaoModel.orgaoJulgadores = this.selectedOrgaoJulgadores;
    const nomesComarcas: string[] = [];
    regiao.areas[0].comarcas.forEach((comarca: any) => {
      const nomeComarca = comarca.nome;
      nomesComarcas.push(nomeComarca);
    });
    this.addComarcaAoModel(regiao.areas[0].comarcas);
    this.mostrarOrgaosDaComarca(nomesComarcas);
  }

  findIndicesOfIDs(ids: number[]): number[] {
    const indices: number[] = [];
    ids.forEach((id) => {
      const foundIndex = this.orgaoJulgadores.findIndex(
        (orgao) => orgao.id === id
      );
      indices.push(foundIndex);
    });

    return indices;
  }
  findIndicesOfIDsComarcas(ids: number[]): number[] {
    const indices: number[] = [];
    ids.forEach((id) => {
      const foundIndex = this.comarcas.findIndex(
        (comarca) => comarca.idJurisdicao === id
      );
      indices.push(foundIndex);
    });

    return indices;
  }
  extractOrgaoJulgadorIDs(): number[] {
    return this.selectedOrgaoJulgadores.map((item) => item.orgaoJulgadorID);
  }
  extractComarcasIDs(): number[] {
    return this.selectedComarcas.map((item) => item.comarcaID);
  }

  fecharModalComConfirmacao() {
    this.atualizarLista();
    this.buscarAreaRegiao();
  }
  fecharDialogConfirmation() {
    this.confirmationService.close();
  }

  showComarcas(comarcas: any) {
    this.visibleComarcas = true;
    this.comarcasModal = comarcas;
  }
  showCompetencias(competencias: any) {
    this.visibleCompetencias = true;
    this.competenciasModal = competencias;
  }
  showOrgaoJulgadores(orgaoJulgadores: any) {
    this.visibleOrgaoJulgadores = true;
    this.orgaoJulgadoresModal = orgaoJulgadores;
  }

  ehAdministrador(): boolean {
    return this.authorizationService.ehAdministrador();
  }

  buscarAreaRegiao() {
    this.loading = true;
    setTimeout(() => {
      this.areaRegiaoService
        .getAreasRegioesPaginadao(this.size, this.page)
        .subscribe(
          (data) => {
            this.listaAreaRegioesTabela = data.content;

            this.dataCriacao = data.dataCriacao;
            this.total = data.totalElements;
            this.alteracoesRecentes = data.alteracoesRecentes;

            this.loading = false;
          },
          (error) => {
            Swal.fire(
              'Falha!',
              'Ocorreu um erro ao buscar as áreas/regiões!',
              'error'
            );
            this.loading = false;
          }
        );
    }, 100);
  }

  buscarOrgaoPje() {
    this.areaRegiaoService.getOrgaoJulgadorPje().subscribe({
      next: (data) => {
        this.orgaoJulgadores = data;
      },
      error: (err) => {
        Swal.fire('Atenção!', err.error.message, 'warning');
      },
    });
  }
  buscarComarcaPje() {
    this.areaRegiaoService.getComarcas().subscribe({
      next: (data) => {
        this.comarcas = data;
      },
      error: (err) => {
        Swal.fire('Atenção!', err.error.message, 'warning');
      },
    });
  }

  limparCampos(): void {
    this.put = false;
    this.resultadosAnteriores = [];
    this.orgaosEncontrados = [];
    this.areaRegiaoModel.competencia[0].nome = '';
    this.areaRegiaoModel.comarca = [];
    this.areaRegiaoModel.orgaoJulgadores = [];
    this.inputsCompetencia = [{ selectedItemCompetencia: null }];
    this.inputs = [{ selectedItem: null }];
    this.inputsOrgaosJulgadores = [{ selectedItemOrgaosJulgadores: null }];
    this.sugestoes = [];
    this.ultimoItemCompetenciaSelecionado = null;
    this.ultimoItemComarcaSelecionado = null;
    this.ultimoItemSelecionado = null;
    this.areaRegiaoModel.nomeArea = '';
    this.areaRegiaoModel.nomeRegiao = '';
    this.selectedOrgaoJulgadores = [];
    this.selectedComarcas = [];
  }
  formInvalid(): boolean {
    const comarcaPreenchida =
      this.selectedComarcas && this.selectedComarcas.length > 0;
    const orgaoJulgadorPreenchido =
      this.selectedOrgaoJulgadores &&
      this.areaRegiaoModel.orgaoJulgadores.length > 0 &&
      this.selectedComarcas &&
      this.selectedComarcas.length > 0;
    return (
      orgaoJulgadorPreenchido &&
      comarcaPreenchida &&
      this.areaRegiaoModel.nomeRegiao !== '' &&
      this.areaRegiaoModel.nomeArea !== '' &&
      this.areaRegiaoModel.justificativa !== ''
    );
  }
  firstName() {
    this.keycloakService.loadUserProfile().then((usuario: any) => {
      this.areaRegiaoModel.responsavel = usuario.firstName;
    });
  }
  confirm1(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseja realmente salvar a edição?',
      icon: 'pi pi-exclamation-triangle text-warning',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.salvar();
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }
  salvar() {
    this.firstName();
    this.put = true;
    if (
      this.areaRegiaoModel.orgaoJulgadores.length == 0 &&
      (this.areaRegiaoModel.nomeRegiao != '' ||
        this.areaRegiaoModel.nomeArea != '' ||
        this.areaRegiaoModel.comarca.length > 0 ||
        this.areaRegiaoModel.justificativa != '')
    ) {
      this.toastService.warning(
        'Pelo menos 1(um) Órgão Julgador deve ser selecionado!',
        'Atenção!'
      );
    }
    if (
      this.areaRegiaoModel.nomeRegiao === '' ||
      this.areaRegiaoModel.nomeArea === '' ||
      this.areaRegiaoModel.comarca.length == 0 ||
      this.areaRegiaoModel.justificativa === ''
    ) {
      this.put = true;
      this.fecharDialogConfirmation();
      this.loading = false;
      Swal.fire(
        'Atenção!',
        'Por favor, preencha todos os campos obrigatórios.',
        'warning'
      );
      return;
    }
    this.loadingBotaoSalvar = true;
    this.areaRegiaoService
      .putEditarAreaRegiao(this.areaRegiaoModel, this.idAreaRegiao)
      .subscribe({
        next: (data) => {
          this.loadingModalEdicao = false;
          this.loadingBotaoSalvar = false;
          this.editando = false;
          this.put = false;
          this.limparCampos();
          this.page = 0;
          this.buscarAreaRegiao();
          Swal.fire('Sucesso!', 'Edição realizada com sucesso', 'success');
        },
        error: (data) => {
          this.put = false;
          this.loadingModalEdicao = false;
          this.loadingBotaoSalvar = false;
          this.editando = false;
          Swal.fire('Falha!', 'Houve uma falha ao editar!', 'info');
        },
      });
  }

  carregarPagina(page: any) {
    this.loading = true;
    this.areaRegiaoService
      .getAreasRegioesPaginadao(this.size, page - 1)
      .subscribe((data: any) => {
        this.listaAreaRegioesTabela = data.content.map((area: any) => {
          const capitalizedArea = {
            ...area,
            nomeRegiao: capitalizeFirstLetterEachWord(area.nomeRegiao),
          };
          return capitalizedArea;
        });
        this.total = data.totalElements;
        this.loading = false;
      });
  }
  atualizarLista() {
    this.editando = false;
    this.page = 0;
    this.buscarAreaRegiao();
    this.buscarOrgaoPje();
    this.limparCampos();
  }
  limparModalAlteracao() {
    this.visibleAlteracoes = false;
  }
  dialogAlteracao(item: any) {
    this.areaRegiaoService
      .getAreasRegioesId(item.regiaoID)
      .subscribe((data: any) => {
        this.dataCriacao = item.dataCriacao;
        this.alteracoesRecentes = data.alteracoesRecentes;
      });
    this.visibleAlteracoes = true;
  }

  mostrarOrgaosDaComarca(nomesBuscados: string[]): void {
    const nomesSemPrefixo = nomesBuscados.map((nome) =>
      nome.replace('Comarca de ', '')
    );
    if (nomesBuscados.some((nome) => nome == '1. Jurisdição Estadual')) {
      nomesSemPrefixo.push('Núcleo de Justiça 4.0');
    }
    this.resultadosAnteriores = this.resultadosAnteriores.filter((resultado) =>
      nomesSemPrefixo.some(
        (nome) => nome.toLowerCase() === resultado.termoBuscado.toLowerCase()
      )
    );
    this.areaRegiaoModel.orgaoJulgadores = [];
    nomesSemPrefixo.forEach((nomeSemPrefixo) => {
      const orgaosEncontrados = this.buscarOrgaoPorNome(
        nomeSemPrefixo,
        this.orgaoJulgadores
      );
      const orgaosEncontradosSemDuplicatas = Array.from(
        new Set(orgaosEncontrados)
      ).sort((a, b) => this.customSort(a.nome, b.nome));
      if (
        !this.resultadosAnteriores.some(
          (resultado) =>
            resultado.termoBuscado.toLowerCase() ===
            nomeSemPrefixo.toLowerCase()
        )
      ) {
        orgaosEncontradosSemDuplicatas.forEach((orgao: any) => {
          orgao.selected = true;
        });

        this.resultadosAnteriores.push({
          termoBuscado: nomeSemPrefixo,
          orgaosEncontrados: orgaosEncontradosSemDuplicatas,
          selected: true,
        });
      }
      orgaosEncontradosSemDuplicatas.forEach((orgao) => {
        const orgaoComID = {
          ...orgao,
          orgaoJulgadorID: orgao.id,
          selected: true,
        };
        this.areaRegiaoModel.orgaoJulgadores.push(orgaoComID);
      });
    });
  }
  customSort(a: string, b: string): number {
    const splitText = (text: string) => {
      const match = text.match(/(\d+)(\D+)/);
      if (match) {
        return { num: parseInt(match[1]), text: match[2] };
      } else {
        return { num: NaN, text };
      }
    };
    const { num: aNum, text: aText } = splitText(a);
    const { num: bNum, text: bText } = splitText(b);
    if (!isNaN(aNum) && isNaN(bNum)) return -1;
    if (isNaN(aNum) && !isNaN(bNum)) return 1;
    if (!isNaN(aNum) && !isNaN(bNum) && aNum !== bNum) return aNum - bNum;
    return aText.localeCompare(bText);
  }

  addComarcaAoModel(comarcaRetorno: OrgaoJulgador[]) {
    if (comarcaRetorno && comarcaRetorno.length > 0) {
      this.semComarcasSelecionadas = false;
      this.areaRegiaoModel.comarca = this.selectedComarcas.map(
        (comarca: any) => {
          return { ...comarca, comarcaID: comarca.idJurisdicao };
        }
      );
      const nomesComarcas = this.areaRegiaoModel.comarca.map(
        (comarca) => comarca.nome
      );
      nomesComarcas.forEach((nomeComarca) => {
        const orgaosEncontrados = this.buscarOrgaoPorNome(
          nomeComarca,
          this.orgaoJulgadores
        );
        orgaosEncontrados.forEach((orgaoEncontrado) => {
          if (
            !this.areaRegiaoModel.orgaoJulgadores.some(
              (obj) => obj.id === orgaoEncontrado.id
            )
          ) {
            this.areaRegiaoModel.orgaoJulgadores.push({
              ...orgaoEncontrado,
              orgaoJulgadorID: orgaoEncontrado.id,
            });
          }
        });
      });
      this.mostrarOrgaosDaComarca(nomesComarcas);
    } else {
      this.areaRegiaoModel.comarca = [];
      this.semComarcasSelecionadas = true;
      this.areaRegiaoModel.orgaoJulgadores = [];

      console.error('comarcaRetorno está vazio ou nulo.');
    }
  }

  buscarOrgaoPorNome(nome: string, orgaos: any): OrgaoJulgador[] {
    const resultados: OrgaoJulgador[] = orgaos.filter((orgao: any) =>
      orgao.nome.toLowerCase().includes(nome.toLowerCase())
    );
    this.orgaosEncontrados = resultados;
    return resultados;
  }
  marcarTodos: boolean = true;
  toggleMarcarTodos(): void {
    this.marcarTodos = !this.marcarTodos;

    if (!this.marcarTodos) {
      let hasOrgaoNaoSelecionado = false;

      this.resultadosAnteriores.forEach((resultado) => {
        resultado.orgaosEncontrados.forEach((orgao) => {
          orgao.selected = false;

          if (!orgao.selected) {
            hasOrgaoNaoSelecionado = true;
          }
        });
      });

      this.marcarTodos = !hasOrgaoNaoSelecionado;

      this.areaRegiaoModel.orgaoJulgadores = [];
    } else {
      this.resultadosAnteriores.forEach((resultado) => {
        resultado.orgaosEncontrados.forEach((orgao) => {
          orgao.selected = this.marcarTodos;
          const index = this.areaRegiaoModel.orgaoJulgadores.findIndex(
            (item) => item.id === orgao.id
          );
          if (orgao.selected && index === -1) {
            this.areaRegiaoModel.orgaoJulgadores.push({
              ...orgao,
              orgaoJulgadorID: orgao.id,
            });
          } else if (!orgao.selected && index !== -1) {
            this.areaRegiaoModel.orgaoJulgadores.splice(index, 1);
          }
        });
      });
    }
  }
  todosSelecionados(): boolean {
    for (const resultado of this.resultadosAnteriores) {
      for (const orgao of resultado.orgaosEncontrados) {
        if (!orgao.selected) {
          this.marcarTodos = false;
          return false;
        }
      }
    }
    this.marcarTodos = true;
    return true;
  }
  onOrgaoSelectedChange(orgao: any): void {
    if (!orgao.selected) {
      this.marcarTodos = false;
    }

    const index = this.areaRegiaoModel.orgaoJulgadores.findIndex(
      (item) => item.id === orgao.id
    );

    if (orgao.selected && index !== -1) {
      this.areaRegiaoModel.orgaoJulgadores.splice(index, 1);
      this.marcarTodos = false;
      if (this.areaRegiaoModel.orgaoJulgadores.length == 0) {
        this.toastService.warning(
          'Pelo menos 1(um) Órgão Julgador deve ser selecionado!',
          'Atenção!'
        );
      }
    }

    if (
      !orgao.selected &&
      !this.areaRegiaoModel.orgaoJulgadores.some((item) => item.id === orgao.id)
    ) {
      this.marcarTodos = true;
      this.areaRegiaoModel.orgaoJulgadores.push({
        ...orgao,
        orgaoJulgadorID: orgao.id,
      });
    }

    orgao.selected = !orgao.selected;
    this.todosSelecionados();
  }

  protected readonly faPlus = faPlus;
  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faExclamationTriangle = faExclamationTriangle;
}
