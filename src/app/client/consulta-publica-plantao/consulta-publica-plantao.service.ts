import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../providers/app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsultaPublicaPlantaoService {
  url: string;

  constructor(private http: HttpClient, configService: AppConfigService) {
    this.url = configService.config.baseUrl;
  }

  getPlantoesTurmaRecursal(
    dataInicial: any,
    dataFinal: any,
    size: number,
    page: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/plantaorecursal?dataInicial=${dataInicial}&dataFinal=${dataFinal}&tamanho=${size}&pagina=${page}`
    );
  }
  getPlantoes2Instancia(
    orgaoJulgador: any,
    dataInicial: string,
    dataFinal: string,
    size: number,
    page: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/plantao2instancia?orgaoJulgador=${orgaoJulgador}&dataInicial=${dataInicial}&dataFinal=${dataFinal}&tamanho=${size}&pagina=${page}`
    );
  }
  getOrgaoJulgador(nome: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/orgaojulgador?nome=${nome}`
    );
  }
  getComarcaRegiaoPorNome(nome: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/regiaocomarca?nomeComarca=${nome}`
    );
  }
  getPlantoes1Instancia(
    comarca: any,
    competencia: string,
    dataInicial: string,
    dataFinal: string,
    size: number,
    page: number
  ): Observable<any> {
    let url = `${this.url}/consultapublica/plantao?`;
    if (comarca !== '') {
      url += `comarca=${comarca}&`;
    }
    if (competencia !== '') {
      url += `competencia=${competencia}&`;
    }
    if (dataInicial !== '') {
      url += `dataInicial=${dataInicial}&`;
    }
    if (dataFinal !== '') {
      url += `dataFinal=${dataFinal}&`;
    }
    url += `tamanho=${size}&pagina=${page}`;
    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }
    return this.http.get<any>(url);
  }

  getPlantao1InstanciaPorId(idPlantao: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/plantao/${idPlantao}`
    );
  }
  getPlantao2InstanciaPorId(idPlantao: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/plantao2instancia/${idPlantao}`
    );
  }
  getPlantaoRecursalPorId(idPlantao: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/plantaorecursal/${idPlantao}`
    );
  }
  getOrgaoJulgadorColegiado(): Observable<any> {
    return this.http.get<any>(
      `${this.url}/consultapublica/orgaojulgadorcolegiado`
    );
  }
  getComarcas(): Observable<any> {
    return this.http.get<any>(`${this.url}/consultapublica/comarcas`);
  }
  getCompetencias(): Observable<any> {
    return this.http.get<any>(`${this.url}/consultapublica/competencias`);
  }
}
