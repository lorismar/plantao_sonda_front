import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../providers/app-config.service';
import { AreaRegiaoModel } from '../../model/area-regiao-model';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AreaRegiaoService {
  url: string;
  constructor(
    private http: HttpClient,
    configService: AppConfigService,
    private keycloakService: KeycloakService
  ) {
    this.url = configService.config.baseUrl;
  }
  token: string = '';

  getComarcas(): Observable<any> {
    return this.http.get<any>(`${this.url}/pje/jurisdicao`);
  }
  getComarcasCidade(nome: string): Observable<any> {
    return this.http.get<any>(`${this.url}/comarca?nome=${nome}`);
  }

  getCompetencias(nome: string): Observable<any> {
    return this.http.get<any>(`${this.url}/competencia?nome=${nome}`);
  }
  getOrgaoJulgador(nome: string): Observable<any> {
    return this.http.get<any>(`${this.url}/orgaos-julgadores?nome=${nome}`);
  }

  getOrgaoJulgadorPje(): Observable<any> {
    return this.http.get<any>(`${this.url}/pje/orgao-julgador`);
  }
  postSalvarAreaRegiao(areaRegiao: any): Observable<any> {
    if (
      areaRegiao.competencia[0].nome &&
      areaRegiao.competencia[0].nome != ''
    ) {
      return this.http.post(`${this.url}/regiao`, areaRegiao);
    }

    const { competencia, ...areaRegiaoSemCompetencia } = areaRegiao;

    return this.http.post(`${this.url}/regiao`, areaRegiaoSemCompetencia);
  }
  getAreasRegioes(): Observable<any> {
    return this.http.get<any>(`${this.url}/regiao/todasregioes`);
  }
  getAreasRegioesId(id: any): Observable<any> {
    return this.http.get<any>(`${this.url}/regiao/${id}`);
  }
  getAreasRegioesPaginadao(size: any, page: any): Observable<any> {
    return this.http.get<any>(
      `${this.url}/regiao?tamanho=${size}&pagina=${page}`
    );
  }
  putEditarAreaRegiao(
    regiaoModel: AreaRegiaoModel,
    idRegiao: any
  ): Observable<any> {
    return this.http.put(
      `${this.url}/regiao/${idRegiao}`,
      regiaoModel,
      idRegiao
    );
  }
}
