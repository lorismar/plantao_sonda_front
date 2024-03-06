import { Component, OnInit } from '@angular/core';
import {
  faCheckDouble,
  faPlus,
  faReplyAll,
} from '@fortawesome/free-solid-svg-icons';
import { AreaRegiaoModel } from '../../../../model/area-regiao-model';
import { AreaRegiaoService } from '../../../../client/area-regiao/area-regiao.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../client/auth/authorization.service';
import { ModalSemPermissaoService } from '../../../../client/modal-sem-permissao/modal-sem-permissao.service';
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
  selector: 'app-cadastrar-area-regiao',
  templateUrl: './cadastro-area-regiao.component.html',
  styleUrls: ['./cadastro-area-regiao.component.scss'],
})
export class CadastroAreaRegiaoComponent implements OnInit {
  constructor(
    private areaRegiaoService: AreaRegiaoService,
    private router: Router,
    public authorizationService: AuthorizationService,
    private modal: ModalSemPermissaoService,
    private toastService: ToastrService
  ) {}

  areaRegialModel: AreaRegiaoModel = new AreaRegiaoModel();
  loading: boolean = false;
  inputsOrgaosJulgadores: any[] = [{ selectedItemOrgaosJulgadores: null }];
  sugestoes: any[] = [];
  inputs: any[] = [{ selectedItem: null }];
  inputsCompetencia: any[] = [{ selectedItemCompetencia: null }];
  ultimoItemComarcaSelecionado: any;
  ultimoItemCompetenciaSelecionado: any;
  ultimoItemSelecionado: any;
  orgaoJulgadores!: OrgaoJulgador[];
  comarcas: any[] = [];
  selectedOrgaoJulgadores!: OrgaoJulgador[];
  selectedComarcas: any[] = [];
  orgaosEncontrados: any[] = [];
  resultadosAnteriores: {
    termoBuscado: string;
    orgaosEncontrados: any[];
    selected: boolean;
  }[] = [];
  semComarcasSelecionadas: boolean = false;
  post: boolean = false;

  ngOnInit(): void {
    if (!this.authorizationService.manterRegiaoPlantao()) {
      this.modal.modalDeslogar();
    } else {
      this.buscarOrgaoPje();
      this.buscarComarcaPje();
    }
  }

  buscarComarcaPje() {
    this.areaRegiaoService.getComarcas().subscribe((data: any) => {
      this.comarcas = data;
    });
  }

  ehAdministrador(): boolean {
    return this.authorizationService.ehAdministrador();
  }
  buscarOrgaoPorNome(nome: string, orgaos: any): OrgaoJulgador[] {
    const resultados: OrgaoJulgador[] = orgaos.filter((orgao: any) =>
      orgao.nome.toLowerCase().includes(nome.toLowerCase())
    );
    this.orgaosEncontrados = resultados;
    return resultados;
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

    nomesSemPrefixo.forEach((nomeSemPrefixo) => {
      const orgaosEncontrados = this.buscarOrgaoPorNome(
        nomeSemPrefixo,
        this.orgaoJulgadores
      );

      orgaosEncontrados.forEach((orgaoEncontrado: any) => {
        const existsInModel = this.areaRegialModel.orgaoJulgadores.some(
          (obj) => obj.id === orgaoEncontrado.id
        );

        if (!existsInModel) {
          const orgaosEncontradosSemDuplicatas = Array.from(
            new Set(orgaosEncontrados)
          );

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

          if (orgaoEncontrado.selected) {
            this.areaRegialModel.orgaoJulgadores.push({
              ...orgaoEncontrado,
              selected: true,
              orgaoJulgadorID: orgaoEncontrado.id,
            });
          }
        }
      });
    });
  }

  addComarcaAoModel(comarcaRetorno: OrgaoJulgador[]) {
    if (comarcaRetorno && comarcaRetorno.length > 0) {
      this.semComarcasSelecionadas = false;
      this.areaRegialModel.comarca = this.selectedComarcas.map(
        (comarca: any) => {
          return { ...comarca, comarcaID: comarca.idJurisdicao };
        }
      );
      const nomesComarcas = this.areaRegialModel.comarca.map(
        (comarca) => comarca.nome
      );
      this.areaRegialModel.orgaoJulgadores = [];
      nomesComarcas.forEach((nomeComarca) => {
        const orgaosEncontrados = this.buscarOrgaoPorNome(
          nomeComarca,
          this.orgaoJulgadores
        );
        orgaosEncontrados.forEach((orgaoEncontrado) => {
          if (
            !this.areaRegialModel.orgaoJulgadores.some(
              (obj) => obj.id === orgaoEncontrado.id
            )
          ) {
            this.areaRegialModel.orgaoJulgadores.push(orgaoEncontrado);
          }
        });
      });
      this.mostrarOrgaosDaComarca(nomesComarcas);
    } else {
      this.areaRegialModel.comarca = [];
      this.semComarcasSelecionadas = true;
      this.areaRegialModel.orgaoJulgadores = [];
      console.error('comarcaRetorno está vazio ou nulo.');
    }
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

      this.areaRegialModel.orgaoJulgadores = [];
    } else {
      this.resultadosAnteriores.forEach((resultado) => {
        resultado.orgaosEncontrados.forEach((orgao) => {
          orgao.selected = this.marcarTodos;
          const index = this.areaRegialModel.orgaoJulgadores.findIndex(
            (item) => item.id === orgao.id
          );

          if (orgao.selected && index === -1) {
            this.areaRegialModel.orgaoJulgadores.push({
              ...orgao,
              orgaoJulgadorID: orgao.id,
            });
          } else if (!orgao.selected && index !== -1) {
            this.areaRegialModel.orgaoJulgadores.splice(index, 1);
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

    const index = this.areaRegialModel.orgaoJulgadores.findIndex(
      (item) => item.id === orgao.id
    );

    if (orgao.selected && index !== -1) {
      this.areaRegialModel.orgaoJulgadores.splice(index, 1);
      this.marcarTodos = false;
      if (this.areaRegialModel.orgaoJulgadores.length == 0) {
        this.toastService.warning(
          'Pelo menos 1(um) Órgão Julgador deve ser selecionado!',
          'Atenção!'
        );
      }
    }

    if (
      !orgao.selected &&
      !this.areaRegialModel.orgaoJulgadores.some((item) => item.id === orgao.id)
    ) {
      this.marcarTodos = true;
      this.areaRegialModel.orgaoJulgadores.push({
        ...orgao,
        orgaoJulgadorID: orgao.id,
      });
    }

    orgao.selected = !orgao.selected;
    this.todosSelecionados();
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

  salvar() {
    this.post = true;
    this.loading = true;
    if (
      this.areaRegialModel.nomeRegiao === '' ||
      this.areaRegialModel.nomeArea === '' ||
      this.areaRegialModel.comarca.length == 0
    ) {
      this.post = true;
      this.loading = false;
      Swal.fire(
        'Atenção!',
        'Por favor, preencha todos os campos obrigatórios.',
        'warning'
      );
      return;
    }
    this.areaRegiaoService
      .postSalvarAreaRegiao(this.areaRegialModel)
      .subscribe({
        next: (data) => {
          Swal.fire(
            'Sucesso!',
            'Cadastro realizado com com sucesso!',
            'success'
          );
          this.router.navigate(['/home/area-regiao']);
          this.loading = false;
          this.post = false;
        },
        error: (err) => {
          Swal.fire('Falha!', 'Houve uma falha ao cadastrar!', 'error');
          this.loading = false;
          this.post = false;
        },
      });
  }

  limparCampos(): void {
    this.areaRegialModel.competencia[0].nome = '';
    this.areaRegialModel.comarca = [];
    this.areaRegialModel.orgaoJulgadores = [];
    this.inputsCompetencia = [{ selectedItemCompetencia: null }];
    this.inputs = [{ selectedItem: null }];
    this.inputsOrgaosJulgadores = [{ selectedItemOrgaosJulgadores: null }];
    this.sugestoes = [];
    this.ultimoItemCompetenciaSelecionado = null;
    this.ultimoItemComarcaSelecionado = null;
    this.ultimoItemSelecionado = null;
    this.areaRegialModel.nomeArea = '';
    this.areaRegialModel.nomeRegiao = '';
    this.areaRegialModel.orgaoJulgadores = [];
    this.selectedOrgaoJulgadores = [];
    this.resultadosAnteriores = [];
    this.orgaosEncontrados = [];
    this.selectedComarcas = [];
    this.areaRegialModel.comarca = [];
    this.post = false;
  }
  formInvalid(): boolean {
    const comarcaPreenchida =
      this.selectedComarcas && this.selectedComarcas.length > 0;
    return (
      comarcaPreenchida &&
      this.areaRegialModel.nomeRegiao !== '' &&
      this.areaRegialModel.orgaoJulgadores.length > 0 &&
      this.areaRegialModel.nomeArea !== '' &&
      this.selectedComarcas &&
      this.selectedComarcas.length > 0
    );
  }
  formInvalid2(): boolean {
    const comarcaPreenchida =
      this.selectedComarcas && this.selectedComarcas.length > 0;
    return (
      comarcaPreenchida &&
      this.areaRegialModel.nomeRegiao !== '' &&
      this.areaRegialModel.orgaoJulgadores.length > 0 &&
      this.areaRegialModel.nomeArea !== '' &&
      this.selectedComarcas &&
      this.selectedComarcas.length > 0
    );
  }

  protected readonly faPlus = faPlus;
}
