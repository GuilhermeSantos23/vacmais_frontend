import { createContext } from 'react';
import type { ContaAtual, ResultadoAutenticacao } from '../services/authService';

export interface UserContextValue {
  userName: string;
  setUserName: (name: string) => void;
  avatarId: string | null;
  setAvatarId: (id: string | null) => void;
  account: ContaAtual | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  mustChangePassword: boolean;
  twoFactorPending: boolean;
  login: (cpf: string, senha: string, codigoAcesso: string) => Promise<ResultadoAutenticacao>;
  verifyTwoFactor: (codigo: string) => Promise<ResultadoAutenticacao>;
  resendTwoFactor: () => Promise<string>;
  cancelTwoFactor: () => void;
  logout: () => Promise<void>;
  changePassword: (senhaAtual: string, senhaNova: string, confirmacao: string) => Promise<ResultadoAutenticacao>;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
