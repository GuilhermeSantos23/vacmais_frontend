import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import PasswordField from '../../components/form/PasswordField/PasswordField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF, maskNumeric } from '../../utils/masks';
import { cpfCompleto } from '../../utils/validators';
import { useUser } from '../../hooks/useUser';

interface LoginErrors { cpf?: string; senha?: string; codigo2FA?: string; }
type Etapa = 'formulario' | 'enviando';

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo2FA, setCodigo2FA] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [etapa, setEtapa] = useState<Etapa>('formulario');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [mensagemErroLogin, setMensagemErroLogin] = useState('');
  const [mensagemInfo, setMensagemInfo] = useState('');
  const { login, verifyTwoFactor, resendTwoFactor, cancelTwoFactor, isAuthenticated, isAuthLoading, mustChangePassword } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const cadastroSucesso = Boolean((location.state as { cadastroSucesso?: boolean } | null)?.cadastroSucesso);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) navigate(mustChangePassword ? '/alterar-senha' : '/home', { replace: true });
  }, [isAuthLoading, isAuthenticated, mustChangePassword, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (etapa !== 'formulario') return;
    const nextErrors: LoginErrors = {};
    if (twoFactorRequired) {
      if (codigo2FA.replace(/\D/g, '').length !== 6) nextErrors.codigo2FA = 'Informe o código de 6 dígitos.';
    } else {
      if (!cpfCompleto(cpf)) nextErrors.cpf = 'Informe um CPF válido.';
      if (!senha) nextErrors.senha = 'Senha é obrigatória.';
    }
    setErrors(nextErrors); setMensagemErroLogin('');
    if (Object.keys(nextErrors).length) return;
    setEtapa('enviando');
    try {
      const result = twoFactorRequired ? await verifyTwoFactor(codigo2FA) : await login(cpf, senha);
      if (result.requiresTwoFactor) {
        setTwoFactorRequired(true); setMensagemInfo(result.message); setCodigo2FA(''); setEtapa('formulario'); return;
      }
      if (result.success) navigate(result.mustChangePassword ? '/alterar-senha' : '/home', { replace: true });
    } catch (error) {
      setEtapa('formulario');
      setMensagemErroLogin(error instanceof Error ? error.message : 'Não foi possível fazer login. Tente novamente.');
    }
  }

  async function handleResendCode() {
    if (etapa !== 'formulario') return;
    setEtapa('enviando'); setMensagemErroLogin('');
    try { setMensagemInfo(await resendTwoFactor()); }
    catch (error) { setMensagemErroLogin(error instanceof Error ? error.message : 'Não foi possível reenviar o código.'); }
    finally { setEtapa('formulario'); }
  }

  function backToCredentials() {
    cancelTwoFactor(); setTwoFactorRequired(false); setCodigo2FA(''); setMensagemInfo(''); setMensagemErroLogin('');
  }

  return (
    <AuthLayout>
      <div className="relative">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{twoFactorRequired ? 'Verificação em duas etapas' : 'Bem-vindo de volta'}</h2>
        <p className="mt-1 text-sm text-gray-500">{twoFactorRequired ? 'Informe o código enviado para seu e-mail.' : 'Acesse sua conta Vac+'}</p>
        {cadastroSucesso && !twoFactorRequired && <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"><CheckCircleOutlined />Cadastro efetuado com sucesso</p>}
        {mensagemInfo && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{mensagemInfo}</p>}
        {mensagemErroLogin && <p role="alert" className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><CloseCircleOutlined />{mensagemErroLogin}</p>}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          {twoFactorRequired ? (
            <>
              <FormField label="Código de verificação" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={codigo2FA} onChange={(event) => setCodigo2FA(maskNumeric(event.target.value, 6))} error={errors.codigo2FA} />
              <button type="button" onClick={handleResendCode} disabled={etapa !== 'formulario'} className="self-start text-sm font-medium text-emerald-700 hover:underline disabled:opacity-50">Reenviar código</button>
              <button type="button" onClick={backToCredentials} disabled={etapa !== 'formulario'} className="self-start text-sm text-gray-500 hover:underline">Voltar ao login</button>
            </>
          ) : (
            <>
              <FormField label="CPF" type="text" inputMode="numeric" autoComplete="username" placeholder="123.456.789-00" value={cpf} onChange={(event) => setCpf(maskCPF(event.target.value))} error={errors.cpf} />
              <PasswordField label="Senha" autoComplete="current-password" value={senha} onChange={(event) => setSenha(event.target.value)} error={errors.senha} />
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <Link to="/recuperar-acesso" className="font-medium text-emerald-700 hover:underline">Esqueci minha senha</Link>
                <p>Não tem conta? <Link to="/cadastro" className="font-medium text-emerald-700 hover:underline">Cadastre-se</Link></p>
              </div>
            </>
          )}
          <button type="submit" disabled={etapa !== 'formulario'} className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
            {etapa === 'enviando' ? 'Entrando...' : twoFactorRequired ? 'Confirmar código' : 'Entrar'}
          </button>
        </form>
        {etapa === 'enviando' && <ValidationOverlay status="validating" validatingText={twoFactorRequired ? 'Verificando código...' : 'Validando dados...'} successText="" />}
      </div>
    </AuthLayout>
  );
}
export default Login;
