import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

// Tipos de movimentação possíveis na tabela.
type TipoMovimentacao = 'Entrada' | 'Alteração';

interface Movimentacao {
  tipo: TipoMovimentacao;
  lote: string;
  fabricante: string;
  validade: string;
  responsavel: string;
  quantidade: number;
  data: string;
}

// Dados fictícios apenas para reproduzir a interface visual.
const movimentacoes: Movimentacao[] = [
  {
    tipo: 'Entrada',
    lote: 'FL-2026-014',
    fabricante: 'Sanofi',
    validade: '10/2027',
    responsavel: 'Carla',
    quantidade: 270,
    data: '11/11/2026',
  },
  {
    tipo: 'Entrada',
    lote: '90839',
    fabricante: 'Butantã',
    validade: '10/2027',
    responsavel: 'Vinícius',
    quantidade: 100,
    data: '11/11/2026',
  },
  {
    tipo: 'Alteração',
    lote: '098707',
    fabricante: 'Pfizer',
    validade: '10/2027',
    responsavel: 'Carla',
    quantidade: 0,
    data: '11/11/2026',
  },
  {
    tipo: 'Entrada',
    lote: '048320',
    fabricante: 'Butantã',
    validade: '10/2027',
    responsavel: 'Carla',
    quantidade: 100,
    data: '11/11/2026',
  },
  {
    tipo: 'Entrada',
    lote: 'FA-2026-007',
    fabricante: 'Pfizer',
    validade: '10/2027',
    responsavel: 'Vinícius',
    quantidade: 100,
    data: '11/11/2026',
  },
];

// Cor do texto de cada tipo de movimentação, conforme a imagem de referência.
const tipoClassName: Record<TipoMovimentacao, string> = {
  Entrada: 'text-blue-600 font-medium',
  Alteração: 'text-orange-500 font-medium',
};

function Movimentacoes() {
  const [busca, setBusca] = useState('');

  // Filtra por tipo, lote, fabricante ou responsável conforme o usuário digita.
  const movimentacoesFiltradas = movimentacoes.filter((mov) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;

    return (
      mov.tipo.toLowerCase().includes(termo) ||
      mov.lote.toLowerCase().includes(termo) ||
      mov.fabricante.toLowerCase().includes(termo) ||
      mov.responsavel.toLowerCase().includes(termo)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Movimentações</h1>
      <p className="mt-1 text-sm text-gray-500">
        Monitoramento de ações do usuário no estoque
      </p>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-gray-900">Ações</h2>

          <div className="relative w-72">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por vacina, lote..."
              className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-wide text-gray-400 uppercase">
                <th className="py-2 pr-4 font-medium">Tipo</th>
                <th className="py-2 pr-4 font-medium">Lote</th>
                <th className="py-2 pr-4 font-medium">Fabricante</th>
                <th className="py-2 pr-4 font-medium">Validade</th>
                <th className="py-2 pr-4 font-medium">Responsável</th>
                <th className="py-2 pr-4 font-medium">Quantidade</th>
                <th className="py-2 pr-4 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesFiltradas.map((mov, index) => (
                <tr
                  key={`${mov.lote}-${index}`}
                  className="border-b border-gray-50 text-gray-700 last:border-0"
                >
                  <td className={`py-3 pr-4 ${tipoClassName[mov.tipo]}`}>
                    {mov.tipo}
                  </td>
                  <td className="py-3 pr-4">{mov.lote}</td>
                  <td className="py-3 pr-4">{mov.fabricante}</td>
                  <td className="py-3 pr-4">{mov.validade}</td>
                  <td className="py-3 pr-4">{mov.responsavel}</td>
                  <td className="py-3 pr-4">{mov.quantidade}</td>
                  <td className="py-3 pr-4">{mov.data}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {movimentacoesFiltradas.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-400">
              Nenhuma movimentação encontrada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Movimentacoes;
