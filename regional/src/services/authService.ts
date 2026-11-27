import { ENDPOINTS } from './endpoints';
import { apiRequest } from './apiClient';
import {
  clearSession,
  clearTwoFactorChallenge,
  getAccessToken,
  getTwoFactorChallenge,
  saveAccount,
  setAccessToken,
  setMustChangePassword,
  setTwoFactorChallenge,
} from './sessionStore';

export type PerfilVacMais = 'cidadao' | 'profissional' | 'admin_unidade' | 'admin_regional';
const PERFIL_ATUAL: PerfilVacMais = 'admin_regional';

export interface ContaAtual {
  perfil: PerfilVacMais;
  id: number;
  nome: string;
  email: string;
  unidade_id: number | null;
  unidade_codigo: string | null;
  unidade_nome: string | null;
  regiao_id: number | null;
  regiao_codigo: string | null;
  regiao_nome: string | null;
  deve_trocar_senha: boolean;
  dois_fatores_ativo: boolean;
}

export interface ResultadoAutenticacao {
  success: boolean;
  requiresTwoFactor: boolean;
  message: string;
  account?: ContaAtual;
  mustChangePassword?: boolean;
}

interface RespostaLogin {
  dois_fatores_necessario: boolean;
  access_token?: string | null;
  token_type?: string;
  desafio_token?: string | null;
  mensagem?: string | null;
  deve_trocar_senha?: boolean;
}

function apenasDigitos(value: string): string {
  return value.replace(/\D/g, '');
}

async function concluirAutenticacao(resposta: RespostaLogin): Promise<ResultadoAutenticacao> {
  if (resposta.dois_fatores_necessario) {
    if (!resposta.desafio_token) {
      throw new Error('O servidor não retornou o token da verificação em duas etapas.');
    }
    setTwoFactorChallenge(resposta.desafio_token);
    return {
      success: true,
      requiresTwoFactor: true,
      message: resposta.mensagem ?? 'Informe o código enviado para seu e-mail.',
    };
  }

  if (!resposta.access_token) {
    clearSession();
    throw new Error('O servidor não retornou o token de acesso.');
  }

  setAccessToken(resposta.access_token);
  clearTwoFactorChallenge();

  try {
    const account = await getCurrentAccount();
    if (account.perfil !== PERFIL_ATUAL) {
      clearSession();
      throw new Error('Esta conta não pertence a este perfil do Vac+.');
    }
    const mustChange = Boolean(resposta.deve_trocar_senha || account.deve_trocar_senha);
    setMustChangePassword(mustChange);
    return {
      success: true,
      requiresTwoFactor: false,
      message: 'Login realizado com sucesso.',
      account,
      mustChangePassword: mustChange,
    };
  } catch (error) {
    clearSession();
    throw error;
  }
}

export async function login(cpf: string, senha: string, codigoAcesso?: string): Promise<ResultadoAutenticacao> {
  const payload: Record<string, string> = {
    perfil: PERFIL_ATUAL,
    cpf: apenasDigitos(cpf),
    senha,
  };

  payload.codigo_regional = (codigoAcesso ?? '').trim().toUpperCase();

  const response = await apiRequest<RespostaLogin>(ENDPOINTS.auth.login, {
    method: 'POST',
    auth: false,
    body: payload,
  });
  return concluirAutenticacao(response);
}

export async function verificarDoisFatores(codigo: string): Promise<ResultadoAutenticacao> {
  const desafioToken = getTwoFactorChallenge();
  if (!desafioToken) throw new Error('A verificação expirou. Faça login novamente.');

  const response = await apiRequest<RespostaLogin>(ENDPOINTS.auth.verifyTwoFactor, {
    method: 'POST',
    auth: false,
    body: { desafio_token: desafioToken, codigo: apenasDigitos(codigo) },
  });
  return concluirAutenticacao(response);
}

export async function reenviarDoisFatores(): Promise<string> {
  const desafioToken = getTwoFactorChallenge();
  if (!desafioToken) throw new Error('A verificação expirou. Faça login novamente.');

  const response = await apiRequest<{ mensagem: string }>(ENDPOINTS.auth.resendTwoFactor, {
    method: 'POST',
    auth: false,
    body: { desafio_token: desafioToken },
  });
  return response.mensagem;
}

export async function obterContaAtual(): Promise<ContaAtual> {
  const account = await apiRequest<ContaAtual>(ENDPOINTS.account.me);
  saveAccount(account);
  return account;
}

export const getCurrentAccount = obterContaAtual;

export async function sair(): Promise<void> {
  try {
    if (getAccessToken()) {
      await apiRequest<{ mensagem: string }>(ENDPOINTS.auth.logout, { method: 'POST' });
    }
  } catch {
    // Se o token expirou ou o servidor está indisponível, ainda assim encerra localmente.
  } finally {
    clearSession();
  }
}

export async function alterarSenha(
  senhaAtual: string,
  senhaNova: string,
  confirmacao: string,
): Promise<ResultadoAutenticacao> {
  await apiRequest<{ mensagem: string }>(ENDPOINTS.account.changePassword, {
    method: 'POST',
    body: { senha_atual: senhaAtual, senha_nova: senhaNova, confirmacao },
  });

  const account = await obterContaAtual();
  const mustChange = Boolean(account.deve_trocar_senha);
  setMustChangePassword(mustChange);
  return {
    success: !mustChange,
    requiresTwoFactor: false,
    message: mustChange ? 'A conta ainda exige a troca da senha.' : 'Senha alterada com sucesso.',
    account,
    mustChangePassword: mustChange,
  };
}

export function cancelarDesafioDoisFatores(): void {
  clearTwoFactorChallenge();
}

export function possuiSessao(): boolean {
  return Boolean(getAccessToken());
}
