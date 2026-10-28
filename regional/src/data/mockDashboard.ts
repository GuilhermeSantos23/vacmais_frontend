
 // Indicadores fictícios do Dashboard regional.
// Quando a API existir, estes valores devem ser substituídos pela resposta
// do serviço — a tela só consome esta forma de dados.

export type PeriodoVacinacao = 'mensal' | 'quinzena1' | 'quinzena2';

export interface PontoVacinacaoMensal {
  mes: string;
  mensal: number;
  quinzena1: number;
  quinzena2: number;
}

// Série dos últimos 12 meses, encerrando em Mai/26.
export const SERIE_VACINACAO: PontoVacinacaoMensal[] = [
  { mes: 'Jun', mensal: 5200, quinzena1: 2480, quinzena2: 2720 },
  { mes: 'Jul', mensal: 4900, quinzena1: 2360, quinzena2: 2540 },
  { mes: 'Ago', mensal: 5050, quinzena1: 2420, quinzena2: 2630 },
  { mes: 'Set', mensal: 5280, quinzena1: 2540, quinzena2: 2740 },
  { mes: 'Out', mensal: 5460, quinzena1: 2610, quinzena2: 2850 },
  { mes: 'Nov', mensal: 5720, quinzena1: 2740, quinzena2: 2980 },
  { mes: 'Dez', mensal: 5980, quinzena1: 2860, quinzena2: 3120 },
  { mes: 'Jan', mensal: 6240, quinzena1: 2980, quinzena2: 3260 },
  { mes: 'Fev', mensal: 6580, quinzena1: 3140, quinzena2: 3440 },
  { mes: 'Mar', mensal: 6920, quinzena1: 3280, quinzena2: 3640 },
  { mes: 'Abr', mensal: 7340, quinzena1: 3480, quinzena2: 3860 },
  { mes: 'Mai', mensal: 7960, quinzena1: 3920, quinzena2: 4040 },
];

export const PERIODO_REFERENCIA = 'Mai/26';

export const ESCALA_VACINACAO = {
  maximo: 8500,
  marcas: [0, 2500, 5000, 7500],
};

export interface FatiaUnidadesAtivas {
  id: string;
  label: string;
  valor: number;
  cor: string;
}

export const UNIDADES_ATIVAS: FatiaUnidadesAtivas[] = [
  { id: 'ubs', label: 'UBSs ativas', valor: 4, cor: '#123c2e' },
  { id: 'clinicas', label: 'Clínicas ativas', valor: 4, cor: '#3dce7c' },
];

export interface DosesZona {
  zona: string;
  doses: number;
  cor: string;
}

export const DOSES_POR_ZONA: DosesZona[] = [
  { zona: 'Zona Leste', doses: 1980, cor: '#123c2e' },
  { zona: 'Zona Sul', doses: 1760, cor: '#1b7a46' },
  { zona: 'Zona Norte', doses: 1420, cor: '#2eaf62' },
  { zona: 'Centro', doses: 1280, cor: '#5ed48a' },
  { zona: 'Zona Oeste', doses: 980, cor: '#9ae6b8' },
  { zona: 'Metropolitana', doses: 490, cor: '#d3f5e4' },
];

export const TOTAL_DOSES_REGIAO = 7960;

// Situação do estoque de cada unidade.
// Os valores abaixo são fictícios para demonstração.
export type TipoUnidadeEstoque = 'ubs' | 'clinica';

export type StatusEstoque = 'ok' | 'atencao' | 'critico';

export interface UnidadeEstoque {
  id: string;
  nome: string;
  tipo: TipoUnidadeEstoque;
  estoqueAtual: number;
  estoqueMinimo: number;
}

export const UNIDADES_ESTOQUE: UnidadeEstoque[] = [
  // UBSs
  {
    id: 'ubs-1',
    nome: 'UBS 1',
    tipo: 'ubs',
    estoqueAtual: 120,
    estoqueMinimo: 50,
  },
  {
    id: 'ubs-2',
    nome: 'UBS 2',
    tipo: 'ubs',
    estoqueAtual: 70,
    estoqueMinimo: 50,
  },
  {
    id: 'ubs-3',
    nome: 'UBS 3',
    tipo: 'ubs',
    estoqueAtual: 20,
    estoqueMinimo: 50,
  },
  {
    id: 'ubs-4',
    nome: 'UBS 4',
    tipo: 'ubs',
    estoqueAtual: 100,
    estoqueMinimo: 50,
  },

  // Clínicas privadas
  {
    id: 'clinica-1',
    nome: 'Clínica 1',
    tipo: 'clinica',
    estoqueAtual: 80,
    estoqueMinimo: 40,
  },
  {
    id: 'clinica-2',
    nome: 'Clínica 2',
    tipo: 'clinica',
    estoqueAtual: 55,
    estoqueMinimo: 40,
  },
  {
    id: 'clinica-3',
    nome: 'Clínica 3',
    tipo: 'clinica',
    estoqueAtual: 35,
    estoqueMinimo: 40,
  },
  {
    id: 'clinica-4',
    nome: 'Clínica 4',
    tipo: 'clinica',
    estoqueAtual: 50,
    estoqueMinimo: 40,
  },
];

// Classifica o estoque com base na quantidade disponível
// em relação ao estoque mínimo definido para a unidade.
export function classificarEstoque(
  unidade: UnidadeEstoque,
): StatusEstoque {
  if (unidade.estoqueAtual <= unidade.estoqueMinimo) {
    return 'critico';
  }

  if (unidade.estoqueAtual <= unidade.estoqueMinimo * 1.5) {
    return 'atencao';
  }

  return 'ok';
}

export interface SituacaoGrupo {
  titulo: string;
  segmentos: {
    id: string;
    label: string;
    valor: number;
    cor: string;
  }[];
}

const CONFIGURACAO_STATUS: {
  id: StatusEstoque;
  label: string;
  cor: string;
}[] = [
  { id: 'ok', label: 'OK', cor: '#22c55e' },
  { id: 'atencao', label: 'Em atenção', cor: '#f5b942' },
  { id: 'critico', label: 'Crítico', cor: '#ef5350' },
];

// Os valores exibidos no gráfico são calculados a partir
// do estoque individual de cada unidade.
export const SITUACAO_UNIDADES: SituacaoGrupo[] = [
  {
    titulo: 'UBSs',
    segmentos: CONFIGURACAO_STATUS.map((status) => ({
      ...status,
      valor: UNIDADES_ESTOQUE.filter(
        (unidade) =>
          unidade.tipo === 'ubs' &&
          classificarEstoque(unidade) === status.id,
      ).length,
    })),
  },
  {
    titulo: 'Clínicas privadas',
    segmentos: CONFIGURACAO_STATUS.map((status) => ({
      ...status,
      valor: UNIDADES_ESTOQUE.filter(
        (unidade) =>
          unidade.tipo === 'clinica' &&
          classificarEstoque(unidade) === status.id,
      ).length,
    })),
  },
];

// Conta automaticamente as unidades que precisam de atenção
// ou de uma ação prioritária.
export const UNIDADES_EXIGEM_ACAO = UNIDADES_ESTOQUE.filter(
  (unidade) => classificarEstoque(unidade) !== 'ok',
).length;

export function valorDoPeriodo(
  ponto: PontoVacinacaoMensal,
  periodo: PeriodoVacinacao,
): number {
  return ponto[periodo];
}
