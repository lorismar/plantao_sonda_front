export class OrigialPlantao2Model {
  orgaoJulgador: any;
  periodo: string = '';
  telefonePlantao: string = '';
  endereco: string = '';
  servidores: Servidor[] = [];
  justificativa: string = '';
  responsavel: string = '';
}
export interface Servidor {
  nome: string;
  cargo: string;
}
