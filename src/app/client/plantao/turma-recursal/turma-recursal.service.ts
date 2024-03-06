import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../providers/app-config.service';
import { Observable } from 'rxjs';
import { TurmaRecursalModel } from '../../../model/turma-recursal-model';

@Injectable({
  providedIn: 'root',
})
export class TurmaRecursalService {
  url: string;
  constructor(private http: HttpClient, configService: AppConfigService) {
    this.url = configService.config.baseUrl;
  }
  postTurmaRecursal(turmaRecursal: TurmaRecursalModel): Observable<any> {
    return this.http.post<any>(`${this.url}/plantaorecursal`, turmaRecursal);
  }
  getPlantoesTurmaRecursal(size: number, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/plantaorecursal?tamanho=${size}&pagina=${page}`
    );
  }
  getPlantaoTurmaRecursalPorId(idPlantao: number): Observable<any> {
    return this.http.get<any>(`${this.url}/plantaorecursal/${idPlantao}`);
  }
  putEditarPlantaoTurmaRecursal(
    plantaoTurmaRecursal: TurmaRecursalModel,
    idPlantao: any
  ): Observable<any> {
    return this.http.put(
      `${this.url}/plantaorecursal/${idPlantao}`,
      plantaoTurmaRecursal,
      idPlantao
    );
  }
  deletePlantaoTurmaRecursal(id: any): Observable<any> {
    return this.http.delete(`${this.url}/plantaorecursal/${id}`, id);
  }
  getFiltro(
    orgaoJulgador: string,
    dataInicial: string,
    dataFinal: string,
    size: number,
    page: number
  ): Observable<any> {
    let url = `${this.url}/plantaorecursal/filtros?tamanho=${size}&pagina=${page}`;
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
  getOrgaoJulgadorColegiado(): Observable<any> {
    return this.http.get<any>(`${this.url}/pje/orgao-julgador-colegiado`);
  }
}
