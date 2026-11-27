/**
 * MOCK de recuperação até o backend disponibilizar endpoints para admin_regional.
 * Não consulta o banco e não envia e-mail real. A confirmação mock aprova qualquer
 * código de 6 dígitos. Substituir por chamadas HTTP quando o contrato existir.
 */
function delay<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), ms));
}

export interface PasswordRecoveryResult { success: boolean; }
export interface VerifyRecoveryCodeResult { success: boolean; }

export function requestPasswordRecovery(cpf: string, codigoRegional: string): Promise<PasswordRecoveryResult> {
  const cpfOk = cpf.replace(/\D/g, '').length === 11;
  const regionalOk = /^SAR\d{2}$/i.test(codigoRegional.trim());
  return delay({ success: cpfOk && regionalOk });
}

export function verifyRecoveryCode(cpf: string, codigoRegional: string, code: string): Promise<VerifyRecoveryCodeResult> {
  const cpfOk = cpf.replace(/\D/g, '').length === 11;
  const regionalOk = /^SAR\d{2}$/i.test(codigoRegional.trim());
  const codeOk = code.replace(/\D/g, '').length === 6;
  return delay({ success: cpfOk && regionalOk && codeOk });
}
