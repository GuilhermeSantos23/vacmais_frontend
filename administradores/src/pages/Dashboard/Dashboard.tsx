import { useMemo, useState } from 'react';
import {
  RiseOutlined,
  SearchOutlined,
  AlertOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import {
  CAMPANHAS,
  ESCALA_VACINAS_DIA,
  FUNCIONARIOS,
  JANELA_VACINAS,
  LOTES_EM_ATENCAO,
  STATUS_LOTE_LABEL,
  VACINAS_POR_DIA,
  VARIACAO_MES_ANTERIOR,
  type SegmentoDonut,
} from '../../mocks/dashboard';

function formatDia(dia: number): string {
  return String(dia).padStart(2, '0');
}

interface PontoGrafico {
  x: number;
  y: number;
  dia: number;
  doses: number;
}

function caminhoSuave(pontos: PontoGrafico[]): string {
  if (pontos.length === 0) return '';

  let caminho = `M ${pontos[0].x} ${pontos[0].y}`;

  for (let indice = 0; indice < pontos.length - 1; indice += 1) {
    const anterior = pontos[indice - 1] ?? pontos[indice];
    const atual = pontos[indice];
    const proximo = pontos[indice + 1];
    const seguinte = pontos[indice + 2] ?? proximo;

    const controle1x = atual.x + (proximo.x - anterior.x) / 6;
    const controle1y = atual.y + (proximo.y - anterior.y) / 6;
    const controle2x = proximo.x - (seguinte.x - atual.x) / 6;
    const controle2y = proximo.y - (seguinte.y - atual.y) / 6;

    caminho += ` C ${controle1x} ${controle1y}, ${controle2x} ${controle2y}, ${proximo.x} ${proximo.y}`;
  }

  return caminho;
}

function GraficoVacinasPorDia() {
  const largura = 640;
  const altura = 230;

  const margem = {
    topo: 16,
    direita: 12,
    base: 28,
    esquerda: 32,
  };

  const larguraUtil = largura - margem.esquerda - margem.direita;
  const alturaUtil = altura - margem.topo - margem.base;
  const baseY = margem.topo + alturaUtil;
  const totalPontos = VACINAS_POR_DIA.length;

  const pontos: PontoGrafico[] = VACINAS_POR_DIA.map((ponto, indice) => ({
    x:
      margem.esquerda +
      (totalPontos === 1
        ? larguraUtil / 2
        : (indice / (totalPontos - 1)) * larguraUtil),
    y:
      margem.topo +
      alturaUtil * (1 - ponto.doses / ESCALA_VACINAS_DIA.maximo),
    dia: ponto.dia,
    doses: ponto.doses,
  }));

  const linha = caminhoSuave(pontos);
  const primeiro = pontos[0];
  const ultimo = pontos[pontos.length - 1];

  const area =
    primeiro && ultimo
      ? `${linha} L ${ultimo.x} ${baseY} L ${primeiro.x} ${baseY} Z`
      : '';

  return (
    <svg
      viewBox={`0 0 ${largura} ${altura}`}
      className="mt-2 w-full"
      role="img"
      aria-label="Vacinas entregues por dia em maio"
    >
      <defs>
        <linearGradient
          id="gradiente-vacinas-dia"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {ESCALA_VACINAS_DIA.marcas.map((marca) => {
        const y =
          margem.topo +
          alturaUtil * (1 - marca / ESCALA_VACINAS_DIA.maximo);

        return (
          <g key={marca}>
            <line
              x1={margem.esquerda}
              x2={largura - margem.direita}
              y1={y}
              y2={y}
              stroke="#eef1f4"
              strokeWidth={1}
            />

            <text
              x={margem.esquerda - 8}
              y={y + 4}
              textAnchor="end"
              fill="#9ca3af"
              fontSize={12}
            >
              {marca}
            </text>
          </g>
        );
      })}

      {area && <path d={area} fill="url(#gradiente-vacinas-dia)" />}

      {linha && (
        <path
          d={linha}
          fill="none"
          stroke="#22c55e"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {pontos.map((ponto) => {
        const destacar = ponto === ultimo;
        const mostrarRotulo = ponto.dia % 2 === 1;

        return (
          <g key={ponto.dia}>
            {destacar && (
              <circle cx={ponto.x} cy={ponto.y} r={5} fill="#22c55e">
                <title>
                  {formatDia(ponto.dia)}/05: {ponto.doses} doses
                </title>
              </circle>
            )}

            {mostrarRotulo && (
              <text
                x={ponto.x}
                y={altura - 8}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize={12}
              >
                {formatDia(ponto.dia)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function CardVacinasPorDia() {
  const total = VACINAS_POR_DIA.reduce(
    (soma, ponto) => soma + ponto.doses,
    0,
  );

  const media =
    VACINAS_POR_DIA.length === 0
      ? 0
      : Math.round(total / VACINAS_POR_DIA.length);

  const ultimo = VACINAS_POR_DIA[VACINAS_POR_DIA.length - 1];

  const variacao = VARIACAO_MES_ANTERIOR.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">
          Vacinas entregues por dia
        </h2>

        <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
          <RiseOutlined />
          +{variacao}% vs. mês anterior
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
        <p className="text-gray-400">
          {JANELA_VACINAS} · total {total.toLocaleString('pt-BR')} · média{' '}
          {media}/dia
        </p>

        {ultimo && (
          <p className="font-medium text-emerald-600">
            {formatDia(ultimo.dia)}/05 · {ultimo.doses} doses
          </p>
        )}
      </div>

      <GraficoVacinasPorDia />
    </article>
  );
}

function deslocamentoDosSegmentos(
  segmentos: SegmentoDonut[],
  total: number,
  circunferencia: number,
) {
  let deslocamento = 0;

  return segmentos.map((segmento) => {
    const comprimento =
      total === 0 ? 0 : (segmento.valor / total) * circunferencia;

    const resultado = {
      segmento,
      deslocamento,
      comprimento,
    };

    deslocamento += comprimento;

    return resultado;
  });
}

function GraficoDonut({
  titulo,
  segmentos,
}: {
  titulo: string;
  segmentos: SegmentoDonut[];
}) {
  const total = segmentos.reduce(
    (soma, segmento) => soma + segmento.valor,
    0,
  );

  const raio = 36;
  const circunferencia = 2 * Math.PI * raio;

  const arcos = deslocamentoDosSegmentos(
    segmentos,
    total,
    circunferencia,
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">{titulo}</h2>

      <div className="mt-4 flex flex-1 flex-col items-center justify-center">
        <div className="relative h-40 w-40">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full"
            role="img"
            aria-label={titulo}
          >
            <g transform="rotate(-90 50 50)">
              {arcos.map(({ segmento, deslocamento, comprimento }) => {
                if (segmento.valor <= 0 || total === 0) return null;

                return (
                  <circle
                    key={segmento.id}
                    cx={50}
                    cy={50}
                    r={raio}
                    fill="none"
                    stroke={segmento.cor}
                    strokeWidth={13}
                    strokeDasharray={`${comprimento} ${circunferencia - comprimento}`}
                    strokeDashoffset={-deslocamento}
                  />
                );
              })}
            </g>
          </svg>

          <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-900">
            {total}
          </span>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {segmentos.map((segmento) => (
          <li
            key={segmento.id}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex items-center gap-2 text-gray-600">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segmento.cor }}
              />
              {segmento.label}
            </span>

            <span className="font-medium tabular-nums text-gray-700">
              {segmento.valor}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * Converte datas DD/MM/AAAA ou AAAA-MM-DD para uma data local.
 * A conversão local evita diferenças de fuso horário na comparação
 * entre a validade do lote e o dia atual.
 */
function converterData(data: string): Date | null {
  const valor = data.trim();

  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const ISO = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  let dia: number;
  let mes: number;
  let ano: number;

  if (brasileira) {
    dia = Number(brasileira[1]);
    mes = Number(brasileira[2]);
    ano = Number(brasileira[3]);
  } else if (ISO) {
    ano = Number(ISO[1]);
    mes = Number(ISO[2]);
    dia = Number(ISO[3]);
  } else {
    return null;
  }

  const resultado = new Date(ano, mes - 1, dia);

  // Rejeita datas inválidas, como 31/02/2026.
  if (
    resultado.getFullYear() !== ano ||
    resultado.getMonth() !== mes - 1 ||
    resultado.getDate() !== dia
  ) {
    return null;
  }

  resultado.setHours(0, 0, 0, 0);

  return resultado;
}

function TabelaLotes() {
  const [pagina, setPagina] = useState<1 | 2>(1);
  const [busca, setBusca] = useState('');
  const [remessasRemovidas, setRemessasRemovidas] = useState<string[]>([]);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const termo = busca.trim().toLocaleLowerCase('pt-BR');

  const lotesClassificados = useMemo(() => {
    return LOTES_EM_ATENCAO.map((lote) => {
      const validade = converterData(lote.validade);

      return {
        lote,
        validade,
        vencido: validade !== null && validade < hoje,
      };
    });
    // A classificação é atualizada quando a tela renderiza novamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LOTES_EM_ATENCAO]);

  const lotesVencidos = lotesClassificados.filter(
    ({ vencido }) => vencido,
  );

  const lotesEmAtencao = lotesClassificados.filter(
    ({ lote, validade, vencido }) =>
      !vencido &&
      validade !== null &&
      STATUS_LOTE_LABEL[lote.status]
        .toLocaleLowerCase('pt-BR')
        .includes('atenção'),
  );

  const lotesDaPagina = pagina === 1 ? lotesVencidos : lotesEmAtencao;

  const lotesVisiveis = lotesDaPagina.filter(({ lote }) => {
    if (pagina === 1 && remessasRemovidas.includes(lote.id)) {
      return false;
    }

    const campos =
      pagina === 1
        ? [lote.vacina, lote.lote, lote.fabricante, lote.validade]
        : [lote.fabricante, lote.lote];

    return campos.some((campo) =>
      campo.toLocaleLowerCase('pt-BR').includes(termo),
    );
  });

  function removerRemessa(id: string) {
    setRemessasRemovidas((anteriores) =>
      anteriores.includes(id) ? anteriores : [...anteriores, id],
    );
  }

  return (
    <section className="h-full bg-white">
      {/* Cabeçalho sem cartão ou contorno externo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-emerald-500" />

            <h2 className="text-base font-bold tracking-tight text-gray-900">
              Monitoramento de lotes
            </h2>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Identifique lotes vencidos e acompanhe os que precisam de atenção.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <SearchOutlined className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder={
              pagina === 1
                ? 'Buscar vacina ou lote...'
                : 'Buscar fabricante ou lote...'
            }
            aria-label="Buscar lotes"
            className="w-full border-b border-gray-200 bg-transparent py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Navegação das duas páginas */}
      <div className="mt-6 flex gap-6 border-b border-gray-200">
        <button
          type="button"
          onClick={() => {
            setPagina(1);
            setBusca('');
          }}
          aria-current={pagina === 1 ? 'page' : undefined}
          className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition ${
            pagina === 1
              ? 'text-red-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <AlertOutlined />

          Lotes vencidos

          <span
            className={`rounded-full px-2 py-0.5 text-[11px] ${
              pagina === 1
                ? 'bg-red-50 text-red-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {lotesVencidos.filter(
              ({ lote }) => !remessasRemovidas.includes(lote.id),
            ).length}
          </span>

          {pagina === 1 && (
            <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-red-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setPagina(2);
            setBusca('');
          }}
          aria-current={pagina === 2 ? 'page' : undefined}
          className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition ${
            pagina === 2
              ? 'text-amber-600'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <ClockCircleOutlined />

          Em atenção

          <span
            className={`rounded-full px-2 py-0.5 text-[11px] ${
              pagina === 2
                ? 'bg-amber-50 text-amber-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {lotesEmAtencao.length}
          </span>

          {pagina === 2 && (
            <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-amber-500" />
          )}
        </button>
      </div>

      {/* Cabeçalho das linhas: não é uma tabela */}
      <div
        className={`hidden items-center gap-4 border-b border-gray-100 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 md:grid ${
          pagina === 1
            ? 'md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]'
            : 'md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]'
        }`}
      >
        {pagina === 1 ? (
          <>
            <span>Vacina / lote</span>
            <span>Fabricante</span>
            <span>Validade</span>
            <span className="text-right">Ação</span>
          </>
        ) : (
          <>
            <span>Fabricante</span>
            <span>Lote</span>
            <span>Remessa / situação</span>
          </>
        )}
      </div>

      {/* Cada registro é uma única linha horizontal */}
      <div>
        {lotesVisiveis.length === 0 ? (
          <div className="py-12 text-center">
            <span
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${
                pagina === 1
                  ? 'bg-red-50 text-red-400'
                  : 'bg-amber-50 text-amber-500'
              }`}
            >
              {pagina === 1 ? <CheckOutlined /> : <ClockCircleOutlined />}
            </span>

            <p className="mt-3 text-sm font-medium text-gray-700">
              {termo
                ? 'Nenhum lote encontrado.'
                : pagina === 1
                  ? 'Nenhum lote vencido pendente.'
                  : 'Nenhum lote em atenção encontrado.'}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {termo
                ? 'Tente buscar por outro termo.'
                : pagina === 1
                  ? 'Não há remessas vencidas nesta lista.'
                  : 'Todos os lotes estão regulares ou sem classificação de atenção.'}
            </p>
          </div>
        ) : (
          lotesVisiveis.map(({ lote }) => (
            <div
              key={lote.id}
              className={`group relative grid grid-cols-1 items-center gap-3 border-b border-gray-100 py-4 transition-colors last:border-b-0 hover:bg-gray-50/70 md:gap-4 md:px-2 ${
                pagina === 1
                  ? 'md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]'
                  : 'md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]'
              }`}
            >
              {pagina === 1 ? (
                <>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                      <AlertOutlined />
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {lote.vacina}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Lote{' '}
                        <span className="font-semibold text-gray-700">
                          {lote.lote}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="min-w-0 pl-12 md:pl-0">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 md:hidden">
                      Fabricante
                    </p>

                    <p className="truncate text-sm text-gray-600">
                      {lote.fabricante}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pl-12 md:pl-0">
                    <div>
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 md:hidden">
                        Validade
                      </p>

                      <p className="text-sm font-semibold text-red-600">
                        {lote.validade}
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 md:hidden">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Vencido
                    </span>
                  </div>

                  <div className="pl-12 md:pl-0">
                    <button
                      type="button"
                      onClick={() => removerRemessa(lote.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                      aria-label={`Marcar remessa do lote ${lote.lote} como removida`}
                    >
                      <CheckOutlined />
                      Removi a remessa
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />

                    <div className="min-w-0">
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 md:hidden">
                        Fabricante
                      </p>

                      <p className="truncate text-sm font-medium text-gray-800">
                        {lote.fabricante}
                      </p>
                    </div>
                  </div>

                  <div className="pl-5 md:pl-0">
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 md:hidden">
                      Lote
                    </p>

                    <p className="text-sm font-semibold text-gray-800">
                      {lote.lote}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pl-5 md:pl-0">
                    <div>
                      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 md:hidden">
                        Remessa
                      </p>

                      <p className="text-sm text-gray-600">{lote.lote}</p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Em atenção
                    </span>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
        <span>
          {lotesVisiveis.length}{' '}
          {lotesVisiveis.length === 1 ? 'lote exibido' : 'lotes exibidos'}
        </span>

        <span>
          Página {pagina} de 2
        </span>
      </div>
    </section>
  );
}

function Dashboard() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Olá, Carla!</h1>

      <p className="mt-1 text-sm text-gray-500">
        Acompanhe os indicadores estratégicos da sua região em tempo real.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CardVacinasPorDia />
        </div>

        <div className="xl:col-span-2">
          <GraficoDonut
            titulo="Funcionários"
            segmentos={FUNCIONARIOS}
          />
        </div>

        <div className="xl:col-span-3">
          <TabelaLotes />
        </div>

        <div className="xl:col-span-2">
          <GraficoDonut
            titulo="Campanhas e avisos"
            segmentos={CAMPANHAS}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
