export class Plantao2InstanciaModel {
  orgaoJulgadorColegiado: any;
  telefonePlantao: string = '';
  endereco: string = '';
  servidores: any[] = [];
  justificativa: string = '';
  responsavel: string = '';
  dataInicial: string = '';
  dataFinal: string = '';
  idOrgaoJulgadorColegiado: number = 0;
}

export interface Servidor {
  nome: string;
  cargo: string;
}
