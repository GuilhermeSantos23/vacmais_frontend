import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  MedicineBoxOutlined,
  WarningOutlined,
  SearchOutlined,
  CloseOutlined,
} from '@ant-design/icons';

// Status possíveis de um lote em estoque.
type StatusLote = 'OK' | 'Atenção' | 'Crítico';

interface Lote {
  id: number;
  vacina: string;
  lote: string;
  fabricante: string;
  validade: string;
  quantidade: number;
  status: StatusLote;
}

// Dados fictícios apenas para reproduzir a interface visual.
const lotesIniciais: Lote[] = [
  {
    id: 1,
    vacina: 'Influenza Quadrivalente',
    lote: 'FL-2026-014',
    fabricante: 'Sanofi',
    validade: '10/2026',
    quantidade: 57,
    status: 'OK',
  },
  {
    id: 2,
    vacina: 'COVID-19 Bivalente',
    lote: 'CV-2026-088',
    fabricante: 'Pfizer',
    validade: '06/2026',
    quantidade: 82,
    status: 'Crítico',
  },
  {
    id: 3,
    vacina: 'HPV Quadrivalente',
    lote: 'HP-2026-031',
    fabricante: 'MSD',
    validade: '12/2026',
    quantidade: 60,
    status: 'OK',
  },
  {
    id: 4,
    vacina: 'Hepatite B',
    lote: 'HB-2026-042',
    fabricante: 'Butantan',
    validade: '08/2026',
    quantidade: 15,
    status: 'Atenção',
  },
  {
    id: 5,
    vacina: 'Tríplice Viral',
    lote: 'TV-2026-019',
    fabricante: 'Bio-Manguinhos',
    validade: '11/2026',
    quantidade: 63,
    status: 'OK',
  },
  {
    id: 6,
    vacina: 'Febre Amarela',
    lote: 'FA-2026-007',
    fabricante: 'Bio-Manguinhos',
    validade: '05/2026',
    quantidade: 3,
    status: 'Crítico',
  },
  {
    id: 7,
    vacina: 'Pneumocócica 13V',
    lote: 'PN-2026-022',
    fabricante: 'Pfizer',
    validade: '09/2026',
    quantidade: 13,
    status: 'Atenção',
  },
];

// Cor do texto de cada status, conforme a imagem de referência.
const statusClassName: Record<StatusLote, string> = {
  OK: 'text-emerald-600',
  Atenção: 'text-orange-500',
  Crítico: 'text-red-600',
};

// Campos do modal "Cadastro" (botão Adicionar).
interface FormularioCadastro {
  nomeVacina: string;
  fabricante: string;
  lote: string;
  quantidade: string;
  dataRecebimento: string;
  responsavelLegal: string;
}

const formularioCadastroVazio: FormularioCadastro = {
  nomeVacina: '',
  fabricante: '',
  lote: '',
  quantidade: '',
  dataRecebimento: '',
  responsavelLegal: '',
};

// Campos do modal "Alterar" (botão Alterar).
interface FormularioAlterar {
  nomeVacina: string;
  fabricante: string;
  lote: string;
  quantidade: string;
  dataExclusao: string;
}

const formularioAlterarVazio: FormularioAlterar = {
  nomeVacina: '',
  fabricante: '',
  lote: '',
  quantidade: '',
  dataExclusao: '',
};

// Classe usada nos inputs dos dois modais.
const inputClassName =
  'w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-emerald-500';

function Estoque() {
  const [lotes, setLotes] = useState<Lote[]>(lotesIniciais);
  const [busca, setBusca] = useState('');

  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [formularioCadastro, setFormularioCadastro] = useState<FormularioCadastro>(
    formularioCadastroVazio,
  );

  const [modalAlterarAberto, setModalAlterarAberto] = useState(false);
  const [formularioAlterar, setFormularioAlterar] = useState<FormularioAlterar>(
    formularioAlterarVazio,
  );

  // Filtra os lotes por vacina ou lote conforme o usuário digita.
  const lotesFiltrados = lotes.filter((item) => {
    const termo = busca.trim().toLowerCase();
    return (
      !termo ||
      item.vacina.toLowerCase().includes(termo) ||
      item.lote.toLowerCase().includes(termo)
    );
  });

  // Indicadores fictícios exibidos nos cards do topo.
  const distribuidasNoMes = 1236;
  const lotesCriticos = lotes.filter((item) => item.status === 'Crítico').length;

  function atualizarCampoCadastro(campo: keyof FormularioCadastro, valor: string) {
    setFormularioCadastro((atual) => ({ ...atual, [campo]: valor }));
  }

  function atualizarCampoAlterar(campo: keyof FormularioAlterar, valor: string) {
    setFormularioAlterar((atual) => ({ ...atual, [campo]: valor }));
  }

  function fecharModalCadastro() {
    setModalCadastroAberto(false);
    setFormularioCadastro(formularioCadastroVazio);
  }

  function fecharModalAlterar() {
    setModalAlterarAberto(false);
    setFormularioAlterar(formularioAlterarVazio);
  }

  // Cria um novo lote a partir do formulário de cadastro e adiciona na tabela.
  function cadastrarLote(e: FormEvent) {
    e.preventDefault();

    const novoLote: Lote = {
      id: Date.now(),
      vacina: formularioCadastro.nomeVacina,
      lote: formularioCadastro.lote,
      fabricante: formularioCadastro.fabricante,
      validade: formularioCadastro.dataRecebimento,
      quantidade: Number(formularioCadastro.quantidade) || 0,
      status: 'OK',
    };

    setLotes((atual) => [...atual, novoLote]);
    fecharModalCadastro();
  }

  // Atualiza o lote existente com o mesmo código de lote informado no formulário.
  function alterarLote(e: FormEvent) {
    e.preventDefault();

    setLotes((atual) =>
      atual.map((item) =>
        item.lote === formularioAlterar.lote
          ? {
              ...item,
              vacina: formularioAlterar.nomeVacina || item.vacina,
              fabricante: formularioAlterar.fabricante || item.fabricante,
              quantidade: formularioAlterar.quantidade
                ? Number(formularioAlterar.quantidade)
                : item.quantidade,
            }
          : item,
      ),
    );

    fecharModalAlterar();
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Estoque da Unidade</h1>
      <p className="mt-0.5 text-sm text-gray-500">
        Monitoramento de lotes, validade e distribuição vacinal por região.
      </p>

      <div className="mt-5 flex flex-wrap gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <MedicineBoxOutlined />
          </div>
          <div>
            <p className="text-xs text-gray-500">Distribuídas (mês)</p>
            <p className="text-lg font-bold text-gray-900">{distribuidasNoMes}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
            <WarningOutlined />
          </div>
          <div>
            <p className="text-xs text-gray-500">Lotes críticos</p>
            <p className="text-lg font-bold text-gray-900">{lotesCriticos}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Lotes em circulação</h2>
            <p className="text-xs text-gray-400">{lotes.length} lotes monitorados em tempo real</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalCadastroAberto(true)}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => setModalAlterarAberto(true)}
              className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-500"
            >
              Alterar
            </button>

            <div className="relative w-64 max-w-full">
              <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por vacina ou lote..."
                className="w-full rounded-lg border border-gray-200 py-1.5 pr-3 pl-8 text-sm text-gray-600 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] tracking-wide text-gray-400 uppercase">
                <th className="py-2 pr-4 font-medium">Vacina</th>
                <th className="py-2 pr-4 font-medium">Lote</th>
                <th className="py-2 pr-4 font-medium">Fabricante</th>
                <th className="py-2 pr-4 font-medium">Validade</th>
                <th className="py-2 pr-4 font-medium">Quantidade</th>
                <th className="py-2 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lotesFiltrados.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-2 pr-4">{item.vacina}</td>
                  <td className="py-2 pr-4">{item.lote}</td>
                  <td className="py-2 pr-4">{item.fabricante}</td>
                  <td className="py-2 pr-4">{item.validade}</td>
                  <td className="py-2 pr-4">{item.quantidade}</td>
                  <td className={`py-2 pr-4 font-medium ${statusClassName[item.status]}`}>
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {lotesFiltrados.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-400">Nenhum lote encontrado.</p>
          )}
        </div>
      </div>

      {/* Modal de Cadastro (botão Adicionar) */}
      {modalCadastroAberto && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-10">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Cadastro</h2>
                <p className="text-sm text-gray-500">Cadastrar vacina em estoque</p>
              </div>

              <button
                type="button"
                aria-label="Fechar"
                onClick={fecharModalCadastro}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseOutlined />
              </button>
            </div>

            <p className="mt-4 text-sm font-semibold text-emerald-600">Dados</p>

            <form onSubmit={cadastrarLote} className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">Nome da vacina</label>
                <input
                  className={inputClassName}
                  value={formularioCadastro.nomeVacina}
                  onChange={(e) => atualizarCampoCadastro('nomeVacina', e.target.value)}
                  placeholder="Astrazênica"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Fabricante</label>
                <input
                  className={inputClassName}
                  value={formularioCadastro.fabricante}
                  onChange={(e) => atualizarCampoCadastro('fabricante', e.target.value)}
                  placeholder="Pfizer"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-sm text-gray-600">Lote</label>
                <input
                  className={inputClassName}
                  value={formularioCadastro.lote}
                  onChange={(e) => atualizarCampoCadastro('lote', e.target.value)}
                  placeholder="23948"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Quantidade</label>
                <input
                  type="number"
                  className={inputClassName}
                  value={formularioCadastro.quantidade}
                  onChange={(e) => atualizarCampoCadastro('quantidade', e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Data de recebimento</label>
                <input
                  className={inputClassName}
                  value={formularioCadastro.dataRecebimento}
                  onChange={(e) => atualizarCampoCadastro('dataRecebimento', e.target.value)}
                  placeholder="03/04/2026"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Responsável legal</label>
                <input
                  className={inputClassName}
                  value={formularioCadastro.responsavelLegal}
                  onChange={(e) => atualizarCampoCadastro('responsavelLegal', e.target.value)}
                  placeholder="João da Costa Medeiros"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Anexar romaneio</label>
                <input type="file" className={inputClassName} />
              </div>

              <div className="col-span-2 mt-2 flex justify-end">
                <button
                  type="submit"
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Alteração (botão Alterar) */}
      {modalAlterarAberto && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 py-10">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Alterar</h2>
                <p className="text-sm text-gray-500">Alterar vacina em estoque</p>
              </div>

              <button
                type="button"
                aria-label="Fechar"
                onClick={fecharModalAlterar}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseOutlined />
              </button>
            </div>

            <p className="mt-4 text-sm font-semibold text-emerald-600">Dados</p>

            <form onSubmit={alterarLote} className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">Nome da vacina</label>
                <input
                  className={inputClassName}
                  value={formularioAlterar.nomeVacina}
                  onChange={(e) => atualizarCampoAlterar('nomeVacina', e.target.value)}
                  placeholder="Astrazênica"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Fabricante</label>
                <input
                  className={inputClassName}
                  value={formularioAlterar.fabricante}
                  onChange={(e) => atualizarCampoAlterar('fabricante', e.target.value)}
                  placeholder="Pfizer"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-sm text-gray-600">Lote</label>
                <input
                  className={inputClassName}
                  value={formularioAlterar.lote}
                  onChange={(e) => atualizarCampoAlterar('lote', e.target.value)}
                  placeholder="23948"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Quantidade</label>
                <input
                  type="number"
                  className={inputClassName}
                  value={formularioAlterar.quantidade}
                  onChange={(e) => atualizarCampoAlterar('quantidade', e.target.value)}
                  placeholder="2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Data de exclusão</label>
                <input
                  className={inputClassName}
                  value={formularioAlterar.dataExclusao}
                  onChange={(e) => atualizarCampoAlterar('dataExclusao', e.target.value)}
                  placeholder="03/04/2026"
                />
              </div>

              <div className="col-span-2 mt-2 flex justify-end">
                <button
                  type="submit"
                  className="text-sm font-semibold text-amber-500 underline underline-offset-2 hover:text-amber-600"
                >
                  Alterar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estoque;
