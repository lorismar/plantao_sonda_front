import validator from 'validar-telefone';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function validadorCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cpf.length !== 11) {
    return false; // CPF deve ter 11 dígitos
  }
  // Verifica se todos os dígitos são iguais (CPF inválido, mas válido segundo o algoritmo)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }
  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(9))) {
    return false; // Primeiro dígito verificador inválido
  }

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(10))) {
    return false; // Segundo dígito verificador inválido
  }

  return true; // CPF válido
}

export function validadorEmail(email: string) {
  const expressaoRegular = /\S+@\S+\.\S+/;
  return expressaoRegular.test(email);
}

export function validadorSenha(senha1: string) {
  const letrasMaiusculas = /[A-Z]/;
  const letrasMinusculas = /[a-z]/;
  const caracteresEspeciais = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const numberRegex = /[0-9]/;
  if (senha1 == '') {
    return false;
  } else {
    return (
      senha1.length >= 8 &&
      caracteresEspeciais.test(senha1) &&
      numberRegex.test(senha1) &&
      letrasMinusculas.test(senha1) &&
      letrasMaiusculas.test(senha1)
    );
  }
}

export function validadorTelefone(telefone: string) {
  if (telefone.length < 11) {
    return false;
  } else {
    return validator(telefone);
  }
}

export function letrasMaisculas(nome1: string) {
  const letrasMaiusculas = /[A-Z]/;
  return letrasMaiusculas.test(nome1);
}
export function letrasMinusculas(nome1: string) {
  const letrasMinusculas = /[a-z]/;
  return letrasMinusculas.test(nome1);
}

export function caracteresEspeciais(nome1: string) {
  const caracteresEspeciais = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  return caracteresEspeciais.test(nome1);
}
export function aoMenos1Numero(nome1: string) {
  const numberRegex = /[0-9]/;
  return numberRegex.test(nome1);
}

export function partesDoNome(nome: string, senha: string) {
  const partesNome = nome.split(' '); // Separar o nome completo em partes (nomes)
  const senhaMinusculo = senha.toLowerCase(); // Converter a senha para minúsculo para facilitar a comparação

  // Verificar se a senha contém partes do nome completo
  for (const parteNome of partesNome) {
    const nomeMinusculo = parteNome.toLowerCase(); // Converter a parte do nome para minúsculo para facilitar a comparação

    if (senhaMinusculo.includes(nomeMinusculo)) {
      return false; // A senha contém partes do nome completo
    }
  }

  return true; // A senha está ok
}

export function isDateGreaterThanToday(dateString: string): boolean {
  const inputDate = new Date(dateString);

  // Verificar se a data inserida é válida
  if (isNaN(inputDate.getTime())) {
    return false;
  }

  // Obter a data de hoje
  const today = new Date();

  // Remover informações de hora/minuto/segundo/milissegundo da data de hoje
  today.setHours(0, 0, 0, 0);
  // Comparar as datas
  return inputDate.getTime() > today.getTime();
}
export function formatFileSize(size: number): string {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function downloadFile(file: File) {
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  window.URL.revokeObjectURL(url);
}
export function formatarTextoHTML(inputHTML: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(inputHTML, 'text/html');
  return doc.body.textContent || '';
}

export function formatarData(dataString: string): string {
  // Parse a string no formato "yyyy/MM/dd" para um objeto Date
  const dataObj = parseISO(dataString);

  // Formata a data para o formato "dd/MM/yyyy"
  const dataFormatada = format(dataObj, 'dd/MM/yyyy');

  return dataFormatada;
}
export function capitalizeFirstLetterEachWord(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
export function obterNomeMesAtual(): string {
  const meses = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const dataAtual = new Date();
  const mesAtual = dataAtual.getMonth(); // Obtém o número do mês (0-11)

  return meses[mesAtual];
}
