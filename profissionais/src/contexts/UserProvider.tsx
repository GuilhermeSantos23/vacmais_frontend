import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { UserContext } from './userContext';
import type { ContaAtual, ResultadoAutenticacao } from '../services/authService';
import {
  alterarSenha,
  cancelarDesafioDoisFatores,
  getCurrentAccount,
  login as loginApi,
  possuiSessao,
  reenviarDoisFatores,
  sair as sairApi,
  verificarDoisFatores,
} from '../services/authService';
import { clearSession } from '../services/sessionStore';

interface UserProviderProps { children: ReactNode; }

function UserProvider({ children }: UserProviderProps) {
  const [account, setAccount] = useState<ContaAtual | null>(null);
  const [userName, setUserName] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [twoFactorPending, setTwoFactorPending] = useState(false);

  const applyAccount = useCallback((nextAccount: ContaAtual) => {
    setAccount(nextAccount);
    setUserName(nextAccount.nome || '');
    setMustChangePassword(Boolean(nextAccount.deve_trocar_senha));
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      if (!possuiSessao()) {
        if (active) setIsAuthLoading(false);
        return;
      }
      try {
        const current = await getCurrentAccount();
        if (current.perfil !== 'profissional') throw new Error('Perfil de sessão incompatível.');
        if (active) applyAccount(current);
      } catch {
        clearSession();
        if (active) {
          setAccount(null);
          setUserName('');
          setIsAuthenticated(false);
          setMustChangePassword(false);
        }
      } finally {
        if (active) setIsAuthLoading(false);
      }
    }
    void restoreSession();
    return () => { active = false; };
  }, [applyAccount]);

  async function login(cpf: string, senha: string, codigoAcesso: string): Promise<ResultadoAutenticacao> {
    const result = await loginApi(cpf, senha, codigoAcesso);
    setTwoFactorPending(result.requiresTwoFactor);
    if (result.success && !result.requiresTwoFactor && result.account) {
      applyAccount(result.account);
    }
    return result;
  }

  async function verifyTwoFactor(codigo: string): Promise<ResultadoAutenticacao> {
    const result = await verificarDoisFatores(codigo);
    setTwoFactorPending(result.requiresTwoFactor);
    if (result.success && !result.requiresTwoFactor && result.account) {
      applyAccount(result.account);
    }
    return result;
  }

  async function resendTwoFactor(): Promise<string> {
    return reenviarDoisFatores();
  }

  function cancelTwoFactor(): void {
    cancelarDesafioDoisFatores();
    setTwoFactorPending(false);
  }

  async function logout(): Promise<void> {
    try { await sairApi(); } catch { /* encerra a sessão local mesmo se o servidor falhar */ } finally {
      setAccount(null);
      setUserName('');
      setAvatarId(null);
      setIsAuthenticated(false);
      setMustChangePassword(false);
      setTwoFactorPending(false);
    }
  }

  async function changePassword(
    senhaAtual: string,
    senhaNova: string,
    confirmacao: string,
  ): Promise<ResultadoAutenticacao> {
    const result = await alterarSenha(senhaAtual, senhaNova, confirmacao);
    if (result.account) applyAccount(result.account);
    if (result.success) setMustChangePassword(false);
    return result;
  }

  return (
    <UserContext.Provider value={{
      userName, setUserName, avatarId, setAvatarId, account,
      isAuthenticated, isAuthLoading, mustChangePassword, twoFactorPending,
      login, verifyTwoFactor, resendTwoFactor, cancelTwoFactor, logout, changePassword,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
