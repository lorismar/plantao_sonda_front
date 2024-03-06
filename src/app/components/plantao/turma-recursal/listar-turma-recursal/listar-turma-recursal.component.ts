import { Component, OnInit } from '@angular/core';
import { TurmaRecursalService } from '../../../../client/plantao/turma-recursal/turma-recursal.service';
import { TurmaRecursalModel } from '../../../../model/turma-recursal-model';
import {
  faExclamationTriangle,
  faPenToSquare,
  faPlus,
  faSearch,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import {
  capitalizeFirstLetterEachWord,
  validadorTelefone,
} from '../../../../shared/validatores/validators';
import Swal from 'sweetalert2';
import { AuthorizationService } from '../../../../client/auth/authorization.service';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-turma-recursal',
  templateUrl: './listar-turma-recursal.component.html',
  styleUrls: ['./listar-turma-recursal.component.scss'],
})
export class ListarTurmaRecursalComponent implements OnInit {
  constructor(
    private turmaRecursalService: TurmaRecursalService,
    public authorizationService: AuthorizationService,
    private keycloakService: KeycloakService,
    private toastService: ToastrService
  ) {}

  plantaoRecursalModel = new TurmaRecursalModel();

  loading: boolean = false;
  loadingModalEdicao: boolean = false;
  loadingBotaoSalvar: boolean = false;
  visible: boolean = false;
  editando: boolean = false;
  loadingFiltro: boolean = false;
  filtrado: boolean = false;

  listaPlantoes: any[] = [];
  alteracoesRecentes: any[] = [];
  loadingExcluindo: boolean = false;

  total: number = 0;
  size: number = 10;
  page: number = 0;
  dataInicial: string = '';
  dataFinal: string = '';

  filtroLista = {
    orgaoJulgador: '',
    dataInicial: '',
    dataFinal: '',
  };

  suggestionsFiltro: any[] = [];
  selectedItemFiltro: any;
  idPlantao: any;

  ngOnInit(): void {
    if (!this.authorizationService.plantaoJudicialTurmaRecursal()) {
      this.authorizationService.modalDeslogar();
    } else {
      this.buscarPlantoesTurmaRecursal();
      this.getOrgaoJulgadorFiltro();
    }
  }
  getOrgaoJulgadorFiltro() {
    this.turmaRecursalService.getOrgaoJulgadorColegiado().subscribe((data) => {
      this.suggestionsFiltro = data;
    });
  }
  buscarPlantoesTurmaRecursal() {
    this.turmaRecursalService
      .getPlantoesTurmaRecursal(this.size, this.page)
      .subscribe((data: any) => {
        this.listaPlantoes = data.content.map((planta: any) => {
          const capitalizedPlantao = {
            ...planta,
            magistrado: capitalizeFirstLetterEachWord(planta.magistrado),
          };
          return capitalizedPlantao;
        });
        this.total = data.totalElements;
      });
  }
  carregarPagina(page: any) {
    this.loading = true;
    if (this.filtrado) {
      this.turmaRecursalService
        .getFiltro(
          this.filtroLista.orgaoJulgador,
          this.filtroLista.dataInicial,
          this.filtroLista.dataFinal,
          this.size,
          this.page
        )
        .subscribe((data: any) => {
          this.listaPlantoes = data.content.map((planta: any) => {
            const capitalizedPlantao = {
              ...planta,
              magistrado: capitalizeFirstLetterEachWord(planta.magistrado),
            };
            return capitalizedPlantao;
          });
          this.total = data.totalElements;
          this.loading = false;
        });
    } else {
      this.turmaRecursalService
        .getPlantoesTurmaRecursal(this.size, page - 1)
        .subscribe((data: any) => {
          this.listaPlantoes = data.content.map((planta: any) => {
            const capitalizedPlantao = {
              ...planta,
              magistrado: capitalizeFirstLetterEachWord(planta.magistrado),
            };
            return capitalizedPlantao;
          });
          this.total = data.totalElements;
          this.loading = false;
        });
    }
  }
  showDialog(item: any) {
    this.editando = true;
    this.loadingModalEdicao = true;
    this.idPlantao = item.plantaoID;
    this.plantaoRecursalModel.dataFinal = item?.dataFinal;
    this.plantaoRecursalModel.dataInicial = item?.dataInicial;
    this.plantaoRecursalModel.telefonePlantao = item?.telefonePlantao;
    this.plantaoRecursalModel.magistrado = item?.magistrado;
    this.plantaoRecursalModel.orgaoJulgador = item?.orgaoJulgador;
  }
  atualizarListagem() {
    this.page = 0;
    this.buscarPlantoesTurmaRecursal();
    this.editando = false;
    this.plantaoRecursalModel.justificativa = '';
  }
  firstName() {
    this.keycloakService.loadUserProfile().then((usuario: any) => {
      this.plantaoRecursalModel.responsavel = usuario.firstName;
    });
  }
  salvar() {
    this.firstName();
    this.loadingBotaoSalvar = true;
    this.turmaRecursalService
      .putEditarPlantaoTurmaRecursal(this.plantaoRecursalModel, this.idPlantao)
      .subscribe({
        next: (data) => {
          Swal.fire('', 'Plantão editado com sucesso.', 'success');
          this.page = 0;
          this.buscarPlantoesTurmaRecursal();
          this.loadingModalEdicao = false;
          this.loadingBotaoSalvar = false;
          this.editando = false;
        },
        error: (err) => {
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
  }
  limparCampos() {
    this.plantaoRecursalModel.telefonePlantao = '';
    this.plantaoRecursalModel.dataFinal = '';
    this.plantaoRecursalModel.dataInicial = '';
    this.plantaoRecursalModel.orgaoJulgador = '';
    this.plantaoRecursalModel.magistrado = '';
  }
  formInvalid() {
    return (
      this.plantaoRecursalModel.orgaoJulgador !== '' &&
      this.plantaoRecursalModel.magistrado !== '' &&
      this.plantaoRecursalModel.dataFinal !== '' &&
      this.plantaoRecursalModel.dataInicial !== '' &&
      this.plantaoRecursalModel.justificativa !== '' &&
      validadorTelefone(this.plantaoRecursalModel.telefonePlantao)
    );
  }
  dialogAlteracao(item: any) {
    this.turmaRecursalService
      .getPlantaoTurmaRecursalPorId(item.plantaoID)
      .subscribe((data: any) => {
        this.dataInicial = data.dataInicial;
        this.dataFinal = data.dataFinal;
        this.alteracoesRecentes = data.alteracoesRecentes;
      });
    this.visible = true;
  }
  excluirPlantao(plantaoID: any) {
    Swal.fire({
      position: 'center',
      title: 'Deseja excluir o Plantão selecionado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        confirmButton: 'btn-primary',
      },
    }).then((result) => {
      if (result.value) {
        this.loadingExcluindo = true;
        if (this.loadingExcluindo) {
          let timerInterval: any;
          Swal.fire({
            title: 'Salvando...',
            timer: 1000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              const b = Swal.getHtmlContainer()?.querySelector('b');
              if (b) {
                timerInterval = setInterval(() => {
                  const timerLeft = Swal.getTimerLeft();
                  if (typeof timerLeft === 'number') {
                    b.textContent = timerLeft.toString();
                  }
                }, 100);
              }
            },
            willClose: () => {
              clearInterval(timerInterval);
            },
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
            }
          });
        }
        this.turmaRecursalService
          .deletePlantaoTurmaRecursal(plantaoID)
          .subscribe({
            next: (data: any) => {
              Swal.fire('Sucesso!', 'Plantão excluído com sucesso!', 'success');
              this.page = 0;
              this.buscarPlantoesTurmaRecursal();
              this.loadingExcluindo = false;
            },
            error: (data: any) => {
              Swal.fire(
                'Falha!',
                'Houve uma falha ao excluir o Plantão',
                'error'
              );
              this.loadingExcluindo = false;
            },
          });
      }
    });
  }

  limparModalAlteracao() {
    this.visible = false;
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
    this.buscarPlantoesTurmaRecursal();
  }
  filtrar() {
    this.filtrado = true;
    this.page = 0;
    this.loading = true;
    this.turmaRecursalService
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
            const capitalizedPlantao = {
              ...planta,
              magistrado: capitalizeFirstLetterEachWord(planta.magistrado),
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

  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faPlus = faPlus;
  protected readonly faTrashCan = faTrashCan;
  protected readonly validadorTelefone = validadorTelefone;
  protected readonly faExclamationTriangle = faExclamationTriangle;
  protected readonly faSearch = faSearch;
}
