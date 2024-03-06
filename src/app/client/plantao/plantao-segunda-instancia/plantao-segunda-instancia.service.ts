import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../providers/app-config.service';
import { Observable } from 'rxjs';
import { Plantao2InstanciaModel } from '../../../model/plantao-2-instancia-model';

@Injectable({
  providedIn: 'root',
})
export class PlantaoSegundaInstanciaService {
  url: string;
  constructor(private http: HttpClient, configService: AppConfigService) {
    this.url = configService.config.baseUrl;
  }

  postPlantao2Instancia(
    plantao2InstanciaModel: Plantao2InstanciaModel
  ): Observable<any> {
    return this.http.post<any>(
      `${this.url}/plantao2instancia`,
      plantao2InstanciaModel
    );
  }

  getPlantao2Instancia(size: number, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/plantao2instancia?tamanho=${size}&pagina=${page}`
    );
  }
  putEditarPlantao2Instancia(
    plantao2InstanciaModel: Plantao2InstanciaModel,
    idPlantao: any
  ): Observable<any> {
    return this.http.put(
      `${this.url}/plantao2instancia/${idPlantao}`,
      plantao2InstanciaModel,
      idPlantao
    );
  }
  getPlantao2InstanciaPorId(idPlantao: number): Observable<any> {
    return this.http.get<any>(`${this.url}/plantao2instancia/${idPlantao}`);
  }
  getOrgaoJulgadorColegiado(): Observable<any> {
    return this.http.get<any>(`${this.url}/pje/orgao-julgador-colegiado`);
  }
  getMagistradosPje(nome: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/pje/servidor-pjesg?tipo=magistrado&nome=${nome}`
    );
  }
  getServidoresPje(nome: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/pje/servidor-pjesg?tipo=servidor&nome=${nome}`
    );
  }
  getFiltro(
    orgaoJulgador: string,
    dataInicial: string,
    dataFinal: string,
    size: number,
    page: number
  ): Observable<any> {
    let url = `${this.url}/plantao2instancia/filtros?tamanho=${size}&pagina=${page}`;
    if (orgaoJulgador !== '') {
      url += `&orgaoJulgador=${orgaoJulgador}`;
    }
    if (dataInicial !== '') {
      url += `&dataInicial=${dataInicial}`;
    }
    if (dataFinal !== '') {
      url += `&dataFinal=${dataFinal}`;
    }

    return this.http.get<any>(url);
  }
}
