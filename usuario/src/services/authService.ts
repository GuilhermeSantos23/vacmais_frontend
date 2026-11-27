import { ENDPOINTS } from './endpoints';
import { apiRequest } from './apiClient';
import { clearSession, clearTwoFactorChallenge, getAccessToken, getTwoFactorChallenge, saveAccount, setAccessToken, setMustChangePassword, setTwoFactorChallenge } from './sessionStore';

export interface ContaAtual {
  perfil: 'cidadao' | 'profissional' | 'admin_unidade' | 'admin_regional';
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
export interface ResultadoAutenticacao { success: boolean; requiresTwoFactor: boolean; message: string; account?: ContaAtual; mustChangePassword?: boolean; }
interface RespostaLogin { dois_fatores_necessario: boolean; access_token?: string | null; desafio_token?: string | null; mensagem?: string | null; deve_trocar_senha?: boolean; }

function apenasDigitos(value: string) { return value.replace(/\D/g, ''); }

async function concluirAutenticacao(response: RespostaLogin): Promise<ResultadoAutenticacao> {
  if (response.dois_fatores_necessario) {
    if (!response.desafio_token) throw new Error('O servidor não retornou o token da verificação em duas etapas.');
    setTwoFactorChallenge(response.desafio_token);
    return { success: true, requiresTwoFactor: true, message: response.mensagem ?? 'Informe o código enviado para seu e-mail.' };
  }
  if (!response.access_token) { clearSession(); throw new Error('O servidor não retornou o token de acesso.'); }
  setAccessToken(response.access_token); clearTwoFactorChallenge();
  try {
    const account = await obterContaAtual();
    if (account.perfil !== 'cidadao') { clearSession(); throw new Error('Esta conta não pertence ao perfil Cidadão.'); }
    const mustChange = Boolean(response.deve_trocar_senha || account.deve_trocar_senha);
    setMustChangePassword(mustChange);
    return { success: true, requiresTwoFactor: false, message: 'Login realizado com sucesso.', account, mustChangePassword: mustChange };
  } catch (error) { clearSession(); throw error; }
}

export async function loginCidadao(cpf: string, senha: string): Promise<ResultadoAutenticacao> {
  const response = await apiRequest<RespostaLogin>(ENDPOINTS.auth.login, {
    method: 'POST', auth: false,
    body: { perfil: 'cidadao', cpf: apenasDigitos(cpf), senha },
  });
  return concluirAutenticacao(response);
}

export async function verificarDoisFatoresCidadao(codigo: string): Promise<ResultadoAutenticacao> {
  const desafioToken = getTwoFactorChallenge();
  if (!desafioToken) throw new Error('A verificação expirou. Faça login novamente.');
  const response = await apiRequest<RespostaLogin>(ENDPOINTS.auth.verifyTwoFactor, {
    method: 'POST', auth: false, body: { desafio_token: desafioToken, codigo: apenasDigitos(codigo) },
  });
  return concluirAutenticacao(response);
}

export async function reenviarDoisFatoresCidadao(): Promise<string> {
  const desafioToken = getTwoFactorChallenge();
  if (!desafioToken) throw new Error('A verificação expirou. Faça login novamente.');
  const result = await apiRequest<{ mensagem: string }>(ENDPOINTS.auth.resendTwoFactor, {
    method: 'POST', auth: false, body: { desafio_token: desafioToken },
  });
  return result.mensagem;
}

export async function obterContaAtual(): Promise<ContaAtual> {
  const account = await apiRequest<ContaAtual>(ENDPOINTS.account.me);
  saveAccount(account);
  return account;
}

export async function obterDadosCidadao<T>(): Promise<T> {
  return apiRequest<T>(ENDPOINTS.citizen.me);
}

export async function sairCidadao(): Promise<void> {
  try { if (getAccessToken()) await apiRequest(ENDPOINTS.auth.logout, { method: 'POST' }); }
  catch { /* a sessão local deve ser encerrada mesmo sem resposta do servidor */ }
  finally { clearSession(); }
}

export async function alterarSenhaCidadao(senhaAtual: string, senhaNova: string, confirmacao: string): Promise<ResultadoAutenticacao> {
  await apiRequest(ENDPOINTS.account.changePassword, { method: 'POST', body: { senha_atual: senhaAtual, senha_nova: senhaNova, confirmacao } });
  const account = await obterContaAtual();
  const mustChange = Boolean(account.deve_trocar_senha);
  setMustChangePassword(mustChange);
  return { success: !mustChange, requiresTwoFactor: false, message: mustChange ? 'A conta ainda exige a troca da senha.' : 'Senha alterada com sucesso.', account, mustChangePassword: mustChange };
}

export function cancelarDoisFatoresCidadao(): void { clearTwoFactorChallenge(); }
export function possuiSessaoCidadao(): boolean { return Boolean(getAccessToken()); }
