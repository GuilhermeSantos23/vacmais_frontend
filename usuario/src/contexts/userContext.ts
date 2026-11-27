import { createContext } from 'react';
import type { AuthResult, RegisterData } from '../types/user';

export interface ProfileData {
  firstName: string; lastName: string; email: string; phone: string; susCard: string; region: string;
}

export interface UserContextValue {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  mustChangePassword: boolean;
  twoFactorPending: boolean;
  login: (cpf: string, senha: string) => Promise<AuthResult>;
  verifyTwoFactor: (codigo: string) => Promise<AuthResult>;
  resendTwoFactor: () => Promise<string>;
  cancelTwoFactor: () => void;
  register: (dados: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  cpf: string;
  region: string;
  avatarId: string | null;
  email: string;
  phone: string;
  susCard: string;
  setAvatarId: (id: string | null) => void;
  updateProfile: (dados: ProfileData) => void;
  changePassword: (senhaAtual: string, novaSenha: string, confirmacaoNovaSenha: string) => Promise<AuthResult>;
}

export const UserContext = createContext<UserContextValue | undefined>(undefined);
