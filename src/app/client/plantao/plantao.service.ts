import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../providers/app-config.service';
import { Observable } from 'rxjs';
import { PlantaoModel } from '../../model/plantao-model';
import { AreaRegiaoModel } from '../../model/area-regiao-model';

@Injectable({
  providedIn: 'root',
})
export class PlantaoService {
  url: string;

  constructor(private http: HttpClient, configService: AppConfigService) {
    this.url = configService.config.baseUrl;
  }

  getPlantaoPorId(idPlantao: number): Observable<any> {
    return this.http.get<any>(`${this.url}/plantao/${idPlantao}`);
  }

  getPlantoesPaginados(size: any, page: any): Observable<any> {
    return this.http.get<any>(
      `${this.url}/plantao?tamanho=${size}&pagina=${page}`
    );
  }

  getServidoresPje(nome: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/pje/servidor?tipo=servidor&nome=${nome}`
    );
  }

  getMagistradosPje(nome: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/pje/servidor?tipo=magistrado&nome=${nome}`
    );
  }

  postPlantoes(plantaoModel: PlantaoModel): Observable<any> {
    return this.http.post<any>(`${this.url}/plantao`, plantaoModel);
  }

  putEditarPlantao(
    plantaoModel: PlantaoModel,
    idPlantao: any
  ): Observable<any> {
    return this.http.put(
      `${this.url}/plantao/${idPlantao}`,
      plantaoModel,
      idPlantao
    );
  }

  getFiltro(
    comarca: string,
    dataCadastro: string,
    dataInicial: string,
    dataFinal: string,
    size: number,
    page: number
  ): Observable<any> {
    let url = `${this.url}/plantao/filtros?tamanho=${size}&pagina=${page}`;
    if (comarca !== '') {
      url += `&comarca=${comarca}`;
    }
    if (dataCadastro !== '') {
      url += `&dataCadastro=${dataCadastro}`;
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
