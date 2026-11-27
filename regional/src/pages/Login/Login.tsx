import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import SelectField from '../../components/form/SelectField/SelectField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF } from '../../utils/masks';
import { useUser } from '../../hooks/useUser';

const REGIONAL_CODE_OPTIONS = [
  { value: 'SAR12', label: 'SAR12 (Pimentas)' },
  { value: 'SAR06', label: 'SAR06 (Cantareira)' },
  { value: 'SAR05', label: 'SAR05 (Centro)' },
];
interface LoginErrors { cpf?: string; senha?: string; codigoRegional?: string; codigo2FA?: string; }

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [codigoRegional, setCodigoRegional] = useState('');
  const [codigo2FA, setCodigo2FA] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, verifyTwoFactor, resendTwoFactor, cancelTwoFactor, isAuthenticated, isAuthLoading, mustChangePassword } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) navigate(mustChangePassword ? '/alterar-senha' : '/dashboard', { replace: true });
  }, [isAuthLoading, isAuthenticated, mustChangePassword, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors: LoginErrors = {};
    if (twoFactorRequired) {
      if (codigo2FA.replace(/\D/g, '').length !== 6) nextErrors.codigo2FA = 'Informe o código de 6 dígitos.';
    } else {
      if (cpf.replace(/\D/g, '').length !== 11) nextErrors.cpf = 'Informe um CPF válido.';
      if (!senha) nextErrors.senha = 'Senha é obrigatória.';
      if (!codigoRegional) nextErrors.codigoRegional = 'Selecione a regional.';
    }
    setErrors(nextErrors); setErrorMessage('');
    if (Object.keys(nextErrors).length) return;
    setIsSubmitting(true);
    try {
      const result = twoFactorRequired ? await verifyTwoFactor(codigo2FA) : await login(cpf, senha, codigoRegional);
      if (result.requiresTwoFactor) { setTwoFactorRequired(true); setMessage(result.message); setCodigo2FA(''); return; }
      if (result.success) navigate(result.mustChangePassword ? '/alterar-senha' : '/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível realizar o login.');
    } finally { setIsSubmitting(false); }
  }

  async function handleResendCode() {
    if (isSubmitting) return;
    setIsSubmitting(true); setErrorMessage('');
    try { setMessage(await resendTwoFactor()); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : 'Não foi possível reenviar o código.'); }
    finally { setIsSubmitting(false); }
  }

  function backToCredentials() {
    cancelTwoFactor(); setTwoFactorRequired(false); setCodigo2FA(''); setMessage(''); setErrorMessage('');
  }

  return (
    <AuthLayout>
      <div className="relative">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Acesso restrito</h2>
        <p className="mt-1 text-sm text-gray-500">{twoFactorRequired ? 'Confirme sua identidade para continuar.' : 'Autentique-se com suas credenciais regionais.'}</p>
        {message && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        {errorMessage && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          {twoFactorRequired ? (
            <>
              <FormField label="Código de verificação" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={codigo2FA} onChange={(event) => setCodigo2FA(maskNumeric(event.target.value, 6))} error={errors.codigo2FA} />
              <button type="button" onClick={handleResendCode} disabled={isSubmitting} className="self-start text-sm text-emerald-700 hover:underline disabled:opacity-50">Reenviar código</button>
              <button type="button" onClick={backToCredentials} disabled={isSubmitting} className="self-start text-sm text-gray-500 hover:underline">Voltar ao login</button>
            </>
          ) : (
            <>
              <FormField label="CPF" type="text" inputMode="numeric" autoComplete="username" placeholder="123.456.789-00" value={cpf} onChange={(event) => setCpf(maskCPF(event.target.value))} error={errors.cpf} />
              <FormField label="Senha" type="password" autoComplete="current-password" value={senha} onChange={(event) => setSenha(event.target.value)} error={errors.senha} />
              <SelectField label="Código da regional" value={codigoRegional} onChange={(event) => setCodigoRegional(event.target.value)} error={errors.codigoRegional} options={[{ value: '', label: 'Selecione a regional' }, ...REGIONAL_CODE_OPTIONS]} />
              <Link to="/esqueci-senha" className="text-sm text-emerald-700 hover:underline">Esqueci minha senha</Link>
            </>
          )}
          <button type="submit" disabled={isSubmitting} className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? 'Validando...' : twoFactorRequired ? 'Confirmar código' : 'Entrar'}
          </button>
        </form>
        {isSubmitting && <ValidationOverlay status="validating" validatingText={twoFactorRequired ? 'Verificando código...' : 'Validando credenciais...'} successText="" />}
      </div>
    </AuthLayout>
  );
}
export default Login;
