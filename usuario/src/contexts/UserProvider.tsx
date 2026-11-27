import { useEffect, useState, type ReactNode } from 'react';
import { UserContext, type ProfileData } from './userContext';
import type { AuthResult, RegisterData, User } from '../types/user';
import type { ContaAtual } from '../services/authService';
import {
  alterarSenhaCidadao,
  cancelarDoisFatoresCidadao,
  loginCidadao,
  obterContaAtual,
  obterDadosCidadao,
  possuiSessaoCidadao,
  reenviarDoisFatoresCidadao,
  sairCidadao,
  verificarDoisFatoresCidadao,
} from '../services/authService';
import { clearSession } from '../services/sessionStore';
import { cadastrarUsuario, atualizarUsuario, removerUsuarioLogado } from '../services/userService';

interface UserProviderProps { children: ReactNode; }
const USUARIO_VAZIO: User = {
  firstName: '', lastName: '', fullName: '', cpf: '', password: '', region: 'Não informada', avatarId: null,
};
interface DadosCidadaoApi {
  nome: string; cpf: string; email: string; telefone: string | null; cartao_sus: string | null;
}

function mapearUsuario(nome: string, cpf = '', email = '', telefone: string | null = null, cartaoSus: string | null = null): User {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  return {
    ...USUARIO_VAZIO,
    firstName: partes[0] ?? '',
    lastName: partes.slice(1).join(' '),
    fullName: nome.trim(),
    cpf,
    email,
    phone: telefone ?? '',
    susCard: cartaoSus ?? '',
  };
}

function UserProvider({ children }: UserProviderProps) {
  const [usuarioLogado, setUsuarioLogado] = useState<User>(USUARIO_VAZIO);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [twoFactorPending, setTwoFactorPending] = useState(false);

  async function carregarDadosDaConta(conta: ContaAtual): Promise<void> {
    if (conta.perfil !== 'cidadao') throw new Error('Esta conta não pertence ao perfil Cidadão.');
    setMustChangePassword(Boolean(conta.deve_trocar_senha));
    let dados: DadosCidadaoApi | null = null;
    try { dados = await obterDadosCidadao<DadosCidadaoApi>(); }
    catch { /* Conta com vínculo pendente pode não ter acesso a /cidadao/eu ainda. */ }
    const nextUser = dados
      ? mapearUsuario(dados.nome, dados.cpf, dados.email, dados.telefone, dados.cartao_sus)
      : mapearUsuario(conta.nome, '', conta.email);
    setUsuarioLogado(nextUser);
    setIsAuthenticated(true);
  }

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!possuiSessaoCidadao()) { if (active) setIsAuthLoading(false); return; }
      try {
        const conta = await obterContaAtual();
        if (conta.perfil !== 'cidadao') throw new Error('Perfil de sessão incompatível.');
        let dados: DadosCidadaoApi | null = null;
        try { dados = await obterDadosCidadao<DadosCidadaoApi>(); } catch { /* vínculo pendente */ }
        if (active) {
          setMustChangePassword(Boolean(conta.deve_trocar_senha));
          setUsuarioLogado(dados ? mapearUsuario(dados.nome, dados.cpf, dados.email, dados.telefone, dados.cartao_sus) : mapearUsuario(conta.nome, '', conta.email));
          setIsAuthenticated(true);
        }
      } catch {
        clearSession();
        if (active) { setUsuarioLogado(USUARIO_VAZIO); setIsAuthenticated(false); setMustChangePassword(false); }
      } finally { if (active) setIsAuthLoading(false); }
    }
    void restoreSession();
    return () => { active = false; };
  }, []);

  async function login(cpf: string, senha: string): Promise<AuthResult> {
    const result = await loginCidadao(cpf, senha);
    setTwoFactorPending(result.requiresTwoFactor);
    if (result.success && !result.requiresTwoFactor && result.account) await carregarDadosDaConta(result.account);
    return result;
  }

  async function verifyTwoFactor(codigo: string): Promise<AuthResult> {
    const result = await verificarDoisFatoresCidadao(codigo);
    setTwoFactorPending(result.requiresTwoFactor);
    if (result.success && !result.requiresTwoFactor && result.account) await carregarDadosDaConta(result.account);
    return result;
  }

  async function resendTwoFactor(): Promise<string> { return reenviarDoisFatoresCidadao(); }
  function cancelTwoFactor(): void { cancelarDoisFatoresCidadao(); setTwoFactorPending(false); }

  async function register(dados: RegisterData): Promise<AuthResult> {
    // Cadastro continua local nesta etapa; o README identifica a pendência de integração.
    return cadastrarUsuario(dados);
  }

  async function logout(): Promise<void> {
    try { await sairCidadao(); }
    finally {
      removerUsuarioLogado();
      setUsuarioLogado(USUARIO_VAZIO);
      setIsAuthenticated(false);
      setMustChangePassword(false);
      setTwoFactorPending(false);
    }
  }

  function atualizarCampo(usuarioComAlteracao: User) {
    setUsuarioLogado(usuarioComAlteracao);
    void atualizarUsuario(usuarioComAlteracao);
  }

  function setAvatarId(novoAvatarId: string | null) {
    atualizarCampo({ ...usuarioLogado, avatarId: novoAvatarId });
  }

  function updateProfile(dados: ProfileData) {
    const region = dados.region.trim() || 'Não informada';
    const firstName = dados.firstName.trim();
    const lastName = dados.lastName.trim();
    atualizarCampo({ ...usuarioLogado, firstName, lastName, fullName: `${firstName} ${lastName}`.trim(), email: dados.email, phone: dados.phone, susCard: dados.susCard, region });
  }

  async function changePassword(senhaAtual: string, novaSenha: string, confirmacaoNovaSenha: string): Promise<AuthResult> {
    if (!senhaNova.trim() || senhaNova !== confirmacaoNovaSenha) {
      return { success: false, message: 'A nova senha e a confirmação não coincidem.' };
    }
    const result = await alterarSenhaCidadao(senhaAtual, novaSenha, confirmacaoNovaSenha);
    setMustChangePassword(Boolean(result.mustChangePassword));
    return { success: result.success, message: result.message };
  }

  return (
    <UserContext.Provider value={{
      isAuthenticated, isAuthLoading, mustChangePassword, twoFactorPending,
      login, verifyTwoFactor, resendTwoFactor, cancelTwoFactor, register, logout,
      userName: usuarioLogado.firstName || 'Usuário', firstName: usuarioLogado.firstName,
      lastName: usuarioLogado.lastName, fullName: usuarioLogado.fullName, cpf: usuarioLogado.cpf,
      region: usuarioLogado.region, avatarId: usuarioLogado.avatarId,
      email: usuarioLogado.email ?? '', phone: usuarioLogado.phone ?? '', susCard: usuarioLogado.susCard ?? '',
      setAvatarId, updateProfile, changePassword,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
