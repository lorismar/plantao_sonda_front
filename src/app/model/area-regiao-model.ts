export class AreaRegiaoModel {
  nomeRegiao: string = '';
  nomeArea: string = '';
  comarca: any[] = [];
  competencia = [
    {
      nome: '',
      competenciaID: '',
    },
  ];
  orgaoJulgadores: any[] = [];
  justificativa: string = '';
  responsavel: string = '';
}
