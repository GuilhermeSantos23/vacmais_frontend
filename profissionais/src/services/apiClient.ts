import { getAccessToken, setAccessToken } from './sessionStore';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Use false em rotas públicas como login e verificação de 2FA. */
  auth?: boolean;
}

function messageFromPayload(payload: unknown, fallback: string): string {
  if (typeof payload === 'string' && payload.trim()) return payload;
  if (payload && typeof payload === 'object' && 'detail' in payload) {
    const detail = (payload as { detail?: unknown }).detail;
    if (typeof detail === 'string' && detail.trim()) return detail;
    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (!item || typeof item !== 'object' || !('msg' in item)) return '';
          return typeof item.msg === 'string' ? item.msg : '';
        })
        .filter(Boolean);
      if (messages.length) return messages.join(' ');
    }
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('A URL da API não foi configurada. Crie o arquivo .env com VITE_API_URL.');
  }

  const { body, auth = true, headers: suppliedHeaders, ...requestOptions } = options;
  const headers = new Headers(suppliedHeaders);
  headers.set('Accept', 'application/json');

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (isFormData || typeof body === 'string' || (typeof Blob !== 'undefined' && body instanceof Blob)) {
      requestBody = body as BodyInit;
    } else {
      headers.set('Content-Type', 'application/json');
      requestBody = JSON.stringify(body);
    }
  }

  if (auth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      body: requestBody,
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', 0, null);
  }

  // O backend pode renovar o JWT e devolvê-lo neste cabeçalho em qualquer rota autenticada.
  const renewedToken = response.headers.get('X-Novo-Token');
  if (renewedToken) setAccessToken(renewedToken);

  if (response.status === 204) {
    if (!response.ok) throw new ApiError('A API recusou a operação.', response.status, null);
    return undefined as T;
  }

  const raw = await response.text();
  let payload: unknown = null;
  if (raw) {
    try {
      payload = JSON.parse(raw) as unknown;
    } catch {
      payload = raw;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      messageFromPayload(payload, `A API retornou o erro ${response.status}.`),
      response.status,
      payload,
    );
  }

  return payload as T;
}
