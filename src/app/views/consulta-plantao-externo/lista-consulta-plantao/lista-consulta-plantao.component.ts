import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  faCircle,
  faExclamationTriangle,
  faSearch,
  faUser,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { obterNomeMesAtual } from '../../../shared/validatores/validators';
import { ConsultaPublicaPlantaoService } from '../../../client/consulta-publica-plantao/consulta-publica-plantao.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-lista-consulta-plantao',
  templateUrl: './lista-consulta-plantao.component.html',
  styleUrls: ['./lista-consulta-plantao.component.scss'],
})
export class ListaConsultaPlantaoComponent implements OnInit {
  constructor(
    private consultaPublicaService: ConsultaPublicaPlantaoService,
    private http: HttpClient
  ) {}

  filtro1instancia: boolean = false;
  filtro2instancia: boolean = false;
  filtroTurmaRecursal: boolean = false;
  loading: boolean = false;
  plantoesEcontrados: boolean = false;
  visible: boolean = false;
  selected: boolean = false;

  total: number = 0;
  size: number = 10;
  page: number = 0;

  dataInicial: string = '';
  dataFinal: string = '';
  orgaoJulgador: string = '';
  periodo: string = '';
  selectedItemComarca: any;
  selectedItemCompetencia: any;
  suggestions: any[] = [];
  suggestionsComarcas: any;
  suggestionsCompetencias: any;
  selectedItemOrgaoJulgador: any;
  comarca: any;
  visible1instancia: boolean = false;
  visibleTurmaRecursal: boolean = false;
  regioes: any[] = [];
  regiao = {
    nomeRegiao: '',
    areas: [],
    nomeComarcas: '',
  };
  dataInicialAlteracao: string = '';
  dataFinalAlteracao = '';

  listaPlantoes: any[] = [];
  alteracoesRecentes: any[] = [];
  competencia: string = '';

  ngOnInit(): void {
    if (localStorage.getItem('tipoPlantao') == 'primeiraInstancia') {
      this.filtro1instancia = true;
      this.getComarcas();
      this.getCompetencias();
    }
    if (localStorage.getItem('tipoPlantao') == 'segundaInstancia') {
      this.filtro2instancia = true;
      this.getOrgaoJulgador();
    }
    if (localStorage.getItem('tipoPlantao') == 'turmaRecursal') {
      this.filtroTurmaRecursal = true;
    }
  }

  getOrgaoJulgador() {
    this.consultaPublicaService
      .getOrgaoJulgadorColegiado()
      .subscribe((data: any) => {
        this.suggestions = data;
      });
  }
  getComarcas() {
    this.consultaPublicaService.getComarcas().subscribe((data: any) => {
      this.suggestionsComarcas = data;
    });
  }
  getCompetencias() {
    this.consultaPublicaService.getCompetencias().subscribe((data: any) => {
      this.suggestionsCompetencias = data;
    });
  }

  onItemSelectOrgaoJulgador(event: any) {
    this.selected = true;
    this.selectedItemOrgaoJulgador = event?.value;
    this.orgaoJulgador = event.value != null ? event.value.nome : '';
  }
  getResumoRegiao(nome: string) {
    this.regiao.nomeComarcas = '';
    this.regiao.nomeRegiao = '';
    this.comarca = '';
    this.consultaPublicaService.getComarcaRegiaoPorNome(nome).subscribe({
      next: (data: any) => {
        this.regioes = data.content;
        this.regiao.nomeRegiao = data.nomeRegiao;
        this.regiao.areas = data.areas;
        const nomesComarcas: string[] = [];
        data.areas.forEach((area: any) => {
          area.comarcas.forEach((comarca: any) => {
            nomesComarcas.push(comarca.nome);
          });
        });
        this.regiao.nomeComarcas = nomesComarcas.join(', ');
      },
      error: (err: any) => {
        this.regiao.areas = [];
        this.regiao.nomeComarcas = '';
        this.regiao.nomeRegiao = '';
      },
    });
  }

  onItemSelectItemComarca(event: any) {
    if (event?.value) {
      this.comarca = event.value.nome;
      this.getResumoRegiao(this.comarca);
      this.selected = true;
      this.selectedItemComarca = event.value;
      if (
        this.selectedItemComarca.nome !== 'Porto Velho' &&
        this.selectedItemComarca.nome !== 'Comarca de Porto Velho'
      ) {
        this.competencia = '';
        this.selectedItemCompetencia = null;
      }
    } else {
      this.comarca = ''; // Ou qualquer outro valor padrão que você deseje definir
      this.selectedItemComarca = null;
      this.competencia = '';
      this.selectedItemCompetencia = null;
    }
  }

  onItemSelectItemCompetencia(event: any) {
    if (event?.value) {
      this.competencia = event.value.nome;
      this.selectedItemCompetencia = event.value;
    } else {
      this.competencia = '';
      this.selectedItemCompetencia = null;
    }
  }

  pesquisar() {
    this.loading = true;
    if (this.filtroTurmaRecursal) {
      this.consultaPublicaService
        .getPlantoesTurmaRecursal(
          this.dataInicial,
          this.dataFinal,
          this.size,
          this.page
        )
        .subscribe((data: any) => {
          this.listaPlantoes = data.content;
          this.loading = false;
          this.plantoesEcontrados = true;
          if (this.listaPlantoes.length == 0) {
            Swal.fire(
              'Atenção!',
              'Nenhum plantão encontrado com os filtros inseridos.',
              'warning'
            );
          }
        });
    } else if (this.filtro2instancia) {
      this.consultaPublicaService
        .getPlantoes2Instancia(
          this.orgaoJulgador,
          this.dataInicial,
          this.dataFinal,
          this.size,
          this.page
        )
        .subscribe((data: any) => {
          this.listaPlantoes = data.content;
          this.loading = false;
          this.plantoesEcontrados = true;
          if (this.listaPlantoes.length == 0) {
            Swal.fire(
              'Atenção!',
              'Nenhum plantão encontrado com os filtros inseridos.',
              'warning'
            );
          }
        });
    } else {
      this.consultaPublicaService
        .getPlantoes1Instancia(
          this.selectedItemComarca.nome,
          this.competencia,
          this.dataInicial,
          this.dataFinal,
          this.size,
          this.page
        )
        .subscribe((data: any) => {
          this.listaPlantoes = data.content;
          this.loading = false;
          this.plantoesEcontrados = true;
          if (this.listaPlantoes.length == 0) {
            Swal.fire(
              'Atenção!',
              'Nenhum plantão encontrado com os filtros inseridos.',
              'warning'
            );
          }
        });
    }
  }
  pesquisarInvalidRecursal() {
    return this.dataInicial != '' || this.dataFinal != '';
  }
  showDialog(item: any) {
    this.consultaPublicaService
      .getPlantao2InstanciaPorId(item.plantaoID)
      .subscribe((data) => {
        this.alteracoesRecentes = data.alteracoesRecentes;
        this.dataInicialAlteracao = data.dataInicial;
        this.dataFinalAlteracao = data.dataFinal;
      });
    this.visible = true;
  }
  showDialog1Intancia(item: any) {
    this.consultaPublicaService
      .getPlantao1InstanciaPorId(item.plantaoID)
      .subscribe((data: any) => {
        this.alteracoesRecentes = data.alteracoesRecentes;
        this.dataInicialAlteracao = data.dataInicial;
        this.dataFinalAlteracao = data.dataFinal;
      });
    this.visible1instancia = true;
  }
  showDialogTurmaRecursal(item: any) {
    this.consultaPublicaService
      .getPlantaoRecursalPorId(item.plantaoID)
      .subscribe((data) => {
        this.alteracoesRecentes = data.alteracoesRecentes;
        this.dataInicialAlteracao = data.dataInicial;
        this.dataFinalAlteracao = data.dataFinal;
      });
    this.visibleTurmaRecursal = true;
  }

  pesquisarInvalid1Instancia() {
    return (
      this.dataInicial != '' ||
      this.dataFinal != '' ||
      this.selectedItemComarca != null
    );
  }
  pesquisarInvalid2Instancia() {
    return (
      this.dataInicial != '' ||
      this.dataFinal != '' ||
      this.orgaoJulgador != '' ||
      this.selectedItemOrgaoJulgador != null
    );
  }

  protected readonly faCircle = faCircle;
  protected readonly localStorage = localStorage;
  protected readonly faSearch = faSearch;
  protected readonly faUser = faUser;
  protected readonly faExclamationTriangle = faExclamationTriangle;
}
