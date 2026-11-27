/**
 * MOCK visual de recuperação de acesso do Cidadão.
 *
 * Esta camada NÃO chama a API nesta etapa: não procura a conta no banco,
 * não recupera o e-mail cadastrado e não envia e-mail. Para demonstrar o
 * fluxo, aceita CPF com 11 dígitos e qualquer código informado com 6 dígitos.
 * Após a aprovação simulada, a tela retorna ao login; não cria sessão nem
 * altera a senha.
 *
 * O backend já possui POST /auth/recuperacao/solicitar e
 * POST /auth/recuperacao/validar, mas o contrato atual também exige consumir
 * o recuperacao_token por /nova-senha ou /entrar. Esse fluxo precisa ser
 * alinhado com a regra de produto descrita em usuario/README_ENDPOINTS.md
 * antes de substituir este mock por chamadas HTTP.
 */

export type SolicitacaoCodigoResultado =
  | { status: 'enviado' }
  | { status: 'aguardar'; segundos: number }
  | { status: 'erro_conexao' }
  | { status: 'nao_integrado' };

export type ValidacaoCodigoResultado =
  | { status: 'ok' }
  | { status: 'invalido' }
  | { status: 'expirado' }
  | { status: 'tentativas_excedidas' }
  | { status: 'erro_conexao' }
  | { status: 'nao_integrado' };

function delay<T>(value: T, ms = 550): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), ms));
}

export async function solicitarCodigoRecuperacao(
  cpf: string,
): Promise<SolicitacaoCodigoResultado> {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return { status: 'nao_integrado' };
  return delay({ status: 'enviado' });
}

export async function validarCodigoRecuperacao(
  cpf: string,
  codigo: string,
): Promise<ValidacaoCodigoResultado> {
  const cpfDigits = cpf.replace(/\D/g, '');
  const codeDigits = codigo.replace(/\D/g, '');
  if (cpfDigits.length !== 11 || codeDigits.length !== 6) return { status: 'invalido' };
  return delay({ status: 'ok' });
}
