import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
import AuthLayout from '../../layouts/AuthLayout/AuthLayout';
import FormField from '../../components/form/FormField/FormField';
import ValidationOverlay from '../../components/common/ValidationOverlay/ValidationOverlay';
import { maskCPF } from '../../utils/masks';

interface LoginErrors {
  cpf?: string;
  senha?: string;
}

type ValidationStep = 'idle' | 'validating' | 'success';

function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [validationStep, setValidationStep] = useState<ValidationStep>('idle');

  const navigate = useNavigate();
  const location = useLocation();
  const cadastroSucesso = Boolean(
    (location.state as { cadastroSucesso?: boolean } | null)?.cadastroSucesso,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const novosErros: LoginErrors = {};
    if (!cpf.trim()) novosErros.cpf = 'CPF é obrigatório.';
    if (!senha.trim()) novosErros.senha = 'Senha é obrigatória.';

    setErrors(novosErros);

    if (Object.keys(novosErros).length === 0) {
      setValidationStep('validating');
    }
  }

  // Como ainda não existe backend de autenticação, este efeito só agenda as
  // próximas transições visuais (validando → sucesso → Home). Nenhum
  // token/JWT é criado aqui — isso será feito quando a API real de login
  // for integrada.
  useEffect(() => {
    if (validationStep === 'validating') {
      const timer = setTimeout(() => setValidationStep('success'), 900);
      return () => clearTimeout(timer);
    }

    if (validationStep === 'success') {
      const timer = setTimeout(() => navigate('/home'), 800);
      return () => clearTimeout(timer);
    }
  }, [validationStep, navigate]);

  return (
    <AuthLayout>
      <div className="relative">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Bem-vindo de volta
        </h2>
        <p className="mt-1 text-sm text-gray-500">Acesse sua conta Vac+</p>

        {cadastroSucesso && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <CheckCircleOutlined />
            Cadastro efetuado com sucesso
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <FormField
            label="CPF"
            type="text"
            inputMode="numeric"
            placeholder="123.456.789-00"
            value={cpf}
            onChange={(event) => setCpf(maskCPF(event.target.value))}
            error={errors.cpf}
          />

          <FormField
            label="Senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            error={errors.senha}
          />

          <p className="text-sm text-gray-600">
            Não tem conta?{' '}
            <Link
              to="/cadastro"
              className="font-medium text-emerald-700 hover:underline"
            >
              Cadastre-se
            </Link>
          </p>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-300 py-3 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
          >
            Entrar
          </button>
        </form>

        {validationStep !== 'idle' && (
          <ValidationOverlay
            status={validationStep === 'validating' ? 'validating' : 'success'}
            validatingText="Validando dados..."
            successText="Dados corretos"
          />
        )}
      </div>
    </AuthLayout>
  );
}

export default Login;
