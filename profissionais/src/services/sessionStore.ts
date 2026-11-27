import type { ContaAtual } from './authService';

const PREFIX = 'vacmais:profissionais:auth:v1';
const ACCESS_TOKEN_KEY = `${PREFIX}:access-token`;
const CHALLENGE_KEY = `${PREFIX}:2fa-challenge`;
const ACCOUNT_KEY = `${PREFIX}:account`;
const PASSWORD_CHANGE_KEY = `${PREFIX}:must-change-password`;

function localStorageSafe(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function sessionStorageSafe(): Storage | null {
  return typeof window === 'undefined' ? null : window.sessionStorage;
}

export function getAccessToken(): string | null {
  return localStorageSafe()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function setAccessToken(token: string): void {
  localStorageSafe()?.setItem(ACCESS_TOKEN_KEY, token);
}

export function setTwoFactorChallenge(token: string): void {
  sessionStorageSafe()?.setItem(CHALLENGE_KEY, token);
}

export function getTwoFactorChallenge(): string | null {
  return sessionStorageSafe()?.getItem(CHALLENGE_KEY) ?? null;
}

export function clearTwoFactorChallenge(): void {
  sessionStorageSafe()?.removeItem(CHALLENGE_KEY);
}

export function saveAccount(account: ContaAtual): void {
  localStorageSafe()?.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

export function getSavedAccount(): ContaAtual | null {
  const raw = localStorageSafe()?.getItem(ACCOUNT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ContaAtual;
  } catch {
    return null;
  }
}

export function setMustChangePassword(required: boolean): void {
  localStorageSafe()?.setItem(PASSWORD_CHANGE_KEY, required ? 'true' : 'false');
}

export function getMustChangePassword(): boolean {
  return localStorageSafe()?.getItem(PASSWORD_CHANGE_KEY) === 'true';
}

export function clearSession(): void {
  localStorageSafe()?.removeItem(ACCESS_TOKEN_KEY);
  localStorageSafe()?.removeItem(ACCOUNT_KEY);
  localStorageSafe()?.removeItem(PASSWORD_CHANGE_KEY);
  clearTwoFactorChallenge();
}
