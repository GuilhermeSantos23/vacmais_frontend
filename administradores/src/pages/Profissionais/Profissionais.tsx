import { useState } from 'react';
import type { FormEvent } from 'react';
import { SearchOutlined, FilterOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';

// Status possíveis de um profissional.
type StatusProfissional = 'Ativo' | 'Inativo' | 'Bloqueado';

interface Profissional {
  id: number;
  nome: string;
  cpf: string;
  conselho: string;
  unidade: string;
  responsavel: string;
  cargo: string;
  status: StatusProfissional;
}

// Dados fictícios apenas para reproduzir a interface visual.
const profissionaisIniciais: Profissional[] = [
  {
    id: 1,
    nome: 'Vinícius S',
    cpf: '000.000.000-00',
    conselho: '00000-00',
    unidade: '77',
    responsavel: 'Janice S',
    cargo: 'Enfermeiro',
    status: 'Ativo',
  },
  {
    id: 2,
    nome: 'Guilherme V',
    cpf: '000.000.000-00',
    conselho: '00000-00',
    unidade: '77, 78',
    responsavel: 'Janice S',
    cargo: 'Enfermeiro',
    status: 'Ativo',
  },
  {
    id: 3,
    nome: 'Carla I',
    cpf: '000.000.000-00',
    conselho: '00000-00',
    unidade: '77, 93',
    responsavel: 'Janice S',
    cargo: 'Ginecologista',
    status: 'Inativo',
  },
  {
    id: 4,
    nome: 'Barbara',
    cpf: '000.000.000-00',
    conselho: '00000-00',
    unidade: '77, 90',
    responsavel: 'Janice S',
    cargo: 'Psicólogo',
    status: 'Ativo',
  },
  {
    id: 5,
    nome: 'Raissa G',
    cpf: '000.000.000-00',
    conselho: '00000-00',
    unidade: '77, 93',
    responsavel: 'Janice S',
    cargo: 'Enfermeiro',
    status: 'Bloqueado',
  },
];

// Cor do texto de cada status, conforme a imagem de referência.
const statusClassName: Record<StatusProfissional, string> = {
  Ativo: 'text-emerald-600',
  Inativo: 'text-orange-500',
  Bloqueado: 'text-red-600',
};

const statusOpcoes: StatusProfissional[] = ['Ativo', 'Inativo', 'Bloqueado'];
const filtroOpcoes: Array<StatusProfissional | 'Todos'> = ['Todos', 'Ativo', 'Inativo', 'Bloqueado'];

// Estado inicial (vazio) do formulário de cadastro.
interface FormularioProfissional {
  nome: string;
  cpf: string;
  conselho: string;
  estado: string;
  cidade: string;
  dataNascimento: string;
  contato: string;
  email: string;
  confirmacaoEmail: string;
  senha: string;
  confirmacaoSenha: string;
  senhaProvisoria: string;
  cargo: string;
  nomeResponsavel: string;
  emailResponsavel: string;
}

const formularioVazio: FormularioProfissional = {
  nome: '',
  cpf: '',
  conselho: '',
  estado: '',
  cidade: '',
  dataNascimento: '',
  contato: '',
  email: '',
  confirmacaoEmail: '',
  senha: '',
  confirmacaoSenha: '',
  senhaProvisoria: '',
  cargo: '',
  nomeResponsavel: '',
  emailResponsavel: '',
};

// Classe usada em todos os inputs do formulário de cadastro.
const inputClassName =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-emerald-500';

function Profissionais() {
  const [profissionais, setProfissionais] = useState<Profissional[]>(profissionaisIniciais);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusProfissional | 'Todos'>('Todos');
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [menuStatusAbertoId, setMenuStatusAbertoId] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [formulario, setFormulario] = useState<FormularioProfissional>(formularioVazio);

  // Filtra por busca (nome, CPF, conselho ou unidade) e pelo status selecionado.
  const profissionaisFiltrados = profissionais.filter((prof) => {
    const termo = busca.trim().toLowerCase();
    const combinaBusca =
      !termo ||
      prof.nome.toLowerCase().includes(termo) ||
      prof.cpf.toLowerCase().includes(termo) ||
      prof.conselho.toLowerCase().includes(termo) ||
      prof.unidade.toLowerCase().includes(termo);

    const combinaStatus = filtroStatus === 'Todos' || prof.status === filtroStatus;

    return combinaBusca && combinaStatus;
  });

  // Atualiza o status de um profissional e fecha o menu.
  function alterarStatus(id: number, novoStatus: StatusProfissional) {
    setProfissionais((atual) =>
      atual.map((prof) => (prof.id === id ? { ...prof, status: novoStatus } : prof)),
    );
    setMenuStatusAbertoId(null);
  }

  function atualizarCampo(campo: keyof FormularioProfissional, valor: string) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  function fecharModal() {
    setModalAberto(false);
    setFormulario(formularioVazio);
  }

  // Cria o novo profissional a partir do formulário e adiciona na tabela.
  function cadastrarProfissional(e: FormEvent) {
    e.preventDefault();

    const novoProfissional: Profissional = {
      id: Date.now(),
      nome: formulario.nome,
      cpf: formulario.cpf,
      conselho: formulario.conselho,
      unidade: '77',
      responsavel: formulario.nomeResponsavel,
      cargo: formulario.cargo,
      status: 'Ativo',
    };

    setProfissionais((atual) => [...atual, novoProfissional]);
    fecharModal();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profissionais</h1>
          <p className="mt-1 text-sm text-gray-500">
            Aprove, supervisione e gerencie as clínicas privadas conveniadas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          + Cadastrar Profissional
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchOutlined className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou código..."
              className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm text-gray-700 outline-none focus:border-emerald-500"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setFiltroAberto((aberto) => !aberto)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <FilterOutlined />
              Filtrar por...
            </button>

            {filtroAberto && (
              <div className="absolute top-full right-0 z-20 mt-1 w-36 rounded-lg border border-gray-100 bg-white p-2 text-sm shadow-md">
                {filtroOpcoes.map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => {
                      setFiltroStatus(opcao);
                      setFiltroAberto(false);
                    }}
                    className={`block w-full rounded px-2 py-1 text-left hover:bg-gray-50 ${
                      filtroStatus === opcao ? 'font-semibold text-emerald-600' : 'text-gray-600'
                    }`}
                  >
                    {opcao}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs tracking-wide text-gray-400 uppercase">
                <th className="py-2 pr-4 font-medium">Nome</th>
                <th className="py-2 pr-4 font-medium">CPF</th>
                <th className="py-2 pr-4 font-medium">Conselho</th>
                <th className="py-2 pr-4 font-medium">Unidade</th>
                <th className="py-2 pr-4 font-medium">Responsável</th>
                <th className="py-2 pr-4 font-medium">Cargo</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {profissionaisFiltrados.map((prof) => (
                <tr key={prof.id} className="border-b border-gray-50 text-gray-700 last:border-0">
                  <td className="py-3 pr-4">{prof.nome}</td>
                  <td className="py-3 pr-4">{prof.cpf}</td>
                  <td className="py-3 pr-4">{prof.conselho}</td>
                  <td className="py-3 pr-4">{prof.unidade}</td>
                  <td className="py-3 pr-4">{prof.responsavel}</td>
                  <td className="py-3 pr-4">{prof.cargo}</td>
                  <td className={`py-3 pr-4 font-medium ${statusClassName[prof.status]}`}>
                    {prof.status}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="relative inline-block">
                      <button
                        type="button"
                        aria-label="Alterar status"
                        onClick={() =>
                          setMenuStatusAbertoId((atual) => (atual === prof.id ? null : prof.id))
                        }
                        className="text-gray-400 hover:text-emerald-600"
                      >
                        <EditOutlined />
                      </button>

                      {menuStatusAbertoId === prof.id && (
                        <div className="absolute top-full right-0 z-20 mt-1 w-32 rounded-lg border border-gray-100 bg-white p-2 shadow-md">
                          {statusOpcoes.map((opcao) => (
                            <button
                              key={opcao}
                              type="button"
                              onClick={() => alterarStatus(prof.id, opcao)}
                              className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-50"
                            >
                              {opcao}
                              <span
                                className={`h-3 w-3 rounded-full border ${
                                  prof.status === opcao
                                    ? 'border-emerald-600 bg-emerald-600'
                                    : 'border-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {profissionaisFiltrados.length === 0 && (
            <p className="py-6 text-center text-sm text-gray-400">
              Nenhum profissional encontrado.
            </p>
          )}
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-10">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Cadastrar Novo Profissional</h2>
                <p className="text-sm text-gray-500">Dados do colaborador</p>
              </div>

              <button
                type="button"
                aria-label="Fechar"
                onClick={fecharModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseOutlined />
              </button>
            </div>

            <p className="mt-4 text-sm font-semibold text-emerald-600">Dados</p>

            <form onSubmit={cadastrarProfissional} className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-600">Nome</label>
                <input
                  className={inputClassName}
                  value={formulario.nome}
                  onChange={(e) => atualizarCampo('nome', e.target.value)}
                  placeholder="Rafael Mendes de Sá"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">CPF</label>
                <input
                  className={inputClassName}
                  value={formulario.cpf}
                  onChange={(e) => atualizarCampo('cpf', e.target.value)}
                  placeholder="45.782.341/0001-90"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-sm text-gray-600">Conselho</label>
                <input
                  className={inputClassName}
                  value={formulario.conselho}
                  onChange={(e) => atualizarCampo('conselho', e.target.value)}
                  placeholder="84034939-00"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Estado</label>
                <input
                  className={inputClassName}
                  value={formulario.estado}
                  onChange={(e) => atualizarCampo('estado', e.target.value)}
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Cidade</label>
                <input
                  className={inputClassName}
                  value={formulario.cidade}
                  onChange={(e) => atualizarCampo('cidade', e.target.value)}
                  placeholder="Guarulhos"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Data de nascimento</label>
                <input
                  className={inputClassName}
                  value={formulario.dataNascimento}
                  onChange={(e) => atualizarCampo('dataNascimento', e.target.value)}
                  placeholder="01/01/2001"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Contato</label>
                <input
                  className={inputClassName}
                  value={formulario.contato}
                  onChange={(e) => atualizarCampo('contato', e.target.value)}
                  placeholder="(11) 3456-7890"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={formulario.email}
                  onChange={(e) => atualizarCampo('email', e.target.value)}
                  placeholder="rafael.mendes@vacinamais.com.br"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Confirmação de email</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={formulario.confirmacaoEmail}
                  onChange={(e) => atualizarCampo('confirmacaoEmail', e.target.value)}
                  placeholder="rafael.mendes@vacinamais.com.br"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Senha</label>
                <input
                  type="password"
                  className={inputClassName}
                  value={formulario.senha}
                  onChange={(e) => atualizarCampo('senha', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Confirmação de senha</label>
                <input
                  type="password"
                  className={inputClassName}
                  value={formulario.confirmacaoSenha}
                  onChange={(e) => atualizarCampo('confirmacaoSenha', e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Senha provisória</label>
                <input
                  className={inputClassName}
                  value={formulario.senhaProvisoria}
                  onChange={(e) => atualizarCampo('senhaProvisoria', e.target.value)}
                  placeholder="Vacina@2026"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Cargo</label>
                <input
                  className={inputClassName}
                  value={formulario.cargo}
                  onChange={(e) => atualizarCampo('cargo', e.target.value)}
                  placeholder="Enfermeiro"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-600">Nome Responsável</label>
                <input
                  className={inputClassName}
                  value={formulario.nomeResponsavel}
                  onChange={(e) => atualizarCampo('nomeResponsavel', e.target.value)}
                  placeholder="Carla Ribeiro"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-600">Email Responsável</label>
                <input
                  type="email"
                  className={inputClassName}
                  value={formulario.emailResponsavel}
                  onChange={(e) => atualizarCampo('emailResponsavel', e.target.value)}
                  placeholder="carla89@gmail.com"
                />
              </div>

              <div className="col-span-2 mt-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profissionais;
